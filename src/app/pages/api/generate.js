import formidable from 'formidable';
import fs from 'fs';
import FormData from 'form-data';

export const config = {
  api: {
    bodyParser: false, // required for formidable to handle multipart
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end(); // Method Not Allowed
    return;
  }

  const form = formidable({ multiples: true });

  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

  const expression = fields.expression;
  const subject = files.subject[0];
  const mask = files.mask[0];

  const proxyForm = new FormData();
  proxyForm.append('expression', expression);
  proxyForm.append('subject', fs.createReadStream(subject.filepath), {
    filename: subject.originalFilename,
    contentType: subject.mimetype,
  });
  proxyForm.append('mask', fs.createReadStream(mask.filepath), {
    filename: mask.originalFilename,
    contentType: mask.mimetype,
  });

  const externalRes = await fetch('https://nails-arizona-protection-give.trycloudflare.com/generate', {
    method: 'POST',
    body: proxyForm,
    headers: proxyForm.getHeaders(),
  });

  const resultBuffer = await externalRes.arrayBuffer();
  res.setHeader('Content-Type', 'image/png');
  res.send(Buffer.from(resultBuffer));
}
