/* eslint-disable camelcase */

/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const cryptojs = require('crypto');
const mime_types = require('mime-types');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
const port = process.env.PORT || 3001;

// Define routes and middleware here
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: 'https://imagehippo.blem.dev', // Replace with your client's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies and authentication headers
  }),
);

app.use(express.static('../../client/dist/'));

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${port}`);
});

app.post('/upload', multer().single('file'), async (request: any, response: any) => {
  const file = await request.file;
  const file_buffer = await file.buffer;
  const file_hash = cryptojs.createHash('sha224').update(file_buffer).digest('hex');
  const file_extname = path.extname(file.originalname);
  const file_new_name = file_hash.concat(file_extname);

  const old_metadata = await sharp(file_buffer).metadata();

  // convert image data into JPEG format
  const converted_buffer = await sharp(file_buffer).jpeg({ mozjpeg: true }).toBuffer();

  const new_metadata = await sharp(converted_buffer).metadata();

  fs.writeFileSync(path.join(process.cwd(), `./temp/${file_new_name}`), file_buffer);
  return response.status(200).send({
    filename: file_new_name,
    old_metadata,
    new_metadata,
  });
});

app.get('/i/*', (request: any, response: any) => {
  const { url } = request;
  const file_name = url.replace('/i/', '');
  const file_path = path.join(process.cwd(), `./temp/${file_name}`);
  if (fs.existsSync(file_path) === true) {
    // 200
    const file_buffer = fs.readFileSync(file_path);
    const content_type = mime_types.contentType(file_name);
    if (typeof content_type === 'string') {
      return response.status(200).header('Content-Type', content_type).send(file_buffer);
    }
    return response.status(500).send();
  }
  // 404
  return response.status(404).send();
});
