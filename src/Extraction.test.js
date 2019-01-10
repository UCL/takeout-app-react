import React from 'react';

import { createShallow } from '@material-ui/core/test-utils';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';

import { Extraction } from './Extraction.js';

it('it contains two children, Paper and Grow', () => {
  const shallow = createShallow();
  const wrapper = shallow(<Extraction />);
  expect(wrapper.dive().children()).toHaveLength(2);
  expect(wrapper.dive().childAt(0).type()).toEqual(Paper);
  expect(wrapper.dive().childAt(1).type()).toEqual(Grow);
});
