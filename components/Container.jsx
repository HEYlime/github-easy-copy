
import { cloneElement } from 'react';

const style = {
  width: '100%',
  maxWdith: 1200,
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: 38,
  paddingRight: 38
}

export default ({ children, renderer = <div /> }) => {

  const newElement = cloneElement(renderer, {
    style: Object.assign({}, renderer.props.style, style),
    children
  })

  return newElement;
}