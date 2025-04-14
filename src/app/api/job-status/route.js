import { getJob } from "../../lib/jobStore";

export async function GET(request) {
    
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");

  if (!jobId || typeof jobId !== "string") {
    return new Response(JSON.stringify({ error: "Invalid jobId" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const job = getJob(jobId);

  if (!job) {
    return new Response(JSON.stringify({ error: "Job not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(job), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
