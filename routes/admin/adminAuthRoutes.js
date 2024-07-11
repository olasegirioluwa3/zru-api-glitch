import express from 'express';
import mongoose from 'mongoose';
import authenticateToken from '../../middlewares/auth.admin.middleware.js';
import adminController from '../../controllers/adminController.js';
import validateUserData from "../../middlewares/validator/userValidator.js";
const router = express.Router();

export default function adminAuthRoutes(app, io, sequelize) {
  // Welcome route
  router.get('/', authenticateToken, async (req, res) => {
    try {
      res.status(200).json({ status: "success", message: 'Welcome to RumbleGate' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed", message: 'Failed to send welcome message', error: error.message });
    }
  });

  router.post('/register', async (req, res) => {
    try {
      console.log("api/users/register");
      const { data, errors } = await validateUserData( req.body );
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
      await adminController.registerAdmin(req, res, data);
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: "failed", message: 'Register failed on R', error: error.message });
    }
  });

  router.post('/auth/send-login-verification', async (req, res) => {
    console.log("api/admin/rumblegate/auth/send-login-verification");
    try {
      await adminController.sendLoginVerificationEmail(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed", message: 'Failed to send login verification email', error: error.message });
    }
  });

  router.post('/auth/login-with-token', async (req, res) => {
    console.log("api/admin/rumblegate/auth/login-with-token");
    try {
      await adminController.loginWithToken(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed", message: 'Failed to login with token', error: error.message });
    }
  });

  // List all tables
  router.get('/tables', async (req, res) => {
    console.log("api/admin/rumblegate/tables get all tables");
    try {
      await adminController.listTables(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed", message: 'Failed to list tables', error: error.message });
    }
  });

  // List all tables with counts
  router.get('/tables/counts', authenticateToken, async (req, res) => {
    console.log("api/admin/rumblegate/tables get all tables and counts");
    try {
      await adminController.listTablesWithCounts(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed", message: 'Failed to get table row counts', error: error.message });
    }
  });

  // Create a new table
  router.post('/tables/create', authenticateToken, async (req, res) => {
    console.log("api/admin/rumblegate/tables/create !caution creates new table");
    try {
      await adminController.createTable(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed", message: 'Failed to create table', error: error.message });
    }
  });

  router.delete('/tables/:table', authenticateToken, async (req, res) => {
    console.log(`api/admin/rumblegate/tables/:${req.params.table} delete table`);
    try {
      await adminController.deleteTable(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed", message: `Failed to delete table ${req.params.table}`, error: error.message });
    }
  });

  // List items in a table
  router.get('/:table', authenticateToken, async (req, res) => {
    console.log("api/admin/rumblegate/:table get a table rows");
    try {
      await adminController.listTableItems(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed", message: `Failed to list items in ${req.params.table}`, error: error.message });
    }
  });

  // View a specific item in a table
  router.get('/:table/:id', authenticateToken, async (req, res) => {
    console.log("api/admin/rumblegate/:table/:id get a row from a table");
    try {
      await adminController.viewTableItem(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed", message: `Failed to view item in ${req.params.table}`, error: error.message });
    }
  });

  // Edit a specific item in a table
  router.put('/:table/:id', authenticateToken, async (req, res) => {
    console.log("api/admin/rumblegate/:table/:id update a row on table");
    try {
      await adminController.editTableItem(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed", message: `Failed to update item in ${req.params.table}`, error: error.message });
    }
  });

  // Delete a specific item in a table
  router.delete('/:table/:id', authenticateToken, async (req, res) => {
    console.log("api/admin/rumblegate/:table/:id delete a row from a table");
    try {
      await adminController.deleteTableItem(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed", message: `Failed to delete item in ${req.params.table}`, error: error.message });
    }
  });

  // Add a record to a table
  router.post('/:table', async (req, res) => {
    console.log(`api/admin/rumblegate/:${req.params.table} add a record to a table`);
    try {
      await adminController.addTableItem(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed", message: `Failed to add item in ${req.params.table}`, error: error.message });
    }
  });

  app.use('/api/admin/rumblegate', router);
}
