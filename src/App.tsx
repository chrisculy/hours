import React from 'react';
import { Container, Typography } from '@mui/material';
import { Hours } from './Hours';

function App() {
  return (
    <Container>
      <Typography variant='h2' display='flex' justifyContent='center'>one thousand hours</Typography>
      <Hours />
    </Container>
  );
}

export default App;
