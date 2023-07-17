import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import DungeonExplore from '../components/dungeon_explore';
import Exits from '../components/exits';

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Stack
    spacing={2}
        sx={{
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Crimson Warriors
        </Typography>
        <DungeonExplore />
        <Divider />
        <Exits />
      </Stack>
    </Container>
  );
}
