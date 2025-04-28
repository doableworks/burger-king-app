import { OpenAI } from 'openai';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import formidable from 'formidable';
import { Readable } from 'stream';
import { supabase } from '@/utils/superbase/client';
import axios from 'axios';
import fs from 'fs/promises';
import sharp from 'sharp'; // Import the sharp library for image processing
import Replicate from "replicate";
import promptData from "./prompts.json"
import { GoogleGenAI, createUserContent, createPartFromUri } from "@google/genai";
import fetch from "node-fetch";


const ai = new GoogleGenAI({ apiKey: process.env.GEMINIAPIKEY });

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});
let ErrorMsg = "";

function getFullPrompt(style, gender) {
    const styleData = promptData.styles.find(s => s[style]);
  
    if (styleData && styleData[style]) {
      const styleSpecificData = styleData[style];
      const prompt = styleSpecificData[gender.toLowerCase()];
      //const background = styleSpecificData.backgrounds;
  
    //   if (prompt && background) {
        if(prompt){

            const randomPrompt = prompt[Math.floor(Math.random() * prompt.length)];
            // const randomBackground = background[Math.floor(Math.random() * background.length)];
            //return `${randomPrompt} Background: ${randomBackground}`;
            return `${randomPrompt}`;
        } 
        else {
            return "Make a Manhwa style.";
        }
    } else {
        return "Make a Manhwa style.";
    }
  }

const BucketName = process.env.STORAGE_BUCKET;
const UserFileFolder = process.env.USER_FILE_FOLDER;
const OutputFileFolder = process.env.OUTPUT_FILE_FOLDER;
const TableName = process.env.TABLE_NAME;
const model = process.env.ModelName;

export const config = {
    api: {
        bodyParser: false,
    },
};

async function generateImageBasedOnExisting(inputImagePath, userPrompt) {
    try{
        if (!process.env.REPLICATE_API_TOKEN) {
            throw new Error("REPLICATE_API_TOKEN is not defined. Check Vercel environment variables.");
          }
          
        const output = await replicate.run(
            model,
            {
              input: {
                  image: inputImagePath,
                  width: 1024,
                  height: 1024,
                  prompt: userPrompt,
                  scheduler: "KarrasDPM",
                  num_outputs: 1,
                  guidance_scale: 7.5,
                  apply_watermark: true,
                  negative_prompt: "worst quality, low quality",
                  prompt_strength: 0.8,
                  num_inference_steps: 60
                }
              }
            );
            console.log(output);
    if (!output || !output[0]) {
        throw new Error("Replicate returned no output.");
    }
    const imageUrls = [];
    const imageUrl = output[0]; // adjust if structure is different
  
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data);
    
    console.log('Buffer:', imageBuffer);

            return imageBuffer;
    }
    catch(error)
    {
        ErrorMsg = error;
        return null;
    }
    
}

// Utility function for error responses
const createErrorResponse = (message, status = 500) => {
    console.error(`API Error: ${message}`);
    return NextResponse.json({ error: message }, { status });
};

