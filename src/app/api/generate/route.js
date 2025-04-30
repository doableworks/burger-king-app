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
    const externalRes = await fetch('https://nails-arizona-protection-give.trycloudflare.com/generate', {
      method: 'POST',
      body: proxyForm
    });
    console.log(externalRes);
    const json = await externalRes.json();
    console.log(json);
  debugger
    //const resultBuffer = await externalRes.arrayBuffer();
    if(externalRes.ok == true){
      //return NextResponse.json({ src: json.image_base64 });
      const base64Data = json.image_base64.replace(/^data:image\/\w+;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');

      return new NextResponse(imageBuffer, {
          headers: {
    'Content-Type': 'image/png',
    'Content-Length': imageBuffer.length.toString(),
  }
    });
  }
}
