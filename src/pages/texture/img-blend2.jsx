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

    const vert  =  "" +
      "        varying vec2 vUv;" +
      "        void main(){" +
      "            vUv = uv;" +
    "            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);" +
      "        }" +
      "    "
      const frag =  "" +
        "        uniform float time;" +
        "        uniform sampler2D hollowOutMap;" +
        "        uniform sampler2D videoMap;" +
        "" +
        "        varying vec2 vUv;" +
        "" +
        "        void main(){" +
        "            vec4 hollowOut = texture2D(hollowOutMap,vUv );" +
        "            vec4 video = texture2D(videoMap,vUv );" +

        "            float show = smoothstep(1.0,0.0,pow(hollowOut.r,2.0));" +
        "" +
        "            vec4 finalColor = video;" +
        "            finalColor.a = show;" +

        "" +
        "" +
        "            gl_FragColor = finalColor;" +
        "        }" +
        "    "



    var video = document.getElementById("bgm");
    var videoTexture = new THREE.VideoTexture(video);
    videoTexture.wrapS = videoTexture.wrapT = THREE.ClampToEdgeWrapping
      videoTexture.minFilter = THREE.LinearFilter;
    

    var geometry = new THREE.PlaneGeometry(19, 10);


    var hollowOutMap = new THREE.TextureLoader().load(
      "http://shader.ecoblog.online/textures/hollow.jpg"
    );

    var uniforms = {

      videoMap: {
        value: videoTexture
      },
      hollowOutMap: {
        value: hollowOutMap
      }
    };


    var shaderMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vert,
      fragmentShader: frag,
      transparent:true
    });

    var sphere = new THREE.Mesh(geometry, shaderMaterial);

    sphere.renderOrder = 9
    sphere.position.y = 2
    instance.scene.add(sphere);



    // 背后的

    var bgmImg = new THREE.Mesh(new THREE.PlaneGeometry(20,13),new THREE.MeshLambertMaterial({
      map: (new THREE.TextureLoader()).load("http://img.mp.itc.cn/upload/20160802/ff9ed2df618642e4b64150891633c2d5_th.jpg"),
    }));

    bgmImg.position.set(0, 1, -2),
      instance.scene.add(bgmImg);

  }
  render() {




    return <div id="gl" >
      <h1>视频纹理镂空</h1>
      <video id="bgm" style={{'display':"none"}} src={require("../../assets/tx.mp4")} autoPlay controls loop />
    </div>;
  }
}

export default ImgBlend
