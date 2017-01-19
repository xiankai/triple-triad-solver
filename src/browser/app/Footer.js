/* @flow */
import React from 'react';
import { Footer, Link } from '../app/components';
import { FormattedMessage, defineMessages } from 'react-intl';

const messages = defineMessages({
  madeByHtml: {
    defaultMessage: 'A project by ',
    id: 'footer.madeByHtml',
  },
});

const AppFooter = () => (
  <Footer>
    <FormattedMessage {...messages.madeByHtml} />
    {'\u00a0'}
    <Link to="https://github.com/xiankai/triple-triad-solver">
      @xiankai
    </Link>
  </Footer>
);

export default AppFooter;
