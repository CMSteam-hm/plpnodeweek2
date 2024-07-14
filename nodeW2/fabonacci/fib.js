// fib.js

// Recursive function to calculate Fibonacci number
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
  
  // Measure initial performance using console.time
  console.time('fibonacci');
  const result = fibonacci(40); // Calculate Fibonacci number for n = 40 (or adjust as needed)
  console.timeEnd('fibonacci');
  
  console.log('Result:', result);
  