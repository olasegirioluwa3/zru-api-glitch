import crypto from "crypto";
import jwt from "jsonwebtoken";
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';
import db from '../models/index.js';
const sequelize = db.sequelize;
const Admin = sequelize.models.admin;
// import validateUserData from "../middlewares/validator/userValidator.js";
import email from "../utils/email.js";
const { sendEmail } = email;
const domain = process.env.APP_WEBSITE_URL || "localhost:3000";

const generateToken = () => {
  return crypto.randomBytes(20).toString("hex");
};

// Helper function to check if a table exists
async function tableExists(tableName) {
  const [results] = await sequelize.query(
    "SELECT name FROM sqlite_master WHERE type='table' AND name=?;",
    { replacements: [tableName] }
  );
  return results.length > 0;
}

function getModelNameFromTableName(tableName) {
    const models = sequelize.models;
    const modelNames = Object.keys(models);
  
    for (const modelName of modelNames) {
      const model = models[modelName];
  
      // Check if the model's table name matches the provided table name
      if (model.getTableName() === tableName) {
        return modelName;
      }
    }
  
    // If no matching model is found, return null
    return null;
}

async function sendLoginVerificationEmail(req, res) {
    const { email } = req.body;
    try {
        const admin = await Admin.findOne({ where: { email, role: 'admin'||'server'||'rumble' } });
        if (!admin) {
            return res.status(404).json({ error: 'Admin with this email not found' });
        }
    
        const token = generateToken();
        const tokenExpiry = Date.now() + 3600000; // Token expires in 1 hour
    
        admin.emailVerificationToken = token;
        admin.emailVerificationExpires = tokenExpiry;
        
        const verifyLink = `${domain}/admin/rumblegate/email-verify/${token}`;
        const emailText = `You are receiving this because you (or someone else) have requested the login for your account.\n\n` +
          `Please use the following token to login:\n\n` +
          `${token}\n\n` +
          `If you did not request this, please ignore this email.\n, click on the following link: ${verifyLink}`;
        
        if (await admin.save()) {
            await sendEmail(admin.email, `Login Verification Token expires by ${tokenExpiry}`, emailText);
            return res.status(201).json({ message: "Verification token sent to email" });
        } else {
            return res.status(401).json({ message: "Registration failed, try again" });
        }

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: `Error sending verification email: ${error.message}` });
    }
}

async function loginWithToken(req, res) {
    const { email, token } = req.body;
  
    try {
        const admin = await Admin.findOne({
            where: {
            email,
            role: 'admin',
            emailVerificationToken: token,
            emailVerificationExpires: { [Op.gt]: Date.now() }
            }
        });
    
        if (!admin) {
            return res.status(400).json({ error: 'Invalid token or token has expired' });
        }
    
        const authToken = jwt.sign(
            { id: admin.id, role: admin.role },
            process.env.APP_SECRET_KEY,
            { expiresIn: "24h" }
        );
        
        admin.emailVerificationToken = '';
        admin.emailVerificationExpires = '';
        await admin.save();
    
        return res.status(200).json({ message: 'Login successful', token: authToken, user: { id: admin.id, email, role: admin.role }});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: `Error logging in: ${error.message}` });
    }
}

async function listTables(req, res) {
  try {
    const [results] = await sequelize.query(
      "SELECT name FROM sqlite_master WHERE type='table';"
    );
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: 'Failed to list tables', error: error.message });
  }
}

async function listTablesWithCounts(req, res) {
  try {
    const tables = Object.keys(sequelize.models);
    const counts = await Promise.all(
      tables.map(async (table) => {
        const count = await sequelize.models[table].count();
        return { table, count };
      })
    );
    res.status(200).json(counts);
  } catch (error) {
    res.status(400).json({ error: `Error retrieving table counts: ${error.message}` });
  }
}

async function listTableItems(req, res) {
  const tableName = req.params.table;
  try {
    if (!await tableExists(tableName)) {
      return res.status(400).json({ error: `Table ${tableName} does not exist` });
    }
    const [results] = await sequelize.query(`SELECT * FROM ${tableName};`);
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: `Failed to list items in ${tableName}`, error: error.message });
  }
}

