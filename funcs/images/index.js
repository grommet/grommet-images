const { Storage } = require('@google-cloud/storage');

const storage = new Storage();
const bucket = storage.bucket('grommet-images');
const metaFilename = `_meta.json`;

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.images = (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }
  if (req.method === 'GET') {
    const filename = decodeURIComponent(req.url.slice(1));
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
        // remove _meta files
        return metadatas
          .map(d => d[0].name)
          .filter(n => !n.endsWith(metaFilename));
      })
      .then(names =>
        res
          .status(200)
          .type('json')
          .send(JSON.stringify(names)),
      );
  }
  if (req.method === 'POST') {
    const { emailSlug, pin, filename, contentType } = req.body;
    if (!emailSlug || !pin || !filename || !contentType) {
      res.status(400).send();
      return;
    }
    // check ownership
    const file = bucket.file(`${emailSlug}/${metaFilename}`);
    return file
      .download()
      .then(data => {
        const meta = JSON.parse(data[0]);
        if (pin !== meta.pin) {
          res.status(403).send('Unauthorized');
          return false;
        }
        return true; // pin matches
      })
      .catch(() => {
        // doesn't exist yet, add it
        const meta = { pin };
        return file
          .save(JSON.stringify(meta), { resumable: false })
          .then(() => true);
      })
      .then(ok => {
        if (ok) {
          const file = bucket.file(`${emailSlug}/${filename}`);
          const expires = Date.now() + 300000; // Link expires in 5 minutes
          const config = { action: 'write', expires, contentType };

          return file
            .getSignedUrl(config)
            .then(data => res.type('text').send(data[0]));
        }
      });
  }
  if (req.method === 'DELETE') {
    const filename = decodeURIComponent(req.url.slice(1));
    const { emailSlug, pin } = req.body;
    if (!emailSlug || !pin || !filename) {
      res.status(400).send();
      return;
    }
    // check ownership
    const file = bucket.file(`${emailSlug}/${metaFilename}`);
    return file.download().then(data => {
      const meta = JSON.parse(data[0]);
      if (pin !== meta.pin) {
        res.status(403).send('Unauthorized');
        return;
      }
      const file = bucket.file(filename);
      return file
        .delete()
        .then(data => res.status(200).send())
        .catch(e => res.status(400).send(e.message));
    });
  }
  res.status(405).send();
};
