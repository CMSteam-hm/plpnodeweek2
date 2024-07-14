const fs = require('fs');
const util = require('util');
const mysql = require('mysql');
const axios = require('axios');

// Promisify fs.readFile for async/await usage
const readFile = util.promisify(fs.readFile);

// Function to read JSON configuration file
async function readConfigFile() {
  try {
    const data = await readFile('config.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    throw new Error(`Error reading or parsing config file: ${err.message}`);
  }
}

// Function to connect to MySQL database
function connectToDatabase(config) {
  const connection = mysql.createConnection({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database
  });

  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        reject(`Error connecting to database: ${err.message}`);
      } else {
        resolve(connection);
      }
    });
  });
}

// Function to fetch data from an API
async function fetchDataFromAPI(apiUrl) {
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (err) {
    throw new Error(`Error fetching data from API: ${err.message}`);
  }
}

// Main function to orchestrate the operations
async function main() {
  try {
    // Read configuration file
    const config = await readConfigFile();

    // Connect to database
    const dbConnection = await connectToDatabase(config);

    console.log('Connected to database.');

    // Fetch data from API
    const apiData = await fetchDataFromAPI(config.api.url);

    console.log('Fetched data from API:', apiData);

    // Close database connection
    dbConnection.end();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error:', err.message);
    // Perform cleanup or additional error handling if needed
    process.exit(1); // Exit the process with failure status
  }
}

// Execute main function
main();