async function viewTableItem(req, res) {
  const tableName = req.params.table;
  const itemId = req.params.id;
  try {
    if (!await tableExists(tableName)) {
      return res.status(400).json({ error: `Table ${tableName} does not exist` });
    }
    const [result] = await sequelize.query(`SELECT * FROM ${tableName} WHERE id = ? LIMIT 1;`, {
      replacements: [itemId],
      type: Sequelize.QueryTypes.SELECT,
    });
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: `Failed to view item in ${tableName}`, error: error.message });
  }
}

async function editTableItem(req, res) {
    const { table, id } = req.params;
    try {
        // Get model name from table name
        const modelName = getModelNameFromTableName(table);
        if (!modelName) {
            return res.status(400).json({ error: `Table ${table} does not exist` });
        }
    
        // Use the model to update the record
        const [updated] = await sequelize.models[modelName].update(req.body, {
            where: { id }
        });
        if (!updated) {
            return res.status(404).json({ error: `${table} item not found` });
        }
        const updatedItem = await sequelize.models[modelName].findByPk(id);
        res.status(200).json(updatedItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Error updating item in ${table}: ${error.message}` });
    }
}
  
async function deleteTableItem(req, res) {
    const { table, id } = req.params;
  
    try {
        // Get model name from table name
        const modelName = getModelNameFromTableName(table);
        if (!modelName) {
            return res.status(400).json({ error: `Table ${table} does not exist` });
        }
    
        // Use the model to delete the record
        const deleted = await sequelize.models[modelName].destroy({
            where: { id }
        });
        if (!deleted) {
            return res.status(404).json({ error: `${table} item not found` });
        }
        res.status(200).json({ message: `${table} item deleted successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Error deleting item in ${table}: ${error.message}` });
    }
}  

async function createTable(req, res) {
  const { tableName, fields } = req.body;

  if (!tableName || !fields || !Array.isArray(fields) || fields.length === 0) {
    return res.status(400).json({ error: "Invalid table name or fields" });
  }

  try {
    const modelFields = {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      }
    };

    fields.forEach(field => {
      modelFields[field.name] = {
        type: Sequelize[field.type.toUpperCase()],
        allowNull: field.allowNull || true,
        defaultValue: field.defaultValue || null,
        unique: field.unique || false
      };
    });

    const NewModel = sequelize.define(tableName, modelFields, {
      timestamps: true,
    });

    await NewModel.sync({ force: true });

    sequelize.models[tableName] = NewModel;

    res.status(201).json({ message: `${tableName} created successfully` });
  } catch (error) {
    res.status(400).json({ error: `Error creating table: ${error.message}` });
  }
}

async function addTableItem(req, res) {
    const { table } = req.params;
    const data = req.body;
    
    try {
        // Get model name from table name
        const modelName = getModelNameFromTableName(table);
        if (!modelName) {
            return res.status(400).json({ error: `Table ${table} does not exist` });
        }
    
        // Use the model to create the new record
        const newItem = await sequelize.models[modelName].create(data);
        res.status(201).json({ message: `${table} item created successfully`, newItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Error creating item in ${table}: ${error.message}` });
    }
}

async function deleteTable(req, res) {
    const { table } = req.params;
  
    try {
      // Check if the table exists
      const [results] = await sequelize.query(
        "SELECT name FROM sqlite_master WHERE type='table' AND name=?;",
        {
          replacements: [table],
        }
      );
  
      console.log(results);
      if (results.length === 0) {
        
        return res.status(404).json({ error: `Table ${table} does not exist` });
      }
  
      // Drop the table
      await sequelize.query(`DROP TABLE IF EXISTS ${table};`);
      res.status(200).json({ message: `Table ${table} deleted successfully` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: `Error deleting table ${table}: ${error.message}` });
    }
}  

const adminController = {
    sendLoginVerificationEmail,
    loginWithToken,
    listTables,
    listTablesWithCounts,
    listTableItems,
    viewTableItem,
    editTableItem,
    deleteTableItem,
    createTable,
    addTableItem,
    deleteTable
};

export default adminController;
