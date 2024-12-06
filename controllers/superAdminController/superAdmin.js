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

