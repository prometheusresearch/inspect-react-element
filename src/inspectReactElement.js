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

function inspectReactType(type) {
  if (!type) return '' + type;
  return typeof type == 'string' ? type : type.displayName || type.name;
}

function inspectReactNode(node, depth = 0) {
  if (!React.isValidElement(node)) {
    const childInspected = util.inspect(node);
    const childText = depth > 0 ? `{${childInspected}}` : childInspected;
    return childText;
  }

  const props = node.props || {};
  const propNames = Object.keys(omit(props, 'children'));
  const propsText = propNames.length && propNames
    .map(propName => inspectReactProp(propName, props[propName]))

  let childrenText;
  if (props.children) {
    const childrenInspected = [];
    React.Children.forEach(props.children, (node) => childrenInspected.push(inspectReactNode(node, depth + 1)));
    childrenText = childrenInspected.join('\n');
  }

  let nodeText = '<';
  nodeText += inspectReactType(node.type);

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
    nodeText += `\n</${inspectReactType(node.type)}>`;
  } else {
    nodeText += ' />';
  }
  return nodeText;
}

export default function inspectReactElement(element) {
  return inspectReactNode(element);
}
