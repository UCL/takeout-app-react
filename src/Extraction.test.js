import React from 'react';

import { createShallow } from '@material-ui/core/test-utils';
import fetchMock from 'fetch-mock/es5/client';

import Button from '@material-ui/core/Button';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';

import { Extraction } from './Extraction.js';

const shallow = createShallow({untilSelector: "ExtractionComponent"});
let wrapper;

beforeAll(() => {
  wrapper = shallow(<Extraction />)
});

it('it contains two children, Paper and Grow', () => {
  expect(wrapper.children()).toHaveLength(2);
  expect(wrapper.childAt(0).type()).toEqual(Paper);
  expect(wrapper.childAt(1).type()).toEqual(Grow);
});

it('it contains 4 buttons', () => {
  expect(wrapper.find(Button)).toHaveLength(3);
});

it('submit data to API and returns 200/OK', async () => {
  fetchMock.put("end:/takeout/submit", 200);
  const instance = wrapper.instance();
  await instance.submitData();
  expect(wrapper.state('isSubmitSuccess')).toEqual(true);
  expect(wrapper.state('openSubmitDialog')).toEqual(true);
});

it('submit data to API and returns 404/Not Found', async () => {
  fetchMock.put("end:/takeout/submit", 404, { overwriteRoutes: true });
  const instance = wrapper.instance();
  await instance.submitData();
  expect(wrapper.state('isSubmitSuccess')).toEqual(false);
  expect(wrapper.state('openSubmitDialog')).toEqual(true);
});
