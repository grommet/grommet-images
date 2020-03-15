export const apiUrl =
  'https://us-central1-grommet-designer.cloudfunctions.net/images';
// export const apiUrl = 'http://localhost:8080';
// const mockImages = [
//   'eric-soderberg-hpe-com/headshot.jpeg',
//   'eric-soderberg-hpe-com/GOPR0032-2.jpg',
//   'lozzi-hpe-com/IMG_0072.JPG',
// ];

export const slugify = str =>
  str
    .toLocaleLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '-');

export const loadImages = () => fetch(apiUrl).then(response => response.json());

export const filterMine = images => {
  const stored = localStorage.getItem('identity');
  if (stored && images) {
    const { email } = JSON.parse(stored);
    const emailSlug = slugify(email);
    return images.filter(i => i.startsWith(emailSlug));
  }
  return undefined;
};

export const uploadImages = (files, email, pin) => {
  localStorage.setItem('identity', JSON.stringify({ email, pin }));
  const promises = files.map(file => {
    const body = JSON.stringify({
      emailSlug: slugify(email),
      pin,
      filename: file.name,
      contentType: file.type,
    });

    return fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Content-Length': body.length,
      },
      body,
    })
      .then(res => res.text())
      .then(uploadUrl => {
        return fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        });
      });
  });
  return Promise.all(promises);
};

export const deleteImage = image => {
  const stored = localStorage.getItem('identity');
  if (stored) {
    const { email, pin } = JSON.parse(stored);
    const body = JSON.stringify({
      emailSlug: slugify(email),
      pin,
    });
    return fetch(`${apiUrl}/${image}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Content-Length': body.length,
      },
      body,
    });
  }
};
