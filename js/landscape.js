
let customVertex = `vec3 mod289(vec3 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

// Classic Perlin noise
float cnoise(vec3 P)
{
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}

// Classic Perlin noise, periodic variant
float pnoise(vec3 P, vec3 rep)
{
  vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
  vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}

#define PI 3.1415926535897932384626433832795

uniform float time;
uniform float scroll;
uniform float maxHeight;
uniform float speed;
uniform float distortCenter;
uniform float roadWidth;
varying float vDisplace;

varying float fogDepth;

void main(){

  float t = time * speed;
  float wRoad = distortCenter;
  float wRoad2 = wRoad * 0.5;
  
  float angleCenter = uv.y * PI*4.0;
  angleCenter += t * 0.9;
  
  float centerOff = (
    sin(angleCenter) + 
    sin(angleCenter*0.5) 
  ) * wRoad;

  
  vec3 noiseIn = vec3(uv, 1.0)*10.0;
  float noise = cnoise(vec3(noiseIn.x, noiseIn.y + scroll, noiseIn.z));
  noise += 1.0;
  float h = noise;
  float angle = (uv.x - centerOff) * PI;
  float f = abs(cos(angle));
  h *= pow(f, 1.5 + roadWidth);
  

  vDisplace = h;
  

  h*=maxHeight;

  vec3 transformed = vec3( position.x, position.y, position.z + h );


  vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );
  gl_Position = projectionMatrix * mvPosition;
  
  fogDepth = -mvPosition.z;

}`

let customFragment = `
uniform float time;
					uniform vec3 color;
					uniform sampler2D pallete;
					varying float vDisplace;

					uniform vec3 fogColor;
					uniform float fogNear;
					uniform float fogFar;
					varying float fogDepth;

					void main(){

						vec2 stripPos = vec2( 0.0, vDisplace * (sin(time)*0.5+0.7) );
						vec4 stripColor = texture2D( pallete, stripPos );
						stripColor *= pow(1.0-vDisplace, 1.0);

						gl_FragColor = stripColor;

						#ifdef USE_FOG
							float fogFactor = smoothstep( fogNear, fogFar, fogDepth );
							gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
						#endif
					}
`

createLandscape({
  palleteImage:'img/pallete.png'
})

function createLandscape(params){

  var container = document.querySelector(".landscape")
  var width = window.innerWidth;
  var height = window.innerHeight;

  var scene, renderer, camera;
  var terrain;

  var mouse = { x:0, y:0, xDamped:0, yDamped:0 };
  var isMobile = typeof window.orientation !== 'undefined'

  init();

  function init(){

    sceneSetup();
    sceneElements();
    sceneTextures();
    render();

    if(isMobile)
      window.addEventListener("touchmove", onInputMove, {passive:false})
    else
      window.addEventListener("mousemove", onInputMove)
    
    window.addEventListener("resize", resize)
    resize()
  }

  function sceneSetup(){
    scene = new THREE.Scene();
    var fogColor = new THREE.Color( 0x333333 )
    scene.background = fogColor;
    scene.fog = new THREE.Fog(fogColor, 0, 400);

    
    sky()

    camera = new THREE.PerspectiveCamera(60, width / height, .1, 10000);
    camera.position.y = 8;
    camera.position.z = 4;
    
    ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight)
    

    renderer = new THREE.WebGLRenderer( {
      canvas:container,
      antialias:true
    } );
    renderer.setPixelRatio = devicePixelRatio;
    renderer.setSize(width, height);
    

  }

  function sceneElements(){

    var geometry = new THREE.PlaneBufferGeometry(100, 400, 400, 400);

    var uniforms = {
      time: { type: "f", value: 0.0 },
      scroll: { type: "f", value: 0.0 },
      distortCenter: { type: "f", value: 0.1 },
      roadWidth: { type: "f", value: 0.5 },
      pallete:{ type: "t", value: null},
      speed: { type: "f", value: 3 },
      maxHeight: { type: "f", value: 10.0 },
      color:new THREE.Color(1, 1, 1)
    }
    
    var material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([ THREE.ShaderLib.basic.uniforms, uniforms ]),
      vertexShader: customVertex,
      fragmentShader: customFragment,
      wireframe:false,
      fog:true
    });

    terrain = new THREE.Mesh(geometry, material);
    terrain.position.z = -180;
    terrain.rotation.x = -Math.PI / 2

    scene.add(terrain)

  }

  function sceneTextures(){

    // pallete
    new THREE.TextureLoader().load( params.palleteImage, function(texture){
      terrain.material.uniforms.pallete.value = texture;
      terrain.material.needsUpdate = true;
    });
  }

  function sky(){
    sky = new THREE.Sky();
    sky.scale.setScalar( 450000 );
    sky.material.uniforms.turbidity.value = 13;
    sky.material.uniforms.rayleigh.value = 1.2;
    sky.material.uniforms.luminance.value = 1;
    sky.material.uniforms.mieCoefficient.value = 0.1;
    sky.material.uniforms.mieDirectionalG.value = 0.58;
    
    scene.add( sky );

    sunSphere = new THREE.Mesh(
      new THREE.SphereBufferGeometry( 20000, 16, 8 ),
      new THREE.MeshBasicMaterial( { color: 0xffffff } )
    );
    sunSphere.visible = false;
    scene.add( sunSphere );
    
    var theta = Math.PI * ( -0.002 );
    var phi = 2 * Math.PI * ( -.25 );

    sunSphere.position.x = 400000 * Math.cos( phi );
    sunSphere.position.y = 400000 * Math.sin( phi ) * Math.sin( theta );
    sunSphere.position.z = 400000 * Math.sin( phi ) * Math.cos( theta );
    
    sky.material.uniforms.sunPosition.value.copy( sunSphere.position );
  }

  function resize(){
    width = window.innerWidth
    height = window.innerHeight
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize( width, height );
  }

  function onInputMove(e){
    e.preventDefault();
    
    var x, y
    if(e.type == "mousemove"){
      x = e.clientX;
      y = e.clientY;
    }else{
      x = e.changedTouches[0].clientX
      y = e.changedTouches[0].clientY
    }
    
    mouse.x = x;
    mouse.y = y;
    
  }

  function render(){
    requestAnimationFrame(render)


    // damping mouse for smoother interaction
    mouse.xDamped = lerp(mouse.xDamped, mouse.x, 0.1);
    mouse.yDamped = lerp(mouse.yDamped, mouse.y, 0.1);

    
    var time = performance.now() * 0.001
    terrain.material.uniforms.time.value = time
    terrain.material.uniforms.scroll.value = time + map(mouse.yDamped, 0, height, 0, 4);
    terrain.material.uniforms.distortCenter.value = Math.sin(time) * 0.1;
    terrain.material.uniforms.roadWidth.value = map(mouse.xDamped, 0, width, 1, 4.5);

    camera.position.y = map(mouse.yDamped, 0, height, 4, 11);

    renderer.render(scene, camera)

  }

  function map (value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1))
  }

  function lerp (start, end, amt){
    return (1 - amt) * start + amt * end
  }
}

const getRandomNumber = (min, max) => (Math.random() * (max - min) + min);