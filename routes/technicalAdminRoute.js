import express from "express";
import MasterConfiguration from "../models/masterModel.js";


const router = express.Router();

router.post('/saveCategory', async (req, res) => {
    const { category, subcategory, columns, columnValues } = req.body;
  
    try {
      const newMasterConfig = await MasterConfiguration.create({
        category,
        subCategory: subcategory || null, // Handle optional subcategory
        columnMapping: JSON.stringify({ columns, columnValues }), // Store as JSON
      });
  
      res.status(201).json(newMasterConfig);
    } catch (error) {
      console.error('Error saving category:', error);
      res.status(500).json({ error: 'Failed to save category' });
    }
  });

  router.get('/getCategories', async (req, res) => {
console.log('hiiii');

    try {
      const categories = await MasterConfiguration.findAll();
      res.status(200).json(categories); // Send the categories as JSON response
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  });
  
export default router;