import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';

const LandingPage = () => {
  const pantryItems = [
    { id: 1, name: 'Rice', quantity: '2 kg' },
    { id: 2, name: 'Pasta', quantity: '1 kg' },
    { id: 3, name: 'Canned Beans', quantity: '5 cans' },
    // Add more items as needed
  ];

  return (
    <Container>
      <header>
        <Typography variant="h2" align="center" gutterBottom>
          Pantry Tracker
        </Typography>
      </header>
      <Grid container spacing={3}>
        {pantryItems.map(item => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardContent>
                <Typography variant="h5">{item.name}</Typography>
                <Typography color="textSecondary">{item.quantity}</Typography>
                <Button variant="contained" color="primary">Edit</Button>
                <Button variant="outlined" color="secondary">Delete</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <footer>
        <Typography variant="body2" align="center" style={{ marginTop: '20px' }}>
          © 2023 Pantry Tracker. All rights reserved.
        </Typography>
      </footer>
    </Container>
  );
};

export default LandingPage;