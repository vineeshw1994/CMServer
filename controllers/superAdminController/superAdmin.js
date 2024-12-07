import MasterConfiguration from "../../models/masterModel.js";

export const saveCategory = async(req,res)=>{
    try {
        const { category, subcategory,  columnMapping } = req.body;
  console.log('hiiiiffffffffffffffffffffffffffffffffffff',req.body);
  
   
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
}

export const ListMetaCard = async(req,res)=>{
  try {
    console.log('card')

    const categories = await MasterConfiguration.findAll();
console.log('cat',categories)
    // Return the categories as JSON
    res.json(categories);
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
    
  }
}

export const getCategoryColumn = async(req,res)=>{
  try {
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
    console.error('Error fetching category columns in superAdmin:', error);
    res.status(500).json({ error: 'Internal server error' });
    
  }
}



export const saveData = async(req,res)=>{
  try {
    const { categoryId, data } = req.body; // Extract categoryId and data from the request body
      console.log('Category ID:', categoryId); // Log the category ID
      console.log('Data:', data); // Log the incoming column data
  
      // Fetch the category by ID from the MasterConfiguration table
      const category = await MasterConfiguration.findOne({
        where: { id: categoryId },
      });
  
      if (!category) {
        console.log('Category not found'); // Log if category is not found
        return res.status(404).json({ error: 'Category not found' });
      }
  
      console.log('Fetched Category:', category); // Log the fetched category object
  
      // Parse the existing columnMapping if it's a string
      let columnMapping = [];
      try {
        columnMapping = JSON.parse(category.columnMapping).columnMapping || [];
        console.log('Parsed Column Mapping:', columnMapping); // Log the parsed columnMapping
      } catch (error) {
        console.error('Error parsing columnMapping:', error);
        return res.status(400).json({ error: 'Invalid columnMapping format' });
      }
  
      // Flatten the incoming data and merge it with the existing columnMapping
      let updatedColumnMapping = [];
  
      // Check if there is any nested columnMapping in the incoming data
      if (data.columnMapping && Array.isArray(data.columnMapping)) {
        // Flatten nested columnMapping
        data.columnMapping.forEach((item) => {
          Object.keys(item).forEach((key) => {
            updatedColumnMapping.push({ [key]: item[key] });
          });
        });
      } else {
        // If no nested columnMapping, process the data as usual
        Object.keys(data).forEach((columnKey) => {
          const columnData = data[columnKey];
          updatedColumnMapping.push({ [columnKey]: columnData });
        });
      }
  
      console.log('Updated Column Mapping:', updatedColumnMapping); // Log the final updated columnMapping
  
      // Replace the columnMapping with the updated mapping
      category.columnMapping =  updatedColumnMapping ;
      console.log('Updated Category Column Mapping:', category.columnMapping); // Log the updated columnMapping string
  
      // Save the updated category in the database
      await category.save();
  
      console.log('Category saved successfully'); // Log successful save
      res.status(200).json({ message: 'Data saved successfully!' });
    
  } catch (error) {
    console.error('Error saving data:', error);
      res.status(500).json({ error: 'Internal server error' });
    
  }
}



export const listColumns=async(req,res)=>{
  try {
    const attributes = MasterConfiguration.getAttributes();  // Get the model attributes
    const columns = Object.keys(attributes)
      .filter((key) => key.startsWith('column_'));  // Filter out non-column fields

    res.json({ columns });
    
  } catch (error) {
    console.error('Error fetching Columns:', error);
      res.status(500).json({ error: 'Internal server error' });
    
  }
}

export const saveColumnName =async(req,res)=>{
  try {
    console.log('req',req.body);
    const { category, subcategory, columnMapping } = req.body;

    console.log('Request Body:', req.body); // For debugging purposes

    // Step 1: Find the record in MasterConfiguration using category and subcategory
    let record = await MasterConfiguration.findOne({
      where: {
        category: category,    // Match by category
        subCategory: subcategory  // Match by subcategory
      }
    });

    // Step 2: If the record doesn't exist, create a new one
    if (!record) {
      record = await MasterConfiguration.create({
        category: category,
        subCategory: subcategory
      });
      console.log(`New record created for category: ${category}, subcategory: ${subcategory}`);
    }

    // Step 3: Loop through the columnMapping to dynamically update columns
    const updateData = {};

    // Loop through the columnMapping array
    for (const column of columnMapping) {
      // Get the column name and its value
      const columnKey = Object.keys(column)[0];  // Get the column name (e.g., 'column_2')
      const columnValue = column[columnKey];     // Get the value (e.g., 'r4')

      // Add to the updateData object
      updateData[columnKey] = columnValue;
    }

    // Step 4: Update the record with the new values
    await record.update(updateData);

    // Step 5: Send a success response with the updated record
    res.status(200).json({
      message: 'Columns updated successfully!',
      updatedRecord: record
    });
    
    
  } catch (error) {
    console.error('Error saving column name:', error);
    res.status(500).json({ error: 'Internal server error' });
    
  }
}

