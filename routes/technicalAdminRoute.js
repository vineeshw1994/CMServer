import express from "express";
import MasterConfiguration from "../models/masterModel.js";
import { columnList } from "../controllers/technicalAdmin/technicalAdmin.js";


const router = express.Router();



// Fetch columns for a specific category based on the category ID
router.get('/getCategoryColumns/:id', async (req, res) => {
  try {
    // Log the category ID for debugging purposes
    console.log('Category ID:', req.params.id);

    // Parse the category ID from the request parameters
    const categoryId = parseInt(req.params.id, 10);

    // Fetch the category from the MasterConfiguration table
    const category = await MasterConfiguration.findOne({
      where: { id: categoryId },
    });
console.log('category',category);

    // If the category exists, send back the columnMapping
    if (category) {
      // Parse the columnMapping from the stored JSON string
      const columnMapping = JSON.parse(category.columnMapping);
console.log('columnMapping',columnMapping);

      // Send the columnMapping as a response
      res.json({ columnMapping });
    } else {
      // If the category is not found, return a 404 error
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    // Catch any errors and log them for debugging
    console.error('Error fetching category columns:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.post('/saveCategory', async (req, res) => {
  const { category, subcategory,  columnMapping } = req.body;
console.log('hiiiiffffffffffffffffffffffffffffffffffff',req.body);

  try {
    const newMasterConfig = await MasterConfiguration.create({
      category,
      subCategory: subcategory || null, // Handle optional subcategory
      columnMapping: JSON.stringify({  columnMapping }), // Store as JSON
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
 
  // router.post('/saveData', async (req, res) => {
  //   console.log('Request Body:', req.body); // Log the incoming request body
  
  //   try {
  //     const { categoryId, data } = req.body; // Extract categoryId and data from the request body
  //     console.log('Category ID:', categoryId); // Log the category ID
  //     console.log('Data:', data); // Log the incoming column data
  
  //     // Fetch the category by ID from the MasterConfiguration table
  //     const category = await MasterConfiguration.findOne({
  //       where: { id: categoryId },
  //     });
  
  //     if (!category) {
  //       console.log('Category not found'); // Log if category is not found
  //       return res.status(404).json({ error: 'Category not found' });
  //     }
  
  //     console.log('Fetched Category:', category); // Log the fetched category object
  
  //     // Parse the existing columnMapping if it's a string
  //     let columnMapping = [];
  //     try {
  //       columnMapping = JSON.parse(category.columnMapping).columnMapping || [];
  //       console.log('Parsed Column Mapping:', columnMapping); // Log the parsed columnMapping
  //     } catch (error) {
  //       console.error('Error parsing columnMapping:', error);
  //       return res.status(400).json({ error: 'Invalid columnMapping format' });
  //     }
  
  //     // Flatten the incoming data and merge it with the existing columnMapping
  //     let updatedColumnMapping = [];
  
  //     // Check if there is any nested columnMapping in the incoming data
  //     if (data.columnMapping && Array.isArray(data.columnMapping)) {
  //       // Flatten nested columnMapping
  //       data.columnMapping.forEach((item) => {
  //         Object.keys(item).forEach((key) => {
  //           updatedColumnMapping.push({ [key]: item[key] });
  //         });
  //       });
  //     } else {
  //       // If no nested columnMapping, process the data as usual
  //       Object.keys(data).forEach((columnKey) => {
  //         const columnData = data[columnKey];
  //         updatedColumnMapping.push({ [columnKey]: columnData });
  //       });
  //     }
  
  //     console.log('Updated Column Mapping:', updatedColumnMapping); // Log the final updated columnMapping
  
  //     // Replace the columnMapping with the updated mapping
  //     category.columnMapping =  updatedColumnMapping ;
  //     console.log('Updated Category Column Mapping:', category.columnMapping); // Log the updated columnMapping string
  
  //     // Save the updated category in the database
  //     await category.save();
  
  //     console.log('Category saved successfully'); // Log successful save
  //     res.status(200).json({ message: 'Data saved successfully!' });
  //   } catch (error) {
  //     console.error('Error saving data:', error);
  //     res.status(500).json({ error: 'Internal server error' });
  //   }
  // });
  
  router.post('/saveData', async (req, res) => {
    console.log('Request Body:', JSON.stringify(req.body, null, 2)); // Log the incoming request body
    
    try {
      const { categoryId, data } = req.body; // Extract categoryId and data from the request body
      console.log('Category ID:', categoryId); // Log the category ID
      console.log('Data:', JSON.stringify(data, null, 2)); // Log the data in a more readable format
  
      // Fetch the category by ID from the MasterConfiguration table
      const category = await MasterConfiguration.findOne({
        where: { id: categoryId },
      });
  
      if (!category) {
        console.log('Category not found'); // Log if category is not found
        return res.status(404).json({ error: 'Category not found' });
      }
  
      console.log('Fetched Category:', JSON.stringify(category, null, 2)); // Log the entire category data
  
      // Parse the existing columnMapping if it's a string
      let columnMapping = [];
      try {
        columnMapping = JSON.parse(category.columnMapping).columnMapping || [];
        console.log('Parsed Column Mapping:', JSON.stringify(columnMapping, null, 2)); // Log parsed columnMapping
      } catch (error) {
        console.error('Error parsing columnMapping:', error);
        return res.status(400).json({ error: 'Invalid columnMapping format' });
      }
  
      // Flatten the incoming data but preserve the nested structure
      let updatedColumnMapping = [];
  
      if (data.columnMapping && Array.isArray(data.columnMapping)) {
        // Preserve the nested structure
        data.columnMapping.forEach((item) => {
          Object.keys(item).forEach((key) => {
            // Ensure we are preserving the key-value pair (nested object)
            updatedColumnMapping.push({ [key]: item[key] }); // Do not flatten the object, preserve it
          });
        });
      } else {
        // If no nested columnMapping, process the data as usual
        Object.keys(data).forEach((columnKey) => {
          const columnData = data[columnKey];
          updatedColumnMapping.push({ [columnKey]: columnData });
        });
      }
  
      console.log('Updated Column Mapping:', JSON.stringify(updatedColumnMapping, null, 2)); // Log the final updated column mapping
  
      // Replace the columnMapping with the updated mapping (preserving the structure)
      category.columnMapping =  updatedColumnMapping 
      console.log('Updated Category Column Mapping:', JSON.stringify(category.columnMapping, null, 2)); // Log the updated columnMapping string
  
      // Save the updated category in the database
      await category.save();
  
      console.log('Category saved successfully'); // Log successful save
      res.status(200).json({ message: 'Data saved successfully!' });
    } catch (error) {
      console.error('Error saving data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
router.get('/columnList',columnList)

export default router;