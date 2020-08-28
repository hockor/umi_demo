// Created by hztangzhao on 2020/8/28.

import React from 'react';

export default class Basic1 extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

    const vert =  `
       uniform float color;
      varying float color2;
      void main() {
        color2 = color;
        gl_Position = vec4(position, 1.0);
      }
    `

    const frag = `
       #ifdef GL_ES
        precision mediump float;
        #endif

        varying float color2;
        uniform float time;
        uniform vec2 resolution;

        // 试试取同一个值
        float plot(float st) {
          return smoothstep(0.5, 0.5, st);
      }

        void main(void) {
        float k = gl_FragCoord.y / resolution.y;
          float d = gl_FragCoord.x / resolution.x;
          gl_FragColor = vec4(k,d,0,1);

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
      renderer.setSize(window.innerWidth - 300, window.innerHeight-100);
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
      <h1>FragCoord</h1>
      

      
    </div>;
  }
}

