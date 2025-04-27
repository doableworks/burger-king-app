// src/lib/worker.js

import { completeJob, failJob } from "../lib/jobStore";
import { supabase } from "@/utils/superbase/client";
import Replicate from "replicate";

// Config
const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

const CONFIG = {
  bucket: process.env.STORAGE_BUCKET,
  outputFolder: process.env.OUTPUT_FILE_FOLDER,
  table: process.env.TABLE_NAME,
  model: process.env.ModelName,
};

// Job Queue
const jobQueue = [];
let isProcessing = false;

// Utility Functions
async function uploadImageToSupabase(buffer, filename) {
  const filePath = `${CONFIG.outputFolder}/${filename}`;
  const { data, error } = await supabase.storage
    .from(CONFIG.bucket)
    .upload(filePath, buffer, { contentType: 'image/png' });

  if (error) {
    console.error('❌ Supabase Storage Upload Error:', error);
    return null;
  }

  const { data: publicData } = supabase.storage
    .from(CONFIG.bucket)
    .getPublicUrl(filePath);

  return publicData?.publicUrl || null;
}

async function insertUserData({ username, gender, userimageurl, outputimageurl }) {
  const { error } = await supabase.from(CONFIG.table).insert([
    { username, gender, userimageurl, outputimageurl },
  ]);

  if (error) {
    console.error('❌ Database Insert Error:', error);
    return false;
  }
  return true;
}

// Worker Logic
async function processNextJob() {
  if (isProcessing || jobQueue.length === 0) return;

  isProcessing = true;
  const job = jobQueue.shift(); // get first job

  const { jobId, image, prompt, username, gender, base_prompt, retries = 0 } = job;

  try {
    console.log(`🚀 [Worker] Starting job ${jobId}`);

    const output = await replicate.run(CONFIG.model, {
      input: {
        seed: 20,
        width: 512,
        height: 768,
        prompt,
        spatial_img: image,
        lora_scale: 1,
        base_prompt,
        control_type: "Manhwa",
      },
    });

    const imageUrl = output.url();
    const response = await fetch(imageUrl.href);

    let finalOutputUrl = '';

    if (!response.ok) {
      console.warn(`⚠️ Replicate image not downloadable for job ${jobId}, using direct URL.`);
      finalOutputUrl = imageUrl.href;
    } else {
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadFilename = `${username}-${Date.now()}-generated.png`;
      finalOutputUrl = await uploadImageToSupabase(buffer, uploadFilename);

      if (!finalOutputUrl) {
        throw new Error("Failed to upload image to Supabase.");
      }
    }

    await insertUserData({ username, gender, userimageurl: image, outputimageurl: finalOutputUrl });
    await completeJob(jobId, finalOutputUrl);

    console.log(`✅ [Worker] Job ${jobId} completed.`);

  } catch (err) {
    console.error(`❌ [Worker] Job ${jobId} failed:`, err);

    if (retries < 2) {
      console.log(`🔁 Retrying job ${jobId} (Attempt ${retries + 1})`);
      jobQueue.push({ ...job, retries: retries + 1 });
    } else {
      console.error(`🛑 [Worker] Job ${jobId} failed after retries.`);
      await failJob(jobId, err.message || "Unknown error");
    }
  }

  isProcessing = false;
}

// Push Job
export function addJobToQueue(jobData) {
  jobQueue.push(jobData);
  processNextJob();
}
