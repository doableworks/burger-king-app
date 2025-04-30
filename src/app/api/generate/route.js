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
  
    const expression = fields.expression?.[0];
    const mask = fields.mask?.[0];
    const subject = files.subject?.[0];
    const proxyForm = new FormData();
    proxyForm.append('expression', expression);
    const imageBuffer = await fs.readFile(subject.filepath);
    const blob = new Blob([imageBuffer], { type: subject.mimetype });
    proxyForm.append('subject', blob, 'subject.jpg');
    const maskRes = await fetch(mask);
    const maskBlob = await maskRes.blob();
    proxyForm.append('mask', maskBlob, 'mask.jpg');
    debugger
    const externalRes = await fetch(process.env.ModelEndpoint+'/generate', {
      method: 'POST',
      body: proxyForm
    });
    console.log(externalRes);
    const json = await externalRes.json();
    console.log(json);
  debugger
    //const resultBuffer = await externalRes.arrayBuffer();
    if(externalRes.ok == true){
      return new NextResponse(JSON.stringify({
        job_id: json.job_id,
        status: json.status,
      }), {
        status: externalRes.status || 200,
        headers: { 'Content-Type': 'application/json' },
      });
  }
  else {
    const errorText = json;
    console.error('External request failed:', errorText);
  
    return new NextResponse(JSON.stringify({
      error: 'Failed to generate image',
      details: errorText,
    }), {
      status: externalRes.status || 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
