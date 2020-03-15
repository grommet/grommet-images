import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import styled from 'styled-components';
import {
  Box,
  Button,
  Form,
  FormField,
  Header,
  Heading,
  MaskedInput,
  Stack,
  Text,
  TextInput,
} from 'grommet';
import { Close } from 'grommet-icons';
import { uploadImages } from './images';

const FileInput = styled.input`
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const Add = ({ onDone }) => {
  const [files, setFiles] = useState();
  const [identity, setIdentity] = useState();
  const [uploading, setUploading] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    const stored = localStorage.getItem('identity');
    if (stored) setIdentity(JSON.parse(stored));
  }, []);

  return (
    <Box>
      <Header pad="medium" gap="xlarge">
        <Heading margin="none">add</Heading>
        <Button icon={<Close />} onClick={onDone} />
      </Header>
      <Form
        value={identity}
        onSubmit={event => {
          const {
            value: { email, pin },
          } = event;
          event.preventDefault();
          setUploading(true);
          uploadImages(files, email, pin)
            .then(() => {
              ReactGA.event({
                category: 'manage',
                action: 'add image',
              });
            })
            .then(() => setUploading(false))
            .then(onDone)
            .catch(error => {
              setError(error);
              setUploading(false);
            });
        }}
      >
        <Box pad="medium" gap="large">
          {uploading ? (
            <Box pad="large" border={{ color: 'focus' }} align="start">
              <Box animation="pulse">
                <Text size="large">uploading ...</Text>
              </Box>
            </Box>
          ) : (
            <Box gap="large">
              <Box direction="row" align="start" gap="large">
                <FormField
                  name="email"
                  required
                  validate={{ regexp: /\w+@\w+\.\w+/ }}
                >
                  <TextInput name="email" placeholder="your email" />
                </FormField>
                <FormField name="pin" required>
                  <MaskedInput
                    name="pin"
                    placeholder="select pin"
                    type="password"
                    mask={[
                      {
                        length: 3,
                        regexp: /^\d{1,3}$/,
                        placeholder: '###',
                      },
                    ]}
                  />
                </FormField>
              </Box>
              <FormField>
                <Stack guidingChild="last" interactiveChild="first">
                  <FileInput
                    name="file"
                    type="file"
                    onChange={event => {
                      const eventFiles = event.target.files;
                      const nextFiles = [];
                      for (let i = 0; i < eventFiles.length; i += 1)
                        nextFiles.push(eventFiles[i]);
                      setFiles(nextFiles);
                      setError(undefined);
                    }}
                  />
                  <Box
                    background="background"
                    border={{ color: 'focus' }}
                    pad="large"
                    gap="medium"
                  >
                    {files ? (
                      files.map(file => (
                        <Text key={file.name} size="large">
                          {file.name}
                        </Text>
                      ))
                    ) : (
                      <Text size="large">Drop a file here</Text>
                    )}
                  </Box>
                </Stack>
              </FormField>
              {files && (
                <Box direction="row" gap="medium" align="center">
                  <Button type="submit" label="upload" primary size="large" />
                  {error && <Text>{`${error}`}</Text>}
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Form>
    </Box>
  );
};

export default Add;
