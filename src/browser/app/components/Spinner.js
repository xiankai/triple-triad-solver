/* @flow */
import React from 'react';
import Image from './Image';

const Spinner = (props: Object) => (
  <Image {...props} tagName="img" src={require('./ajax-loader.gif')} />
);

export default Spinner;
