// Created by hztangzhao on 2020/8/28.

import React from 'react';

export default class Basic1 extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

    const vert =  `

      void main() {
        gl_Position = vec4(position, 1.0);
      }
    
    `

    const frag = `
      uniform vec3 color;
      void main() {
        gl_FragColor = vec4(color, 1.0);

      } 
    `

    let tempColor = null
    var renderer;
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
        color:{value: new THREE.Vector3( 0.1, 0.5, 0.4 )},
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

      if(tempColor) {
        uniforms1.color.value = tempColor;
        tempColor = null
      }
      renderer.render(scene, camera);
      requestAnimationFrame(animation);
    }

      threeStart();
    

    $("#color").change(function(){
      const color = $(this).val()
      var rgbaCol = new THREE.Vector3( parseInt(color.slice(-6, -4), 16)/256 , parseInt(color.slice(-4, -2), 16)/256 , parseInt(color.slice(-2), 16)/256 );

      console.log("**********************");
      console.log(rgbaCol);

      tempColor = rgbaCol
    })
    
    


  }
  render() {
    return <div id="gl" >
      <h1>基础颜色显示</h1>
      
    <p>  &nbsp;选择颜色以后，点击空白区域：<input id="color" type="color"/></p>
      
    </div>;
  }
}

