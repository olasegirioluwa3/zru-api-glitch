// import { Sequelize } from 'sequelize';
import { Sequelize } from 'sequelize';
import db from '../models/index.js';
const sequelize = db.sequelize;
// const sequelize = new Sequelize('sqlite::memory:'); // Update this line with your actual SQLite database path or connection.
// import { sequelize, DataTypes } from '../models'; // Adjust the path based on your setup

async function listTables (req, res) {
    try {
      const [results, metadata] = await sequelize.query(
        "SELECT name FROM sqlite_master WHERE type='table';"
      );
      res.status(200).json( results );
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed", message: 'Failed to list tables', error: error.message });
    }
};

async function listTablesWithCounts (req, res) {
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
  };
async function listTableItems (req, res) {
    const tableName = req.params.table;
    try {
      const [results] = await sequelize.query(`SELECT * FROM ${tableName};`);
      res.status(200).json( results );
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed", message: `Failed to list items in ${tableName}`, error: error.message });
    }
};

async function viewTableItem (req, res) {
    const tableName = req.params.table;
    const itemId = req.params.id;
    try {
      const [result] = await sequelize.query(`SELECT * FROM ${tableName} WHERE id = ? LIMIT 1;`, {
        replacements: [itemId],
        type: Sequelize.QueryTypes.SELECT,
      });
      res.status(200).json( result );
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed", message: `Failed to view item in ${tableName}`, error: error.message });
    }
};

async function editTableItem (req, res) {
  const { table, id } = req.params;
  try {
    const [updated] = await sequelize.models[table].update(req.body, {
      where: { id }
    });
    if (!updated) {
      return res.status(404).json({ error: `${table} item not found` });
    }
    const updatedItem = await sequelize.models[table].findByPk(id);
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({ error: `Error updating ${table}: ${error.message}` });
  }
};

async function deleteTableItem (req, res) {
    const tableName = req.params.table;
    const itemId = req.params.id;
    try {
        await sequelize.query(`DELETE FROM ${tableName} WHERE id = ?;`, {
            replacements: [itemId],
        });
        res.status(200).json({ status: "success", message: `Item in ${tableName} deleted successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed", message: `Failed to delete item in ${tableName}`, error: error.message });
    }
};

async function createTable (req, res) {
  const { tableName, fields } = req.body;

  if (!tableName || !fields || !Array.isArray(fields) || fields.length === 0) {
    return res.status(400).json({ error: "Invalid table name or fields" });
  }

  try {
    const modelFields = {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      }
    };

    fields.forEach(field => {
      modelFields[field.name] = {
        type: DataTypes[field.type.toUpperCase()],
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
};

// async function addTableItem(req, res) {
//     const { table } = req.params;
//     const data = req.body;
  
//     if (!sequelize.models[table]) {
//       return res.status(400).json({ error: `Table ${table} does not exist` });
//     }
  
//     try {
//       const newItem = await sequelize.models[table].create(data);
//       res.status(201).json({ message: `${table} item created successfully`, newItem });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: `Error creating item in ${table}: ${error.message}` });
//     }
// }

async function addTableItem(req, res) {
  const { table } = req.params;
  const data = req.body;

  try {
    // Check if the table exists in sequelize.models
    if (!sequelize.models[table]) {
      throw new Error(`Table ${table} does not exist`);
    }

    // Get the model dynamically
    const Model = sequelize.models[table];

    // Create a new record
    const newItem = await Model.create(data);

    res.status(201).json({ message: `${table} item created successfully`, newItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Error creating item in ${table}: ${error.message}` });
  }
}


const adminController = {
    listTables,
    listTableItems,
    viewTableItem,
    editTableItem,
    deleteTableItem,
    listTablesWithCounts,
    createTable,
    addTableItem
  };
  
  export default adminController;