import React from 'react';

/* eslint-disable */
class ModelAni extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {


    const vert = `
    uniform float amplitude;

        attribute float displacement;
        varying vec3 vNormal;
        varying vec2 vUv;

        void main() {

          vNormal = normal;
          vUv = uv;
  
          gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
        }
`


    const frag = `
    
        varying vec3 vNormal;
        varying vec2 vUv;

        uniform float time;
        uniform vec3 color;
        uniform sampler2D colorTexture;
        uniform sampler2D colorTexture1;

        void main() {


        gl_FragColor =vec4(vNormal.xyz, 1.0);

      }
    `
    var renderer, camera, scene, gui, light, stats, controls, meshHelper, mixer, action, datGui, uniforms
    var clock = new THREE.Clock()

    var _test = null

    function initRender () {
      renderer = new THREE.WebGLRenderer({antialias: true})
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setClearColor(0xeeeeee)
      renderer.shadowMap.enabled = true
      //告诉渲染器需要阴影效果
      document.getElementById('gl').appendChild(renderer.domElement)
    }

    function initCamera () {
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000)
      camera.position.set(100, 200, 300)
    }

    function initScene () {
      scene = new THREE.Scene()
      scene.background = new THREE.Color(0xa0a0a0)
      scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000)
    }

    //初始化dat.GUI简化试验流程
    function initGui () {
      //声明一个保存需求修改的相关数据的对象
      gui = {
        helper: true //模型辅助线
      }
      // eslint-disable-next-line no-undef
      datGui = new dat.GUI()
      //将设置属性添加到gui当中，gui.add(对象，属性，最小值，最大值）

      datGui.add(gui, 'helper').onChange(function (e) {
        meshHelper.visible = e
      })
    }

    function initLight () {
      scene.add(new THREE.AmbientLight(0x444444))

      light = new THREE.DirectionalLight(0xffffff)
      light.position.set(0, 200, 100)

      light.castShadow = true
      light.shadow.camera.top = 180
      light.shadow.camera.bottom = -100
      light.shadow.camera.left = -120
      light.shadow.camera.right = 120

      //告诉平行光需要开启阴影投射
      light.castShadow = true

      scene.add(light)
    }

    var texture = new THREE.TextureLoader().load(
      publicPath+'/fish/少年鸣人FbxTemp_0005.jpg'
    )

    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping

    var texture1 = new THREE.TextureLoader().load(
      publicPath+'/fish/light.jpg'
    )

    texture1.wrapS = THREE.RepeatWrapping
    texture1.wrapT = THREE.RepeatWrapping

    uniforms = {
      time: {value: 1.0},
      amplitude: {value: 1.0},
      color: {value: new THREE.Color(0xff2200)},
      colorTexture: {
        value: texture
      },
      colorTexture1: {
        value: texture1
      }
    }

    var shaderMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vert,
      fragmentShader: frag,
      skinning:true,
      needsUpdate:true
    })

    var material = new THREE.MeshBasicMaterial({color: 0xffffff, map:texture});

    function initModel () {

      //辅助工具
      var helper = new THREE.AxesHelper(50)
      scene.add(helper)

      // 地板
      var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({
        color: 0xffffff,
        depthWrite: false
      }))
      mesh.rotation.x = -Math.PI / 2
      mesh.receiveShadow = true
      scene.add(mesh)

      //添加地板割线
      var grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000)
      grid.material.opacity = 0.2
      grid.material.transparent = true
      scene.add(grid)

      //加载模型
      var loader = new THREE.FBXLoader()
      loader.load(publicPath+"/box.fbx", function (mesh) {

        //添加骨骼辅助
        meshHelper = new THREE.SkeletonHelper(mesh)
        scene.add(meshHelper)


        _test = mesh
        //设置模型的每个部位都可以投影
        mesh.traverse(function (child) {

          if ( child.isMesh ) {


            // try {
            //
            //   console.log("**********************");
            //   console.log(child.geometry);
            //
            //   const _mesh = new THREE.Mesh(new THREE.BufferGeometry().fromGeometry( child.geometry ),shaderMaterial)
            //
            //
            //   child = _mesh
            //
            //   console.log("**********************");
            //   console.log(child);
            //   mesh.add(child)
            // }catch (e){
            //   console.log("**********************");
            //   console.log(e);


            child.material = shaderMaterial

            child.material.needsUpdate = true
            child.material.skinning = true
            child.castShadow = true
            child.receiveShadow = true
            child.geometry.uvsNeedsUpdate = true
            child.geometry.attributes.position.needsUpdate = true;


            child.matrixAutoUpdate = false;
            child.updateMatrix();


          }

        })

        //AnimationMixer是场景中特定对象的动画播放器。当场景中的多个对象独立动画时，可以为每个对象使用一个AnimationMixer
        mixer = mesh.mixer = new THREE.AnimationMixer(mesh)

        //mixer.clipAction 返回一个可以控制动画的AnimationAction对象  参数需要一个AnimationClip 对象
        //AnimationAction.setDuration 设置一个循环所需要的时间，当前设置了一秒
        //告诉AnimationAction启动该动作
        //action = mixer.clipAction(mesh.animations[0]);
        //action.play();

        var actions = [] //所有的动画数组
        var animations = datGui.addFolder('animations')

        for ( var i = 0; i < mesh.animations.length; i++ ) {
          createAction(i)
        }

        function createAction (i) {
          actions[i] = mixer.clipAction(mesh.animations[i])
          gui['action' + i] = function () {
            for ( var j = 0; j < actions.length; j++ ) {
              if ( j === i ) {
                actions[j].play()
              } else {
                actions[j].stop()
              }
            }
          }

          animations.add(gui, 'action' + i)
        }

        //添加暂停所有动画的按键
        gui.stop = function () {
          for ( var i = 0; i < actions.length; i++ ) {
            actions[i].stop()
          }
        }

        datGui.add(gui, 'stop')

        // mesh.name = 'naro'

        mesh.scale.set(2, 2, 2)

        mesh.position.y += 100
        scene.add(mesh)
      })
    }

    //初始化性能插件
    function initStats () {
      // eslint-disable-next-line no-undef
      stats = new Stats()
      stats.setMode(0); // 0: fps, 1: ms
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.left = '0px';
      stats.domElement.style.top = '0px';
      document.getElementById('gl').appendChild(stats.domElement)
    }

    function initControls () {

      controls = new THREE.OrbitControls(camera, renderer.domElement)
      //设置控制器的中心点
      //controls.target.set( 0, 100, 0 );
      // 如果使用animate方法时，将此函数删除
      //controls.addEventListener( 'change', render );
      // 使动画循环使用时阻尼或自转 意思是否有惯性
      controls.enableDamping = true
      //动态阻尼系数 就是鼠标拖拽旋转灵敏度
      //controls.dampingFactor = 0.25;
      //是否可以缩放
      controls.enableZoom = true
      //是否自动旋转
      controls.autoRotate = false
      controls.autoRotateSpeed = 0.5
      //设置相机距离原点的最远距离
      controls.minDistance = 1
      //设置相机距离原点的最远距离
      controls.maxDistance = 2000
      //是否开启右键拖拽
      controls.enablePan = true
    }

    function render () {

      var time = clock.getDelta()
      if ( mixer ) {
        mixer.update(time)
      }

      controls.update()
    }

    //窗口变动触发的函数
    function onWindowResize () {

      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)

    }

    function animate () {
      //更新控制器
      render()
      //更新性能插件
      stats.update()

      renderer.render(scene, camera)

      if ( _test ) {
        _test.traverse(function (child) {

          if ( child.isMesh ) {


            child.material.needsUpdate = true
            child.material.skinning = true

            // console.log("********here********");
            // console.log( child.material.skinning);
            // console.log( child.geometry.attributes.position.needsUpdate);

          }

        })

      }
      uniforms.time.value += clock.getDelta()
      requestAnimationFrame(animate)
    }

    function draw () {
      //兼容性判断

      initGui()
      initRender()
      initScene()
      initCamera()
      initLight()
      initModel()
      initControls()
      initStats()

      animate()
      window.onresize = onWindowResize
    }

    draw()



  }
  componentWillUnmount () {

    $(".dg").remove()

  }

  render() {




    return <div id="gl" >




      <h1>模型材质+动画</h1>
    </div>;
  }
}

export default ModelAni
