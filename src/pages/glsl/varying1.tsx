import React from 'react';
import * as THREE from 'three';

// @ts-ignore
import InitThreeJS from '../../service/init.js';
class Welcome extends React.Component {
  constructor(props:any) {
    super(props);
  }

  componentDidMount() {
    var instance = new InitThreeJS();
    instance.init();
  }
  render() {
    return <div id="gl" />;
  }
}

export default Welcome;
