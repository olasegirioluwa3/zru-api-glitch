import express from 'express';
const router = express.Router();
import authenticateToken from '../middlewares/auth.user.middleware.js';
import adminController from '../controllers/adminController.js';

export default function adminRoutes(app, io, sequelize) {
  
  // Table management routes
  router.get('/', async (req, res) => {
    try {
        res.status(500).json({ status: "success", message: 'Welcome to RumbleGate' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed", message: 'Failed to list tables', error: error.message });
    }
  });

  router.get('/tables', async (req, res) => {
    console.log("api/admin/rumblegate/tables get all tables");
    try {
      await adminController.listTables(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed", message: 'Failed to list tables', error: error.message });
    }
  });

  router.get('/tables/counts', async (req, res) => {
    console.log("api/admin/rumblegate/tables get all tables and counts");
    try {
      await adminController.listTablesWithCounts(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed", message: 'Failed to get table row counts', error: error.message });
    }
  });

  router.post('/tables/create', authenticateToken, async (req, res) => {
    console.log("api/admin/rumblegate/tables/create !caution creates new table");
    try {
      await adminController.createTable(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed", message: 'Failed to create table', error: error.message });
    }
  });

  router.get('/:table', async (req, res) => {
    console.log("api/admin/rumblegate/:table get a table rows");
    try {
      await adminController.listTableItems(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed", message: `Failed to list items in ${req.params.table}`, error: error.message });
    }
  });

  router.get('/:table/:id', async (req, res) => {
    console.log("api/admin/rumblegate/:table/:id get a row from a table");
    try {
      await adminController.viewTableItem(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed", message: `Failed to view item in ${req.params.table}`, error: error.message });
    }
  });

  router.put('/:table/:id', async (req, res) => {
    console.log("api/admin/rumblegate/:table/:id update a row on table");
    try {
      await adminController.editTableItem(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed", message: `Failed to update item in ${req.params.table}`, error: error.message });
    }
  });

  router.delete('/:table/:id', async (req, res) => {
    console.log("api/admin/rumblegate/:table/:id delete a row from a table");
    try {
      await adminController.deleteTableItem(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed", message: `Failed to delete item in ${req.params.table}`, error: error.message });
    }
  });

    router.post('/:table', async (req, res) => {
        console.log("api/admin/rumblegate/:table add a record to a table");
        try {
            await adminController.addTableItem(req, res);
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "failed", message: `Failed to delete item in ${req.params.table}`, error: error.message });
        }
    });

    app.use('/api/admin/rumblegate', router);
}
