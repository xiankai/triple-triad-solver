/* @flow */
import React from 'react';
import {
  PageHeader,
  SwitchTheme,
  Title,
  View,
} from '../app/components';

const HomePage = () => (
  <View>
    <Title message="Triple Triad Solver" />
    <PageHeader
      description="Barebones site. Currently only a TT simulator is available."
      heading="Lima's project"
    />
    <SwitchTheme />
  </View>
);

export default HomePage;
