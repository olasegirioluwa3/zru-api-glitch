import mongoose from 'mongoose';

const regCenterSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    default: '',
  },
  lastName: {
    type: String,
    required: true,
    default: '',
  },
  middleName: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /\S+@\S+\.\S+/.test(v); // Basic email validation
      },
      message: props => `${props.value} is not a valid email address!`,
    },
  },
  centerName: {
    type: String,
    default: '',
  },
  centerSlug: {
    type: String,
    unique: true,
    default: '',
  },
  gender: {
    type: String,
    default: '',
  },
  emailVerificationToken: {
    type: String,
    required: false,
    default: '',
  },
  emailVerificationStatus: {
    type: String,
    enum: ['pending', 'activated', 'blocked'],
    default: 'pending',
  },
  emailVerificationExpires: {
    type: String,
    required: false,
    default: '',
  },
  password: {
    type: String,
    required: true,
  },
  resetPasswordToken: {
    type: String,
    default: '',
  },
  resetPasswordExpires: {
    type: String,
    default: '',
  },
  accountStatus: {
    type: String,
    enum: ['pending', 'in-review', 'activated', 'blocked'],
    default: 'pending',
  },
  profilePicture: {
    type: String,
    default: '',
  },
  coverPicture: {
    type: String,
    default: '',
  },
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function(v) {
        return v instanceof Date && !isNaN(v);
      },
      message: props => `${props.value} is not a valid date!`,
    },
  },
  phoneNumber: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  country: {
    type: String,
    default: '',
  },
  state: {
    type: String,
    default: '',
  },
  city: {
    type: String,
    default: '',
  },
  localGovernment: {
    type: String,
    default: '',
  },
  zipCode: {
    type: String,
    default: '',
  },
  bankName: {
    type: String,
    default: '',
  },
  bankAccountNumber: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
});

// Adding methods to the schema
regCenterSchema.statics.emailExist = async function(email) {
  const regcenter = await this.findOne({ email });
  return !!regcenter;
};

const RegCenter = mongoose.model('RegCenter', regCenterSchema);

export default RegCenter;
