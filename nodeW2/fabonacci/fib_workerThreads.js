// fib_workerThreads.js

const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

// Recursive function to calculate Fibonacci number
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

if (isMainThread) {
  // Measure performance using console.time and console.timeEnd
  console.time('fibonacci_workerThreads');

  // Create new worker
  const worker = new Worker(__filename, { workerData: 40 }); // Worker data for n = 40 (or adjust as needed)

  // Listen for messages from worker
  worker.on('message', (result) => {
    console.timeEnd('fibonacci_workerThreads');
    console.log('Result:', result);
  });

} else {
  // Worker thread: perform the Fibonacci calculation
  const result = fibonacci(workerData);
  parentPort.postMessage(result);
}
