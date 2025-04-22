// src/app/api/job-start/route.js

import { createJob, completeJob, failJob } from "../../lib/jobStore";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import Replicate from "replicate";
import { supabase } from '@/utils/superbase/client';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});
const BucketName = process.env.STORAGE_BUCKET;
const UserFileFolder = process.env.USER_FILE_FOLDER;
const OutputFileFolder = process.env.OUTPUT_FILE_FOLDER;
const TableName = process.env.TABLE_NAME;
const model = process.env.ModelName;

async function uploadImageToSupabase(buffer, filename) {
    const filePath = `${OutputFileFolder}/${filename}`;

    const { data, error } = await supabase.storage
        .from(BucketName)
        .upload(filePath, buffer, {
            contentType: 'image/png', // Enforce PNG content type
        });

    if (error) {
        console.error('Supabase Storage Upload Error:', error);
        return null;
    }

    const { data: publicData } = supabase.storage
        .from(BucketName)
        .getPublicUrl(filePath);

    return publicData?.publicUrl || null;
}
async function getImageBuffer(imageUrl) {
  const response = await fetch(imageUrl);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer;
}
async function insertUserData({ username, gender, userimageurl, outputimageurl }) {
    const { error } = await supabase.from(TableName).insert([
        {
            username,
            gender,
            userimageurl,
            outputimageurl,
        },
    ]);

    if (error) {
        console.error('Database Insert Error:', error);
        return false;
    }

    return true;
}

export async function POST(request) {
  
  const body = await request.json();
  const { image, prompt, username, gender } = body;

  const jobId = uuidv4();
  createJob(jobId);

  // Run background task
  (async () => {
    
    try {
      debugger
      // const output = await replicate.run(model, {
      //   input: {
      //     image,
      //     prompt,
      //     width: 1024,
      //     height: 1024,
      //     lora_weights: "huggingface.co/UstadPrince/manhwa_male_new",
      //     num_outputs: 1,
      //     aspect_ratio: "1:1",
      //     output_format: "webp",
      //     guidance_scale: 3.5,
      //     output_quality: 80,
      //     prompt_strength: 0.8,
      //     num_inference_steps: 28,

      //     // lora_scale: 1.2,
      //     // prompt_strength: 0.8,
      //     // scheduler: "KarrasDPM",
      //     // num_outputs: 1,
      //     // guidance_scale: 3.5,
      //     // apply_watermark: true,
      //     // negative_prompt: "worst quality, low quality",
      //     // num_inference_steps: 60
      //   },
      // });
      
      //Latest Code
      const output = await replicate.run(
        model,
        {
          input: {
            seed: 42,
            width: 768,
            height: 768,
            prompt: prompt,
            lora_scale: 2,
            spatial_img: image,
            control_type: "Manhwa"
          }
        }
      );
     
      console.log(output.url());
      const imageUrl = output.url();
      const response = await fetch(imageUrl.href);

      if (!response.ok) {
        const outputImageUrl = imageUrl.href;
        await insertUserData({ username, gender, userimageurl: image, outputimageurl: outputImageUrl });
        completeJob(jobId, outputImageUrl);
      }else{
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadFilenameg = `${username}-${Date.now()}-generated.png`;
        const outputImageUrl = await uploadImageToSupabase(buffer, uploadFilenameg);
        await insertUserData({ username, gender, userimageurl: image, outputimageurl: outputImageUrl });
        completeJob(jobId, outputImageUrl);
      }

      
    } catch (err) {
      debugger
      console.error("Job failed:", err);
      failJob(jobId, err.message || "Unknown error");
    }
  })();

  return new Response(JSON.stringify({ jobId }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
