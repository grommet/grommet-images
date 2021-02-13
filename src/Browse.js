import React, { useContext, useEffect, useMemo, useState } from 'react';
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
  ResponsiveContext,
  Stack,
  Text,
  TextInput,
} from 'grommet';
import { Add, List, Search } from 'grommet-icons';
import { apiUrl } from './images';

const ImageName = styled(Text)`
  pointer-events: none;
`;

const Browse = ({ images: allImages, mine, onAdd, onManage }) => {
  const responsive = useContext(ResponsiveContext);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState('');

  const images = useMemo(() => {
    const exp = new RegExp(search, 'i');
    setCount(0);
    return search ? allImages.filter((i) => exp.test(i)) : allImages;
  }, [allImages, search]);

  useEffect(() => {
    if (count < images.length) {
      const timer = setTimeout(() => setCount(count + 1), 200);
      return () => clearTimeout(timer);
    }
  }, [count, images]);

  return (
    <Box>
      <Header pad="medium" gap="xlarge">
        <Heading margin="none">images</Heading>
        {responsive !== 'small' && [
          <TextInput
            key="search"
            icon={<Search />}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />,
          <Box
            key="actions"
            flex={false}
            direction="row"
            align="center"
            gap="medium"
          >
            {mine && <Anchor label="manage" onClick={onManage} />}
            <Button icon={<Add />} primary onClick={onAdd} />
          </Box>,
        ]}
      </Header>
      <Grid pad="large" columns="small" rows="small" gap="medium">
        <InfiniteScroll items={images}>
          {(image, index) => (
            <Button
              key={image}
              href={`${apiUrl}/${image}`}
              target="_blank"
              plain
            >
              {({ hover }) => (
                <Stack fill>
                  <Box
                    fill
                    animation={{ type: 'fadeIn', duration: index * 200 }}
                    background={
                      index > count ? 'background-contrast' : undefined
                    }
                  >
                    {index <= count && (
                      <Image
                        src={`${apiUrl}/${image}?size=192`}
                        fit="contain"
                      />
                    )}
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
      {responsive === 'small' && (
        <Box
          pad="medium"
          direction="row"
          align="center"
          gap="medium"
          justify="center"
          background={{ color: 'background', opacity: 'strong' }}
          style={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
        >
          <Button icon={<Search />} hoverIndicator />
          <Button icon={<Add />} primary hoverIndicator onClick={onAdd} />
          {mine && <Button icon={<List />} hoverIndicator onClick={onManage} />}
        </Box>
      )}
    </Box>
  );
};

export default Browse;
