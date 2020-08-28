import React from 'react';
// @ts-ignore
import InitThreeJS from '../../service/init.js';
class ImgBlend extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    var instance = new InitThreeJS();
    instance.init();
    const vert = ` 
      uniform float amplitude;

      attribute float displacement;
      varying vec3 vNormal;
      varying vec2 vUv;

      void main() {

      vNormal = normal;
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

      }
      `

    const frag = `
              varying vec3 vNormal;
      varying vec2 vUv;

      uniform float time;
      uniform vec3 color;
      uniform sampler2D colorTexture;
      uniform sampler2D colorTexture1;
      vec3 blendAdd(vec3 base, vec3 blend) {
        return min(base+blend,vec3(1.0));
      }


      float blendScreen(float base, float blend) {
        return 1.0-((1.0-base)*(1.0-blend));
      }

      vec3 blendScreen(vec3 base, vec3 blend) {
        return vec3(blendScreen(base.r,blend.r),blendScreen(base.g,blend.g),blendScreen(base.b,blend.b));
      }




      void main() {

        vec2 u_uv = vUv;

       vec4 tcolor1 = texture2D( colorTexture, u_uv );

       vec4 tcolor2 = texture2D( colorTexture1, u_uv );
       vec3 tcolor = blendScreen(vec3(tcolor1), vec3(tcolor2));
      gl_FragColor =vec4( tcolor.xyz, 1.0 );

      }
    `

    var geometry = new THREE.PlaneBufferGeometry(20, 20);

    var texture = new THREE.TextureLoader().load(
      "https://pic1.zhimg.com/80/v2-2fc6a0e529a64dcda4ebbd4bd08f9529_1440w.jpg"
    );

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    var texture1 = new THREE.TextureLoader().load(
      "https://nos.netease.com/mg-file/mg/drawsth2017/20200819/15978028679587.png"
    );

    var uniforms = {
      time: { value: 1.0 },
      amplitude: { value: 1.0 },
      color: { value: new THREE.Color(0xff2200) },
      colorTexture: {
        value: texture
      },
      colorTexture1: {
        value: texture1
      }
    };

    texture1.wrapS = THREE.RepeatWrapping;
    texture1.wrapT = THREE.RepeatWrapping;
    var shaderMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vert,
      fragmentShader: frag
    });

    var sphere = new THREE.Mesh(geometry, shaderMaterial);

    sphere.position.y = 0
    instance.scene.add(sphere);


  }
  render() {




    return <div id="gl" >


    </div>;
  }
}

export default ImgBlend
