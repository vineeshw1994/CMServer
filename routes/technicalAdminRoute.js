import express from "express";
import MasterConfiguration from "../models/masterModel.js";


const router = express.Router();

// router.post('/saveCategory', async (req, res) => {
//     const { category, subcategory, columns, columnValues } = req.body;
  
//     try {
//       const newMasterConfig = await MasterConfiguration.create({
//         category,
//         subCategory: subcategory || null, // Handle optional subcategory
//         columnMapping: JSON.stringify({ columns, columnValues }), // Store as JSON
//       });
  
//       res.status(201).json(newMasterConfig);
//     } catch (error) {
//       console.error('Error saving category:', error);
//       res.status(500).json({ error: 'Failed to save category' });
//     }
//   });

// server/routes/categoryRoutes.js (or your routes file)


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
  // 
  // router.post('/saveData', async (req, res) => {
  //   try {
  //     const { categoryId, data } = req.body;
  
  //     // Fetch the category by ID from the MasterConfiguration table
  //     const category = await MasterConfiguration.findOne({
  //       where: { id: categoryId },
  //     });
  
  //     if (category) {
  //       // Parse the existing columnMapping if it's a string
  //       let columnMapping = [];
  //       try {
  //         columnMapping = JSON.parse(category.columnMapping).columnMapping || [];
  //       } catch (error) {
  //         console.error('Error parsing columnMapping:', error);
  //         return res.status(400).json({ error: 'Invalid columnMapping format' });
  //       }
  
  //       // Ensure columnMapping is an array before using forEach
  //       if (!Array.isArray(columnMapping)) {
  //         return res.status(400).json({ error: 'Invalid columnMapping structure' });
  //       }
  
  //       // Map the data from the form to the respective columns
  //       Object.keys(data).forEach((key) => {
  //         columnMapping.forEach((col) => {
  //           if (col[key] !== undefined) {
  //             col[key] = data[key];  // Add form data to the column
  //           }
  //         });
  //       });
  
  //       // Update the category with the new columnMapping
  //       category.columnMapping = JSON.stringify({ columnMapping });
  
  //       // Save the updated category in the database
  //       await category.save();
  
  //       res.status(200).json({ message: 'Data saved successfully!' });
  //     } else {
  //       res.status(404).json({ error: 'Category not found' });
  //     }
  //   } catch (error) {
  //     console.error('Error saving data:', error);
  //     res.status(500).json({ error: 'Internal server error' });
  //   }
  // });
  

  router.post('/saveData', async (req, res) => {
    try {
      const { categoryId, data } = req.body;
  
      // Fetch the category by ID from the MasterConfiguration table
      const category = await MasterConfiguration.findOne({
        where: { id: categoryId },
      });
  
      if (category) {
        // Parse the existing columnMapping if it's a string
        let columnMapping = [];
        try {
          columnMapping = JSON.parse(category.columnMapping).columnMapping || [];
        } catch (error) {
          console.error('Error parsing columnMapping:', error);
          return res.status(400).json({ error: 'Invalid columnMapping format' });
        }
  
        // Ensure columnMapping is an array before using forEach
        if (!Array.isArray(columnMapping)) {
          return res.status(400).json({ error: 'Invalid columnMapping structure' });
        }
  
        // Map the data from the form to the respective columns
        Object.keys(data).forEach((key) => {
          columnMapping.forEach((col) => {
            if (col[key] !== undefined) {
              col[key] = data[key];  // Add form data to the column
            }
          });
        });
  
        // Update the category with the new columnMapping
        category.columnMapping =  columnMapping 
  
        // Save the updated category in the database
        await category.save();
  
        res.status(200).json({ message: 'Data saved successfully!' });
      } else {
        res.status(404).json({ error: 'Category not found' });
      }
    } catch (error) {
      console.error('Error saving data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Route to save data (POST request for adding data)
  // router.post('/saveData', (req, res) => {
  //   const { categoryId, data } = req.body;
  
  //   // You can save the data to a database here
  //   console.log(`Saving data for category ID ${categoryId}:`, data);
  //   res.json({ message: 'Data saved successfully!' });
  // });
  
export default router;