import test from 'ava';
import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import <%= camelComponentName %> from '../src/index.jsx';

configure({ adapter: new Adapter() });

test('general usage', t => {
  const msg="testing message";
  const wrapper = shallow(<<%= camelComponentName %> content={msg} />);
  t.is(wrapper.contains(<div>{msg}</div>), true);
});
