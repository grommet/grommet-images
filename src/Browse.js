import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  Anchor,
  Box,
  Button,
  Grid,
  Header,
  Heading,
  Image,
  InfiniteScroll,
  Stack,
  Text,
  TextInput,
} from 'grommet';
import { Add, Search } from 'grommet-icons';
import { apiUrl } from './images';

const ImageName = styled(Text)`
  pointer-events: none;
`;

const Browse = ({ images: allImages, mine, onAdd, onManage }) => {
  const [search, setSearch] = useState('');

  const images = useMemo(() => {
    const exp = new RegExp(search, 'i');
    return search ? allImages.filter(i => exp.test(i)) : allImages;
  }, [allImages, search]);

  return (
    <Box>
      <Header pad="medium" gap="xlarge">
        <Heading margin="none">images</Heading>
        <TextInput
          icon={<Search />}
          value={search}
          onChange={event => setSearch(event.target.value)}
        />
        <Box flex={false} direction="row" align="center" gap="medium">
          {mine && <Anchor label="manage" onClick={onManage} />}
          <Button icon={<Add />} primary onClick={onAdd} />
        </Box>
      </Header>
      <Grid pad="medium" columns="small" rows="small" gap="medium">
        <InfiniteScroll items={images}>
          {image => (
            <Button
              key={image}
              href={`${apiUrl}/${image}`}
              target="_blank"
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
                      hover ? { color: 'black', opacity: 'medium' } : undefined
                    }
                    pad="small"
                    align="center"
                    justify="center"
                  >
                    {hover && (
                      <ImageName key="name" color="white">
                        {image.split('/').join(' ')}
                      </ImageName>
                    )}
                  </Box>
                </Stack>
              )}
            </Button>
          )}
        </InfiniteScroll>
      </Grid>
    </Box>
  );
};

export default Browse;
