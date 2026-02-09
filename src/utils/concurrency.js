/**
 * Like Promise.all, but limits the number of concurrent promises.
 *
 * @param {Array<() => Promise>} tasks - Array of functions that return promises
 * @param {number} [limit=20] - Maximum number of concurrent promises
 * @returns {Promise<Array>} Results in the same order as the input tasks
 */
export async function promiseAllLimit(tasks, limit = 20) {
  const results = new Array(tasks.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < tasks.length) {
      const i = nextIndex++;
      results[i] = await tasks[i]();
    }
  }

  const workers = Array.from(
    { length: Math.min(limit, tasks.length) },
    () => worker()
  );
  await Promise.all(workers);
  return results;
}

/**
 * Like Promise.allSettled, but limits the number of concurrent promises.
 *
 * @param {Array<() => Promise>} tasks - Array of functions that return promises
 * @param {number} [limit=20] - Maximum number of concurrent promises
 * @returns {Promise<Array<{status: string, value?: any, reason?: any}>>} Settlement results in input order
 */
export async function promiseAllSettledLimit(tasks, limit = 20) {
  const results = new Array(tasks.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < tasks.length) {
      const i = nextIndex++;
      try {
        results[i] = { status: 'fulfilled', value: await tasks[i]() };
      } catch (reason) {
        results[i] = { status: 'rejected', reason };
      }
    }
  }

  const workers = Array.from(
    { length: Math.min(limit, tasks.length) },
    () => worker()
  );
  await Promise.all(workers);
  return results;
}
