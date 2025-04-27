import { supabase } from '@/utils/superbase/client';

// Types for clarity
export type JobStatus = 'pending' | 'success' | 'error';

export interface JobResult {
  status: JobStatus;
  result?: any;
  error?: string;
}

export async function createJob(jobId: string) {
  await supabase.from('jobs').insert([{ id: jobId, status: 'pending' }]);
}

export async function completeJob(jobId: string, result: any) {
  await supabase.from('jobs')
    .update({ status: 'success', result })
    .eq('id', jobId);
}

export async function failJob(jobId: string, error: string) {
  await supabase.from('jobs')
    .update({ status: 'error', error })
    .eq('id', jobId);
}

export async function getJob(jobId: string): Promise<JobResult | null> {
  const { data, error } = await supabase
    .from('jobs')
    .select('status, result, error')
    .eq('id', jobId)
    .single();

  if (error) {
    console.error('Supabase getJob error:', error);
    return null;
  }

  if (!data) {
    return null;
  }

  // Always return consistent object
  if (data.status === 'pending') {
    return { status: 'pending' };
  } else if (data.status === 'error') {
    return { status: 'error', error: data.error || 'Unknown error' };
  } else if (data.status === 'success') {
    return { status: 'success', result: data.result };
  }

  return null; // fallback
}
