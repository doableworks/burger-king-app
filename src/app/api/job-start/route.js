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
const fmodel = process.env.FoodieModel;
const vastAiEndpoint = process.env.VAST_AI_Endpoint;
const apiKey = process.env.VAST_AI_API_KEY;

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
  const { image, prompt, username, gender, base_prompt, style } = body;

  const jobId = uuidv4();
  createJob(jobId);

  // Run background task
  (async () => {
    
    
      
      
      
      const requestPayload = {
        input: {
          width: 512,
          height: 768,
          prompt: prompt,
          spatial_img: image,
          base_prompt: base_prompt,
          lora_scale: 1,
        },
      };
      
      try {
      //   // Make the POST request to VAST AI model
      //   const resData = await fetch(vastAiEndpoint, {
      //     method: 'POST',
      //     headers: {
      //       'Authorization': `Bearer ${apiKey}`,
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify(requestPayload),
      //   });
      // debugger
      //   if (!resData.ok) {
      //     throw new Error('Error calling VAST AI model');
      //   }
      
      //   const result = await resData.json(); // Parsing the JSON response from VAST AI
      
      //   // Assuming the model responds with an image URL or the image data
      //   const imageRUrl = result?.imageUrl || ''; // Adjust based on actual response structure
      //   console.log('Generated image URL:', imageRUrl);
      
      //   // Fetch the image from the VAST AI model response
      //   const response = await fetch(imageRUrl);
        
      
        


debugger
       const output = await replicate.run(
       (style == "K-Foodie") ? fmodel : model,
        {
          input: {
            width: 512,
            height: 768,
            prompt: prompt,
            spatial_img: image,
            base_prompt: base_prompt,
            lora_scale: 1
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
