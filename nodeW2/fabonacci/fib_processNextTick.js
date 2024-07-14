// fib_processNextTick.js

function fibonacci(n) {
    if (n <= 1) return n;
    process.nextTick(() => {
      fibonacci(n - 1);
    });
    process.nextTick(() => {
      fibonacci(n - 2);
    });
  }
  
  // Measure performance using console.time and console.timeEnd
  console.time('fibonacci_processNextTick');
  fibonacci(40); // Calculate Fibonacci number for n = 40 (or adjust as needed)
  console.timeEnd('fibonacci_processNextTick');
  