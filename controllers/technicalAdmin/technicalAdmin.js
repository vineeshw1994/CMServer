import MasterConfiguration from "../../models/masterModel.js";

export const columnList=async(req,res)=>{
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