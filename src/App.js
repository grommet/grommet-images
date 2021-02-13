import React, { useEffect, useMemo, useState } from 'react';
import ReactGA from 'react-ga';
import { Grommet, grommet } from 'grommet';
import { filterMine, loadImages } from './images';
import Add from './Add';
import Browse from './Browse';
import Loading from './Loading';
import Manage from './Manage';

const App = () => {
  const [images, setImages] = useState();
  const [view, setView] = useState();

  // initialize analytics
  useEffect(() => {
    if (window.location.host !== 'localhost') {
      const {
        location: { pathname },
      } = window;
      ReactGA.initialize('UA-99690204-6');
      ReactGA.pageview(pathname);
    }
  }, []);

  useEffect(() => {
    if (!view) {
      setImages(undefined);
      loadImages().then((nextImages) => setImages(nextImages));
    }
  }, [view]);

  const mine = useMemo(() => filterMine(images), [images]);

  let content;
  if (!images) content = <Loading />;
  else if (view === 'add') content = <Add onDone={() => setView(undefined)} />;
  else if (view === 'manage')
    content = <Manage images={mine} onDone={() => setView(undefined)} />;
  else
    content = (
      <Browse
        images={images}
        mine={mine}
        onAdd={() => setView('add')}
        onManage={() => setView('manage')}
      />
    );

  return (
    <Grommet theme={grommet} themeMode="dark" style={{ minHeight: '100vh' }}>
      {content}
    </Grommet>
  );
};

export default App;
