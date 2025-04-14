// This is just in-memory. Use Redis or DB for production.
const jobs: { [key: string]: { status: string; result?: any; error?: string } } = {};

export function createJob(jobId: string) {
  jobs[jobId] = { status: "pending" };
}

export function completeJob(jobId: string, result: any) {
   
  if (jobs[jobId]) {
    jobs[jobId] = { status: "success", result };
  }
}

export function failJob(jobId: string, error: string) {
  if (jobs[jobId]) {
    jobs[jobId] = { status: "error", error };
  }
}

export function getJob(jobId: string) {
  return jobs[jobId];
}
