import { NextResponse } from 'next/server';
const { Blob } = require('buffer'); // Ensure it's available (Node.js 15+)
import fs from 'fs/promises';
import formidable from 'formidable';
import { Readable } from 'stream';

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
async function parseForm(req) {
  const form = formidable({ multiples: false });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export async function POST(webRequest) {

  const req = await toNodeRequest(webRequest);
  const { fields, files } = await parseForm(req);
  
    const job_id = fields.job_id?.[0];
    const externalRes = await fetch('https://obtaining-fa-views-pool.trycloudflare.com/queue/'+job_id, {
      method: 'GET'
    });
    console.log(externalRes);
    const json = await externalRes.json();
    console.log(json);
    if(externalRes.ok == true && json.status == "completed"){
      const base64Data = json.image_base64.replace(/^data:image\/\w+;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');
      return new NextResponse(imageBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Content-Length': imageBuffer.length.toString(),
        },
      });
  }
  else {
    const errorText = json; // or .json() if you expect structured error
    return new NextResponse(JSON.stringify({
      error: json.status + ' to generate image',
      details: errorText,
      status: json.status
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
