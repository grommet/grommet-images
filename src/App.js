import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Form,
  FormField,
  Grid,
  Grommet,
  Header,
  Heading,
  Image,
  InfiniteScroll,
  Layer,
  Stack,
  TextInput,
  grommet,
} from 'grommet';
import { Add, InProgress, Search } from 'grommet-icons';

const apiUrl = 'https://us-central1-grommet-designer.cloudfunctions.net/images';
// const apiUrl = 'http://localhost:8080';

const App = () => {
  const [search, setSearch] = useState('');
  const [images, setImages] = useState();
  const [adding, setAdding] = useState();
  const filteredImages = useMemo(() => {
    const exp = new RegExp(search);
    return search ? images.filter(i => exp.test(i)) : images;
  }, [images, search]);
  const fileRef = useRef();

  useEffect(() => {
    if (!adding) {
      fetch(apiUrl)
        .then(response => response.json())
        .then(nextImages => setImages(nextImages));
    }
  }, [adding]);

  return (
    <Grommet theme={grommet} themeMode="dark" style={{ minHeight: '100vh' }}>
      {images ? (
        <Box>
          <Header pad="medium" gap="xlarge">
            <Heading margin="none">images</Heading>
            <TextInput
              icon={<Search />}
              value={search}
              onChange={event => setSearch(event.target.value)}
            />
            <Button icon={<Add />} primary onClick={() => setAdding(true)} />
          </Header>

          <Grid pad="medium" columns="small" rows="small" gap="medium">
            <InfiniteScroll items={filteredImages}>
              {image => (
                <Button
                  key={image}
                  href={`${apiUrl}/${image}`}
                  target="_blank"
                  hoverIndicator
                  plain
                >
                  {({ hover }) => (
                    <Stack fill>
                      <Box fill>
                        <Image src={`${apiUrl}/${image}`} fit="contain" />
                      </Box>
                      <Box
                        fill
                        background={
                          hover
                            ? { color: 'black', opacity: 'medium' }
                            : undefined
                        }
                      />
                    </Stack>
                  )}
                </Button>
              )}
            </InfiniteScroll>
          </Grid>

          {adding && (
            <Layer
              position="top-right"
              margin="large"
              onClickOutside={() => setAdding(false)}
              onEsc={() => setAdding(false)}
            >
              <Form
                onSubmit={event => {
                  event.preventDefault();
                  const file = fileRef.current.files[0];
                  const body = JSON.stringify({
                    filename: file.name,
                    contentType: file.type,
                  });

                  fetch(apiUrl, {
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
                    })
                    .then(() => setAdding(false));
                }}
              >
                <FormField>
                  <input ref={fileRef} name="file" type="file" />
                </FormField>
                <Box direction="row" gap="medium" align="center">
                  <Button type="submit" label="Add" primary />
                  <Button label="Cancel" onClick={() => setAdding(false)} />
                </Box>
              </Form>
            </Layer>
          )}
        </Box>
      ) : (
        <Box fill align="center" justify="center" pad="xlarge">
          <InProgress size="large" />
        </Box>
      )}
    </Grommet>
  );
};

export default App;
