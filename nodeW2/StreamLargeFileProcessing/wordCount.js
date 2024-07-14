const fs = require('fs');
const readline = require('readline');

// Function to count occurrences of a word in a line
function countOccurrences(line, targetWord) {
  const regex = new RegExp('\\b' + targetWord + '\\b', 'gi');
  return (line.match(regex) || []).length;
}

// Main function to process the file
function processFile(filePath, targetWord) {
  // Create a readable stream to read the file
  const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });
  
  // Interface to read the stream line by line
  const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity // to handle both \r\n and \n line endings
  });

  let totalCount = 0;

  // Event listener for each line read
  rl.on('line', (line) => {
    // Count occurrences of the target word in the line
    const occurrences = countOccurrences(line, targetWord);
    totalCount += occurrences;
  });

  // Event listener for end of file
  rl.on('close', () => {
    console.log(`Total occurrences of '${targetWord}' in the file:`, totalCount);
  });

  // Event listener for error handling
  rl.on('error', (err) => {
    console.error('Error reading file:', err);
  });
}

// Usage example: Replace 'your_large_text_file.txt' with your file path and 'specificWord' with your target word
const filePath = 'your_large_text_file.txt';
const targetWord = 'specificWord';

processFile(filePath, targetWord);
