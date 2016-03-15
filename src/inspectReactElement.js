import util from 'util';
import React from 'react';
import omit from 'lodash.omit';
import indentString from 'indent-string';

/**
 * Threshold after which we format props vertically.
 */
const MAX_LEN_THRESHOLD = 50;

function lengthOfStringsInArray(array) {
  return array.reduce((value, item) => value + item.length, 0);
}

function inspectReactProp(propName, propValue) {
  if (typeof propValue == 'string') return `${propName}="${propValue}"`;
  return `${propName}={${util.inspect(propValue)}}`;
}

function inspectReactProps(node) {
  return node.props || {};
}

function inspectReactType(type) {
  if (!type) return '' + type;
  return typeof type == 'string' ? type : type.displayName || type.name;
}

function inspectReactNode(node, depth = 0, options = {}) {
  let {
    inspectReactProps: _inspectReactProps = inspectReactProps,
    inspectReactProp: _inspectReactProp = inspectReactProp,
    inspectReactType: _inspectReactType = inspectReactType
  } = options;
  if (!React.isValidElement(node)) {
    const childInspected = util.inspect(node);
    const childText = depth > 0 ? `{${childInspected}}` : childInspected;
    return childText;
  }

  const props = _inspectReactProps(node);
  const propNames = Object.keys(omit(props, 'children'));
  const propsText = propNames.length && propNames
    .map(propName => _inspectReactProp(propName, props[propName]))
    .filter(Boolean)

  let childrenText;
  if (props.children) {
    const childrenInspected = [];
    React.Children.forEach(props.children, (node) => childrenInspected.push(inspectReactNode(node, depth + 1, options)));
    childrenText = childrenInspected.join('\n');
  }

  let nodeText = '<';
  nodeText += _inspectReactType(node.type);

  if (propsText) {
    if (nodeText.length + lengthOfStringsInArray(propsText) > MAX_LEN_THRESHOLD) {
      nodeText += '\n' + indentString(propsText.join('\n'), '  ', 1);

    } else {
      nodeText += ` ${propsText.join(' ')}`;
    }
  }

  if (childrenText) {
    nodeText += '>\n';
    nodeText += indentString(childrenText, '  ', 1);
    nodeText += `\n</${_inspectReactType(node.type)}>`;
  } else {
    nodeText += ' />';
  }
  return nodeText;
}

export default function inspectReactElement(element, options) {
  return inspectReactNode(element, 0, options);
}

inspectReactElement.inspectReactProp = inspectReactProp;
inspectReactElement.inspectReactProps = inspectReactProps;
inspectReactElement.inspectReactType= inspectReactType;
