// src/app/api/job-start/route.js

import { createJob, completeJob, failJob } from "../../lib/jobStore";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import Replicate from "replicate";
import { supabase } from '@/utils/superbase/client';
import path from 'path';
import { promises as fs } from 'fs';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});
const BucketName = process.env.STORAGE_BUCKET;
const UserFileFolder = process.env.USER_FILE_FOLDER;
const OutputFileFolder = process.env.OUTPUT_FILE_FOLDER;
const TableName = process.env.TABLE_NAME;
const model = process.env.ModelName;
const fmodel = process.env.FoodieModel;
const vastAiEndpoint = process.env.VAST_AI_Endpoint;
const apiKey = process.env.VAST_AI_API_KEY;

async function uploadImageToSupabase(buffer, filename) {
  const filePath = `${OutputFileFolder}/${filename}`;

  const { data, error } = await supabase.storage
    .from(BucketName)
    .upload(filePath, buffer, {
      contentType: "image/png", // Enforce PNG content type
    });

  if (error) {
    console.error("Supabase Storage Upload Error:", error);
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
async function insertUserData({
  username,
  gender,
  userimageurl,
  outputimageurl,
}) {
  const { error } = await supabase.from(TableName).insert([
    {
      username,
      gender,
      userimageurl,
      outputimageurl,
    },
  ]);

  if (error) {
    console.error("Database Insert Error:", error);
    return false;
  }

  return true;
}

export async function POST(request) {
  const body = await request.json();
  const { image, prompt, username, gender, base_prompt, style } = body;

  const jobId = uuidv4();
  createJob(jobId);

  // Run background task
  (async () => {
      try {

        const randomIndex = Math.floor(Math.random() * 10) + 1;
        const maskUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/assets/masks/${style}/${gender}/${randomIndex}.jpg`;
        const maskRes = await fetch(maskUrl);
        const maskBlob = await maskRes.blob();
        const formData = new FormData();
        if(style == "K-Pop"){
          formData.append('expression', "Expression Smiling");
        }else if(style == "K-Drama"){
          formData.append('expression', "Expression Smiling, Original");
        }else if(style == "K-Foodie"){
          formData.append('expression', "Expression Smiling, Original");
        }else{
          formData.append('expression', "Expression Angry");
        }
        const subjectRes = await fetch(image);
        if (!subjectRes.ok) {
          failJob(jobId, "Image Fetch failed");
        }else{
      const subjectBlob = await subjectRes.blob();
      formData.append('subject', subjectBlob, 'subject.jpg');
      formData.append('mask', maskBlob, 'mask.jpg');
      const externalRes = await fetch('https://editing-chocolate-fruit-n.trycloudflare.com/generate', {
        method: 'POST',
        body: formData,
      });
    
      if (!externalRes.ok) {
        failJob(jobId, "Image generation failed");
      }
      else{
        const resultBuffer = await externalRes.arrayBuffer();
        const buffer = Buffer.from(resultBuffer);
        const uploadFilenameg = `${username}-${Date.now()}-generated.png`;
        const outputImageUrl = await uploadImageToSupabase(
          buffer,
          uploadFilenameg
        );
        await insertUserData({
          username,
          gender,
          userimageurl: image,
          outputimageurl: outputImageUrl,
        });
        completeJob(jobId, outputImageUrl);
      }
    }
    } catch (err) {
      debugger;
      console.error("Job failed:", err);
      failJob(jobId, err.message || "Unknown error");
    }
  })();

  return new Response(JSON.stringify({ jobId }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