// Convert Web Request to Node-style IncomingMessage
async function toNodeRequest(request) {
    const bodyArrayBuffer = await request.arrayBuffer();
    const bodyBuffer = Buffer.from(bodyArrayBuffer);
    const stream = Readable.from([bodyBuffer]);

    const req = Object.assign(stream, {
        headers: Object.fromEntries(request.headers),
        method: request.method,
        url: request.url,
    });

    return req;
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

async function uploadImageToSupabase(buffer, filename) {
    const filePath = `${UserFileFolder}/${filename}`;

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

async function uploadImageBufferToSupabase(buffer, filename) {
    const filePath = `${OutputFileFolder}/${filename}`;

    const { data, error } = await supabase.storage
        .from(BucketName)
        .upload(filePath, buffer, {
            contentType: 'image/png',
        });

    if (error) {
        console.error('Supabase Storage Buffer Upload Error:', error);
        return null;
    }

    const { data: publicData } = supabase.storage
        .from(BucketName)
        .getPublicUrl(filePath);

    return publicData?.publicUrl || null;
}

async function promptGenerate(processedImagePath, mimeType, userprompt) {
    // const url = "https://vzgwpzccjffstvxfjqvq.supabase.co/storage/v1/object/public/burger-king/user-uploads/Harsh-1745316025451-user.png";
  
    const image = await ai.files.upload({
      file: processedImagePath,
      config: { mimeType :  mimeType }
    });
  
    // const myfile = await ai.files.upload({
    //   file: path.join(media, url),
    //   config: { mimeType: "image/png" },
    // });
    // console.log("Uploaded file:", myfile);
  
    const response = await ai.models.generateContent({
      model: process.env.GEMINIModel,
      contents: [
        createUserContent([
          process.env.systemPrompt,
          createPartFromUri(image.uri, image.mimeType),
        ]),
      ],
    });
    console.log(response.text);
    // const updatedPrompt = userprompt.replace("[Insert facial identity description here]", response.text);
    // return updatedPrompt;
    return response.text;
  }


export async function POST(webRequest) {
    
    const req = await toNodeRequest(webRequest);
    const form = formidable({ multiples: false });

    return new Promise((resolve, reject) => {
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Form Parsing Error:', err);
                return resolve(createErrorResponse('Failed to parse form data.'));
            }

            const username = fields.username?.[0];
            const gender = fields.gender?.[0];
            const imageFile = files.image?.[0];
            const style = fields.style?.[0];
            
            try {

                if(fields.action?.[0] == "uploadimage"){
                    let userImageUrl = null;
                    let processedImagePath = imageFile.filepath;
                    
                    const imageBufferForUpload = await require('fs').promises.readFile(processedImagePath);
                    const uploadFilename = `${username}-${Date.now()}-user.png`;
                    userImageUrl = await uploadImageToSupabase(imageBufferForUpload, uploadFilename);
                    if (!userImageUrl) {
                        return resolve(createErrorResponse('Failed to store user image in file server.'));
                    }
                    var userprompt = getFullPrompt(style,gender) || "Regenerate this image in Manhwa Style";
                    var customGeminiDes = "Describe the person in the attached image, one thing is be detailed of its face and age features as its the very important part. Blend the description prompt with the sample prompt below, the prompt below will give you parts of what to put where and what all we need, ";
                    const latestPrompt = customGeminiDes + userprompt;
                    const GeminiPrompt = await promptGenerate(processedImagePath,imageFile.mimetype,latestPrompt);
                    resolve(NextResponse.json({ status:'Success', url: userImageUrl, base_prompt: GeminiPrompt, name:username, gender:gender  }));
    
                }else if(fields.action?.[0]=="generateimage"){
                    const userimageurl = fields.userimageurl?.[0] || "";
                    const userprompt = getFullPrompt(style,gender) || "Regenerate this image in Manhwa Style";
                    const outputpathurl = await generateImageBasedOnExisting(userimageurl,userprompt);
                    if(outputpathurl == null){
                        return resolve(createErrorResponse('Failed to Generate image.'+ErrorMsg));
                    }
                    const uploadFilenameg = `${username}-${Date.now()}-generated.png`;
                    const outputImageUrl = await uploadImageBufferToSupabase(outputpathurl, uploadFilenameg);
                    resolve(NextResponse.json({ status:'Success', url: outputImageUrl }));
    
                }else if(fields.action?.[0]=="save"){
                    const userimageurl = fields.userimageurl?.[0] || "";
                    const generatedimageurl = fields.generatedimageurl?.[0] || "";
                    await insertUserData({ username, gender, userimageurl: userimageurl, outputimageurl: generatedimageurl });
                    resolve(NextResponse.json({ status: 'Success', message: 'Data Saved Successfully!.' }));
    
                }else{
                    resolve(NextResponse.json({ status: 'Invalid Action' }));
                }
                
            } catch (e) {
                debugger
                resolve(createErrorResponse(`Image processing failed: ${e.message || 'Unknown error'}`));
            } 
            // finally {
            //     if (imageFile?.filepath) {
            //         try {
            //             await unlink(imageFile.filepath);
            //         } catch (unlinkErr) {
            //             console.error('Error deleting original temporary file:', unlinkErr);
            //         }
            //     }
            //     if (processedImagePath !== imageFile?.filepath && processedImagePath) {
            //         try {
            //             await unlink(processedImagePath);
            //         } catch (unlinkErr) {
            //             console.error('Error deleting converted temporary file:', unlinkErr);
            //         }
            //     }
            // }
        });
    });
}