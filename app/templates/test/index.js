import test from 'ava';
import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import browserEnv from 'browser-env';

import <%= camelComponentName %> from '../src';

configure({ adapter: new Adapter() });
browserEnv();

test('general usage', t => {
  const msg="testing message";
  const wrapper = shallow(<<%= camelComponentName %> content={msg} />);
  t.is(wrapper.contains(<div>{msg}</div>), true);
});
