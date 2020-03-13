const { Storage } = require('@google-cloud/storage');

const storage = new Storage();
const bucket = storage.bucket('grommet-images');

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.images = (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }
  if (req.method === 'GET') {
    const filename = decodeURIComponent(req.url.split('/')[1]);
    if (filename) {
      const file = bucket.file(filename);
      const type = filename.split('.')[1];
      return file
        .download()
        .then(data =>
          res
            .status(200)
            .set('Content-Type', `image/${type}`)
            .send(data[0]),
        )
        .catch(e => res.status(400).send(e.message));
    }
    // list files
    return bucket
      .getFiles()
      .then(data => {
        const files = data[0];
        return Promise.all(files.map(file => file.getMetadata()));
      })
      .then(metadatas => {
        return metadatas.map(d => d[0].name);
      })
      .then(names =>
        res
          .status(200)
          .type('json')
          .send(JSON.stringify(names)),
      );
  }
  if (req.method === 'POST') {
    const { filename, contentType } = req.body;
    // TODO: check that the user is authorized to upload

    const file = bucket.file(filename);
    const expires = Date.now() + 300000; // Link expires in 5 minutes
    const config = { action: 'write', expires, contentType };

    return file
      .getSignedUrl(config)
      .then(data => res.type('text').send(data[0]));
  }
  res.status(405).send();
};
