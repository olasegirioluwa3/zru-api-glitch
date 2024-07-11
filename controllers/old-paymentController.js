import crypto from 'crypto';
import { Sequelize } from 'sequelize';
import db from '../models/index.js';
const sequelize = db.sequelize;
import sendEmail from '../utils/email.js';
import PaymentGateway from '../services/gateways/paymentGateway.js';
import PaystackGateway from '../services/gateways/paystackGateway.js';
import StripeGateway from '../services/gateways/stripeGateway.js';

function generateToken() {
  return crypto.randomBytes(20).toString("hex");
}

const domain = process.env.APP_WEBSITE_URL || 'localhost:3000';
const { payment: Payment, user: User, serviceaccess: ServiceAccess, service: ServiceType } = sequelize.models;

async function create(req, res, data) {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(400).send({ status: 'failed', error: 'Unknown user' });

        // get cost info of the service
        let paymentData = {};
        const serviceaccess = await ServiceAccess.findByPk(data.saId);
        if (serviceaccess) {
            // get data from service
            const service = await ServiceType.findByPk(serviceaccess.svId);
            if (!service) {
                return res.status(400).send({ status: 'failed', error: 'Unknown service' });
            }

            // initiate payment
            paymentData.userId = req.user.id;
            paymentData.email = user.email;
            paymentData.full_name = `${user.firstName} ${user.lastName}`;
            paymentData.saId = serviceaccess.id;

            // get cost info of the service
            paymentData.gateway = data.gateway || service.svPaymentGateway;
            paymentData.currency = data.currency || service.svPaymentCurrency;

            // Calculate price and paymentNextDate
            let quantity = parseInt(data.quantity, 10) || 1;
            paymentData.quantity = quantity;
            let price = parseInt(service.svPaymentAmount, 10);
            let paymentNextDate = new Date(serviceaccess.paymentNextDate);
            paymentNextDate.setMonth(paymentNextDate.getMonth() + quantity);
            price = parseInt(service.svPaymentAmount, 10) * quantity;

            let paymentGateway = PaymentGateway;
            let finalAmount;

            if (paymentData.gateway === 'Paystack') {
                paymentGateway = new PaystackGateway();
                const decimalFee = 1.95 / 100.0;
                const flatFee = (parseInt(price, 10) * (1.5 / 100)) + 100;
                const capFee = 2000.0;
                const applicableFees = (parseInt(decimalFee, 10) * parseInt(price, 10)) + parseInt(flatFee, 10);
                finalAmount = applicableFees >= capFee ? parseInt(price, 10) + parseInt(capFee, 10) : ((parseInt(price, 10) + parseInt(flatFee, 10)) / (1 - parseInt(decimalFee, 10))) + 0.01;
            } else if (paymentData.gateway === 'Stripe') {
                paymentGateway = new StripeGateway();
            } else {
                return res.status(400).send({ status: 'failed', error: 'Invalid payment gateway' });
            }

            paymentData.amount = finalAmount;
            const callbackUrl = process.env.PAYMENT_CALLBACK_URL || callbackURL;
            const paymentDetails = await paymentGateway.initiatePayment(paymentData.amount, paymentData.currency, paymentData, callbackUrl);
            if (!paymentDetails) return res.status(400).send({ status: 'failed', error: 'Try another quantity' });

            // Create a payment
            paymentData.amountPaid = '0';
            paymentData.paymentReference = paymentDetails.data.reference;
            paymentData.paymentNextDate = paymentNextDate;
            console.log(paymentData);
            const payment = await Payment.create(paymentData);
            if (!payment) {
                return res.status(400).send({ status: 'failed', error: 'Create payment failed' });
            } else {
                return res.status(201).send({ payment, paymentDetails, status: 'success', message: 'Payment recorded successfully!' });
            }
        } else {
            return res.status(400).send({ status: 'failed', error: 'Invalid Service Access Id saId' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Create payment failed on C', error });
    }
}

async function getAll(req, res, data) {
    try {
        const user = await User.findByPk(data.userId);
        const whatsapp = await Whatsapp.findAll({ userId: user.id });

        if (!whatsapp) {
            return res.status(401).json({ message: 'Whatsapp registration failed, Invalid Token, try again' });
        }

        return res.status(200).json({ status: 'success', whatsapp });
    } catch (error) {
        console.error(error.message);
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).json({ message: 'Email already exists' });
        } else {
            res.status(500).json({ message: 'Registration failed on C' });
        }
    }
}

async function getOne(req, res, data) {
    try {
        const payment = await Payment.findOne({ where: { paymentReference: data.paymentReference } });
        if (!payment) {
            return res.status(401).json({ message: 'No payment found, Try again' });
        }
        return res.status(200).json({ status: 'success', payment });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'get one payment failed on C' });
    }
}

async function verify(req, res, data) {
    try {
        const payment = await Payment.findOne({ where: { paymentReference: data.paymentReference } });
        if (!payment) {
            return res.status(401).json({ message: 'No payment found, Try again' });
        }

        let serviceaccess = await ServiceAccess.findByPk(payment.saId);
        if (!serviceaccess) {
            return res.status(401).json({ message: 'No service access found, Try again' });
        }

        const gateway = payment.gateway;
        const paymentReference = payment.paymentReference;

        let paymentGateway;
        if (gateway === 'Paystack') {
            paymentGateway = new PaystackGateway();
        } else if (gateway === 'Stripe') {
            paymentGateway = new StripeGateway();
        } else {
            return res.status(400).send({ status: 'failed', error: 'Invalid payment gateway' });
        }

        // check paystack for payment status
        const verificationDetails = await paymentGateway.verifyPayment(paymentReference);

        // checking my payment status
        if (verificationDetails.data.status === 'success') {
            payment.paymentStatus = 'Completed';
            payment.amountPaid = verificationDetails.data.amount / 100.0;
            serviceaccess.status = 'Active';
            serviceaccess.amountPaid = verificationDetails.data.amount / 100.0;

            // check if payment is not already used
            if (payment.paymentFullfilled !== 'Yes') {
                console.log('not yet ready');
                payment.paymentFullfilled = 'Yes';
                serviceaccess.paymentNextDate = payment.paymentNextDate;
                // update serviceAccess

                // :adding the total months to the sa expire.
                await serviceaccess.save();
            }
        } else if (verificationDetails.status === 'failed') {
            payment.paymentStatus = 'Failed';
        }
        await payment.save();
        return res.send({ payment, verificationDetails, status: 'success', message: 'Payment status updated successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'get one payment failed on C' });
    }
}

const paymentController = {
  generateToken,
  create,
  getAll,
  getOne,
  verify,
};

export default paymentController;
