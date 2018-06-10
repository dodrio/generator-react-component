import React from 'react';
import <%= camelComponentName %> from '.';
import renderer from 'react-test-renderer';

test('simple call', () => {
  const component = renderer.create(<<%= camelComponentName %> content="Just a component." />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
