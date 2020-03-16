import React, { useState } from 'react';
import ReactGA from 'react-ga';
import {
  Box,
  Button,
  Header,
  Heading,
  Image,
  InfiniteScroll,
  Text,
} from 'grommet';
import { Close, Trash } from 'grommet-icons';
import { apiUrl, deleteImage } from './images';

const Manage = ({ images, onDone }) => {
  const [deleting, setDeleting] = useState();
  return (
    <Box>
      <Header pad="medium" gap="xlarge">
        <Heading margin="none">manage</Heading>
        <Button icon={<Close />} onClick={onDone} />
      </Header>
      <Box as="ul" pad="medium">
        <InfiniteScroll items={images}>
          {image => (
            <Box
              key={image}
              as="li"
              direction="row"
              align="center"
              justify="between"
              gap="medium"
              background={
                deleting === image
                  ? { color: 'white', opacity: true }
                  : undefined
              }
            >
              <Box flex="shrink" direction="row" align="center" gap="medium">
                <Box width="xsmall" height="xsmall">
                  <Image src={`${apiUrl}/${image}?size=192`} fit="contain" />
                </Box>
                <Text size="large">{image}</Text>
              </Box>
              <Box
                alignSelf="center"
                border={{ side: 'top', style: 'dashed' }}
                flex
              />
              <Button
                icon={<Trash />}
                hoverIndicator
                onClick={() => {
                  setDeleting(image);
                  deleteImage(image)
                    .then(() => {
                      ReactGA.event({
                        category: 'manage',
                        action: 'delete image',
                      });
                    })
                    .then(onDone);
                }}
              />
            </Box>
          )}
        </InfiniteScroll>
      </Box>
    </Box>
  );
};

export default Manage;
