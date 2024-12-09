import  fs from 'fs' ;
import path from "path";
import { fileURLToPath } from "url";

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



export const updateMetadata =async(req,res)=>{
  try {
    const metadataObject = req.body; // Receive metadata from frontend
console.log('req.body',req.body);
const __filename = fileURLToPath(import.meta.url); // Get the file URL and convert it to a file path
const __dirname = path.dirname(__filename); // Get the directory name from the file path

  // Define the path to metadata.json file
  const assetsPath = path.join(__dirname, '..', '..', 'assets'); 
  const metadataFilePath = path.join(assetsPath, 'metadata.json');

  // Check if the metadata.json file exists
  if (fs.existsSync(metadataFilePath)) {
    // Read the existing metadata from the file
    const existingMetadata = JSON.parse(fs.readFileSync(metadataFilePath, 'utf-8'));
console.log('existingMetadata',existingMetadata);

    // Append the new metadata to the existing metadata array
    existingMetadata.push(metadataObject);

    // Write the updated metadata back to the file
    fs.writeFileSync(metadataFilePath, JSON.stringify(existingMetadata, null, 2), 'utf-8');
    console.log('New metadata appended to metadata.json');
  } else {
    // If file doesn't exist, create a new file with the metadata
    fs.mkdirSync(assetsPath, { recursive: true }); // Create assets folder if it doesn't exist
    fs.writeFileSync(metadataFilePath, JSON.stringify([metadataObject], null, 2), 'utf-8');
    console.log('metadata.json file created and metadata saved.');
  }

  // Respond back with success message
  res.json({ message: 'Metadata saved successfully', data: metadataObject });
    
  } catch (error) {
    console.error('Error updating metadata:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


export const listMetaData =async(req,res)=>{
  try {
    const __filename = fileURLToPath(import.meta.url); // Get the file URL and convert it to a file path
    const __dirname = path.dirname(__filename); // Get the directory of this file

    // Adjust the path to metadata.json by going up two directories
    const metadataFilePath = path.join(__dirname, '..', '..', 'assets', 'metadata.json');

    // Check if metadata.json exists
    if (fs.existsSync(metadataFilePath)) {
      // Read the metadata.json file
      fs.readFile(metadataFilePath, 'utf8', (err, data) => {
        if (err) {
          return res.status(500).json({ message: 'Error reading metadata.json' });
        }
        // Send the data as JSON response
        res.json(JSON.parse(data));
      });
    } else {
      return res.status(404).json({ message: 'Metadata file not found' });
    }
    
  } catch (error) {
    console.error('Error listing metadata:', error);
    res.status(500).json({ error: 'Internal server error' });

    
  }
}

export const getCategoryData =async(req,res)=>{
  try {
    const { id } = req.params; // Get the category id from URL params
    const __filename = fileURLToPath(import.meta.url); // Get the file URL and convert it to a file path
    const __dirname = path.dirname(__filename); // Get the directory of this file
  
    // Adjust the path to metadata.json by going up two directories
    const metadataFilePath = path.join(__dirname, '..', '..', 'assets', 'metadata.json');
    
    // Read metadata.json
    fs.readFile(metadataFilePath, 'utf-8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Error reading metadata file' });
      }
      
      const metadata = JSON.parse(data);
  
      // Log the requested category id to verify it's being passed correctly
  
      // Ensure that `id` is a valid number and within bounds
      const index = parseInt(id, 10);  // Convert id to an integer
  
      if (isNaN(index) || index < 0 || index >= metadata.length) {
        return res.status(404).json({ error: 'Invalid index' });
      }
  
      // Directly access the element by index
      const categoryData = metadata[index];
  
      if (categoryData) {
        return res.json(categoryData); // Send category data to frontend
      } else {
        return res.status(404).json({ error: 'Category not found' });
      }
  });
    
    
  } catch (error) {
    console.error('Error getting metadata:', error);
    res.status(500).json({ error: 'Internal server error' });
    
  }
}


export const saveColumnName =async(req,res)=>{
  try {
  const { category, columnMapping } = req.body;

  
  const categoryIndex = parseInt(category, 10);

  const __filename = fileURLToPath(import.meta.url); // Get the file URL and convert it to a file path
  const __dirname = path.dirname(__filename); // Get the directory of this file

  // Adjust the path to metadata.json by going up two directories
  const metadataFilePath = path.join(__dirname, '..', '..', 'assets', 'metadata.json');

  fs.readFile(metadataFilePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading metadata file' });
    }

    const metadata = JSON.parse(data);

    // Ensure the category index is valid
    if (categoryIndex < 0 || categoryIndex >= metadata.length) {
      return res.status(404).json({ error: 'Category index out of bounds' });
    }

    // Update the column mapping for the found category
    metadata[categoryIndex].columnMapping = columnMapping;

    // Write the updated data back to the metadata.json file
    fs.writeFile(metadataFilePath, JSON.stringify(metadata, null, 2), 'utf-8', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error saving metadata file' });
      }
      return res.status(200).json({ message: 'Column names saved successfully' });
    });
  });
    
  } catch (error) {
    console.error('Error saving column Name:', error);
    res.status(500).json({ error: 'Internal server error' });
    
  }
}

export const saveColumnData =async(req,res)=>{
  try {
    const { categoryId,categoryData, columnData } = req.body;
    console.log('Category ID:', categoryId);
    console.log('Column Data:', columnData);

    // Loop through each row of the column data
    console.log('Category ID:', categoryId);
    console.log('Category Data:', categoryData);  // categoryData contains category and subCategory
    console.log('Column Data:', columnData);

    // Loop through each row of the column data
    for (let i = 0; i < columnData.length; i++) {
      const row = columnData[i];

      // Ensure category and subCategory are provided
      const dataToSave = {
        category: categoryData.category || 'Default Category',  // Use a default if category is missing
        subCategory: categoryData.subCategory || 'Default SubCategory',  // Default if missing
      };

      // Dynamically assign each column value from the row object
      for (let columnIndex = 1; columnIndex <= 30; columnIndex++) {
        const columnName = `column_${columnIndex}`;  // Construct column names like column_1, column_2, etc.
        if (row[columnName]) {
          dataToSave[columnName] = row[columnName];  // Assign the value to the respective column
        }
      }

      // Save the row to the database (insert one by one)
      await MasterConfiguration.create(dataToSave);
    }

    res.status(200).json({ message: 'Data saved successfully' });
    
    
  } catch (error) {
    console.error('Error saving column Data:', error);
    res.status(500).json({ error: 'Internal server error' });
    
  }
}

