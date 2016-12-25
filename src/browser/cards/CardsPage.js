/* @flow */
import React from 'react';
import {
  PageHeader,
  Title,
  View,

  Grid,
  Flex,
  Box,
} from '../app/components';

const placedCards = [
  [
    [1, 2, 3, 4],
    [1, 2, 3, 4],
    [1, 2, 3, 4],
  ],
  [
    [1, 2, 3, 4],
    [1, 2, 3, 4],
    [1, 2, 3, 4],
  ],
  [
    [1, 2, 3, 4],
    [1, 2, 3, 4],
    [1, 2, 3, 4],
  ],
];

const Card = ({ dimensions: [top, left, bottom, right] }) => (
  <Box style={{ position: 'relative', height: 120, border: '1px dotted red'}}>
    <div style={{ position: 'absolute', top: '5%', left: '45%' }}>{top}</div>
    <div style={{ position: 'absolute', left: '5%', top: '45%' }}>{left}</div>
    <div style={{ position: 'absolute', bottom: '5%', left: '45%' }}>{bottom}</div>
    <div style={{ position: 'absolute', right: '5%', top: '45%' }}>{right}</div>
  </Box>
);

const CardsPage = () => (
  <View>
    <Title message="Triple Triad Solver" />
    <PageHeader
      description="Get the latest scoop on your winning odds against Rowena"
      heading="Triple Triad Solver"
    />
    <Flex>
      <Box 
        auto
        p={1}
      >
      </Box>
      <Box 
        auto
        p={1}
      >
        {
          placedCards.map(column => (
            <Grid
              col={4}
              p={0}
            >
              {
                column.map(placedCard => <Card dimensions={placedCard} />)
              }
            </Grid>
          ))
        }
      </Box>
      <Box 
        auto
        p={1}
      >
      </Box>
    </Flex>
  </View>
);

export default CardsPage;
