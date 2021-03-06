// Created by hztangzhao on 2020/8/28.

import React from 'react';
import ReactDOM from 'react-dom';
import InitThreeJS from '../../service/init';


export default class Demo1 extends React.Component {
  constructor(props) {
    super(props);
  }




  componentDidMount() {



    const vert =  `
    varying vec2 vUv;

      void main()
      {
      vUv = uv;
      gl_Position = projectionMatrix * viewMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    
    `

    const frag = `
     uniform float time;

      varying vec2 vUv;

      void main(void) {

      vec2 position = - 1.0 + 2.0 * vUv;

      float red = abs(sin(position.x * position.y + time / 5.0));
      float green = abs(sin(position.x * position.y + time / 4.0));
      float blue = abs(sin(position.x * position.y + time / 3.0));
      gl_FragColor = vec4(red, green, blue, 1.0);

      }
    
    
    `


    var renderer;
    var stats;
    var clock;
    var uniforms1;
    var camera;
    var scene;
    var light;
    var mesh;
    var width,height

//初始化webgl
    function initThree() {
       width = document.getElementById("gl").clientWidth;
       height = document.getElementById("gl").clientHeight;
      renderer = new THREE.WebGLRenderer();

      renderer.setSize(width, height);
      document
        .getElementById("gl")
        .appendChild(renderer.domElement);
      renderer.setClearColor(0xffffff, 1.0);

      clock = new THREE.Clock();
    }

//设置相机
    function initCamera() {
      camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
      camera.position.set(0, 0, 100);
      camera.up = new THREE.Vector3(0, 1, 0);

      camera.lookAt(0, 0, 0);
    }

//初始化场景
    function initScene() {
      scene = new THREE.Scene();
    }

//设置化灯光
    function initLight() {
      light = new THREE.AmbientLight(0xff0000);
      light.position.set(100, 100, 200);
      scene.add(light);
    }

//几何物体
    function initObject() {
      uniforms1 = {
        time: { value: 1.0 }
      };

      var geometry = new THREE.PlaneBufferGeometry(100, 150, 400);
      var material = new THREE.ShaderMaterial({
        uniforms: uniforms1,
        vertexShader: vert,
        fragmentShader: frag
      });
      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    }

//运行webgl
    function threeStart() {
      initThree();
      initCamera();
      initScene();
      initLight();
      initObject();
      animation();
    }

//设置动态场景
    function animation() {
      var delta = clock.getDelta();
      uniforms1.time.value += delta * 5;
      renderer.render(scene, camera);
      requestAnimationFrame(animation);
    }

      threeStart();

  }
  render() {
    return <div id="gl" >
      <h1>流动的颜色</h1>
      
    </div>;
  }
}

