import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // Import fileURLToPath from the 'url' module



export const createMetadataFile = () => {
    const metadata = [{
      name:'MasterConfiguration',
      createdAt: new Date(),
      version: '1.0',
      description: 'Metadata file for assets folder',
    }];
  
    // Get the current directory path using import.meta.url
    const __filename = fileURLToPath(import.meta.url); // Get the file URL and convert it to a file path
    const __dirname = path.dirname(__filename); // Get the directory name from the file path
  
    const assetsPath = path.join(__dirname, '..', 'assets'); // '..' moves up one directory level to the root of CMServer
    const metadataFilePath = path.join(assetsPath, 'metadata.json');
  
    // Check if the metadata.json file already exists
    if (fs.existsSync(metadataFilePath)) {
      console.log('metadata.json file already exists. Skipping creation.');
      return; // Exit the function if the file exists
    }
  
    // Check if assets folder exists, if not, create it
    if (!fs.existsSync(assetsPath)) {
      fs.mkdirSync(assetsPath, { recursive: true });
    }
  
    // Create the metadata.json file
    fs.writeFileSync(metadataFilePath, JSON.stringify(metadata, null, 2), 'utf-8');
    console.log('metadata.json file has been created in the assets folder.');
  };