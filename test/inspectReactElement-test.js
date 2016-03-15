'use strict';

var tap = require('tap');
 
tap.test('inspectReactElement produces desired output', function (t) {
  t.plan(1);
  var inspectReactElement = require('../');
  var React = require('react');

  t.equal(inspectReactElement(React.createElement('div')), '<div />');
});

tap.test('inspectReactElement picks up .displayName before .name', function (t) {
  t.plan(1);
  var inspectReactElement = require('../');
  var React = require('react');

  class Custom extends React.Component {
  }
  Custom.displayName = 'Super';

  t.equal(inspectReactElement(React.createElement(Custom)), '<Super />');
});

tap.test('inspectReactElement formats props vertically if it hits threshold', function (t) {
  t.plan(2);
  var inspectReactElement = require('../');
  var React = require('react');

  t.equal(
      inspectReactElement(React.createElement(
        'div',
        {longProp: 'someLongPropValue',
         anotherLongProp: 'anotherLongPropValue'})),
        [
          '<div',
          '  longProp="someLongPropValue"',
          '  anotherLongProp="anotherLongPropValue" />',
        ].join('\n'))

  t.equal(
      inspectReactElement(React.createElement(
        'div',
        {longProp: 'someLongPropValue',
         anotherLongProp: 'anotherLongPropValue'},
        'Hello')),
        [
          '<div',
          '  longProp="someLongPropValue"',
          '  anotherLongProp="anotherLongPropValue">',
          "  {'Hello'}",
          '</div>'
        ].join('\n'))
});
