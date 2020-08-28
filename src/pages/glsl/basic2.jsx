// Created by hztangzhao on 2020/8/28.

import React from 'react';

export default class Basic1 extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

    const vert =  `
      varying vec3 color;
      void main() {
        // position (-1,1,0) (1,1,0) (1,-1,0) (-1,-1,0)
        // 上右左下 (0,1,0) (1,1,0) (1,0,0)  (0,0,0)
        color = vec3(position);
      gl_Position = vec4(position, 1.0);
      }
    `

    const frag = `
       #ifdef GL_ES
      precision mediump float;
      #endif

      uniform float u_time;

      varying vec3 color;
      void main(void) {
        // 注意隐式类型转换
        gl_FragColor = vec4(
            abs(sin(color.x+u_time/2.0)),
            abs(sin(color.y+u_time/5.0)),
            abs(sin(color.z+u_time)),
            1
          );

      }
    `
    var container;
    var camera, scene, renderer;
    var uniforms;

    init();
    animate();

    function init() {
      container = document.getElementById("gl");

      camera = new THREE.Camera();
      camera.position.z = 1;

      scene = new THREE.Scene();

      var geometry = new THREE.PlaneBufferGeometry(2, 2);

      uniforms = {
        u_time: { type: "f", value: 1.0 },

        resolution: { type: "v2", value: new THREE.Vector2() }
      };

      var material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vert,
        fragmentShader: frag
      });

      var mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);



     renderer = new THREE.WebGLRenderer()
      renderer.setPixelRatio(window.devicePixelRatio);

      container.appendChild(renderer.domElement);

      onWindowResize();
      window.addEventListener("resize", onWindowResize, false);
    }

    function onWindowResize(event) {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    }

    function animate() {
      requestAnimationFrame(animate);
      render();
    }

    function render() {
      uniforms.u_time.value += 0.01;
      renderer.render(scene, camera);
    }

  }
  render() {
    return <div id="gl" >
      <h1>颜色变化</h1>
      

      
    </div>;
  }
}

