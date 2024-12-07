import MasterConfiguration from "../../models/masterModel.js";



export const getCategoryList= async (req, res) => {
    console.log('hiiii');
    
        try {
          const categories = await MasterConfiguration.findAll();
          res.status(200).json(categories); // Send the categories as JSON response
        } catch (error) {
          console.error('Error fetching categories:', error);
          res.status(500).json({ error: 'Failed to fetch categories' });
        }
      };
     
      
// Fetch columns for a specific category based on the category ID
export const categoryDetails=async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id, 10);
      console.log('Category ID received:', categoryId);
  
      if (isNaN(categoryId)) {
        console.error('Invalid category ID:', req.params.id);
        return res.status(400).json({ error: 'Invalid category ID' });
      }
  
      // Fetch category from the database
      const category = await MasterConfiguration.findOne({
        where: { id: categoryId },
      });
  
      if (!category) {
        console.error('Category not found for ID:', categoryId);
        return res.status(404).json({ error: 'Category not found' });
      }
  
      // Safely parse columnMapping from the category
      let columnMapping = {};
      try {
        // Check if the value is already an object or needs parsing
        if (typeof category.columnMapping === 'string') {
          columnMapping = JSON.parse(category.columnMapping);
        } else if (typeof category.columnMapping === 'object') {
          columnMapping = category.columnMapping;
        } else {
          throw new Error('Invalid columnMapping format');
        }
      } catch (error) {
        console.error('Error parsing columnMapping for category ID:', categoryId, error);
        return res.status(500).json({ error: 'Failed to parse columnMapping' });
      }
  
      console.log('Successfully fetched columnMapping:', columnMapping);
      return res.json({ columnMapping });
    } catch (error) {
      console.error('Error fetching category details for ID:', req.params.id, error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };



  export const savingValue = async (req, res) => {
    const { categoryId, data } = req.body;
  
    console.log('Received request:', JSON.stringify({ categoryId, data }, null, 2));
  
    if (!categoryId || !data) {
      console.error('Missing categoryId or data');
      return res.status(400).json({ message: 'Missing categoryId or data' });
    }
  
    try {
      // Find the business category by ID
      console.log('Searching for category with categoryId:', categoryId);
      let category = await MasterConfiguration.findByPk( categoryId );
  
      if (!category) {
        console.log('Category not found, creating new category');
        category = new BusinessCategory({
          categoryId,
          columnMapping: [],
        });
      } else {
        console.log('Category found:', JSON.stringify(category, null, 2));
      }
  
      // Update the columnMapping with the incoming data
      console.log('Updating category columnMapping with data:', JSON.stringify(data, null, 2));
      category.columnMapping = data;
  
      // Save the updated category to the database
      console.log('Saving updated category to database');
      await category.save();
  
      console.log('Data saved successfully');
      res.status(200).json({ message: 'Data saved successfully!' });
    } catch (error) {
      console.error('Error saving data:', error);
      res.status(500).json({ message: 'Error saving data', error: error.message });
    }
  };
  