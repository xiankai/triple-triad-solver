import React from 'react';
import { connect } from 'react-redux';

import { toggleRule } from '../../common/cards/actions';

import {
  Panel,
  PanelHeader,
  PanelFooter,
  Flex,
  Box,

  Checkbox,
  Tooltip,
} from '../app/components';

const Rule = ({
  rule,
  handleChange,
  checked,
  disabled,
}) => (
  <Checkbox
    label={rule}
    name={rule}
    onChange={handleChange}
    checked={checked}
    disabled={disabled && !checked}
    style={{
      opacity: disabled && !checked ? 0.2 : 1,
    }}
  />
);

const Rules = ({
  rules,
  disabled,
  started,
  toggleRule,
}) => (
  <Panel theme="info">
    <PanelHeader>
      Ruleset
    </PanelHeader>
    <Flex wrap>
      {
        rules.map(({ flag, rule }) => (
          <Box col={2} key={rule}>
            <Rule
              rule={rule}
              handleChange={toggleRule(rule)}
              checked={flag}
              disabled={disabled || started}
            />
          </Box>
        ))
      }
    </Flex>
    <PanelFooter>
      Optional. Pick up to 2. The other rules have not been implemented yet.
    </PanelFooter>
  </Panel>
);

export default connect(
  (state) => {
    const rulesObj = state.cards.present.rules;
    const rules = [];
    let count = 0;
    for (const rule in rulesObj) {
      const flag = rulesObj[rule];
      if (flag) {
        count++;
      }

      rules.push({
        rule,
        flag,
      });
    }

    return {
      rules,
      disabled: count >= 2,
    };
  },
  dispatch => ({
    toggleRule: rule => () => dispatch(toggleRule(rule)),
  })
)(Rules);
