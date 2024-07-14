// fib_setImmediate.js

function fibonacci(n) {
    if (n <= 1) return n;
    setImmediate(() => {
      fibonacci(n - 1);
    });
    setImmediate(() => {
      fibonacci(n - 2);
    });
  }
  
  // Measure performance using console.time and console.timeEnd
  console.time('fibonacci_setImmediate');
  fibonacci(40); // Calculate Fibonacci number for n = 40 (or adjust as needed)
  console.timeEnd('fibonacci_setImmediate');
  