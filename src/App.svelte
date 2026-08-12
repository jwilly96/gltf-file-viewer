<script>
  import './app.css';
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
  import Toolbar from './lib/Toolbar.svelte';
  import SidePanel from './lib/SidePanel.svelte';

  const sampleModelGlob = import.meta.glob('./assets/sample-models/*.glb', { as: 'url', eager: true });
  const sampleModels = Object.entries(sampleModelGlob).map(([path, url]) => ({
    name: path.split('/').pop().replace(/\.glb$/i, '').replace(/[_-]/g, ' '),
    url,
  }));

  let canvas;
  let renderer, scene, camera, controls, animFrameId;
  let modelLoaded = $state(false);

  let panelOpen = $state(true);
  let wireframe = $state(false);
  let vertexColors = $state(false);
  let bgColor = $state('#1a1a2e');
  let autoRotate = $state(false);
  let rotateSpeed = $state(1.0);

  function onBgColorChange() {
    if (scene) scene.background = new THREE.Color(bgColor);
  }

  let stats = $state({ verts: 0, faces: 0, textures: [] });

  // Stored original materials keyed by mesh uuid
  let originalMaterials = new Map();

  function applyWireframe(val) {
    scene?.traverse(obj => {
      if (obj.isMesh) obj.material.wireframe = val;
    });
  }

  function applyVertexColors(val) {
    scene?.traverse(obj => {
      if (!obj.isMesh) return;
      if (val) {
        if (!originalMaterials.has(obj.uuid)) originalMaterials.set(obj.uuid, obj.material);
        obj.material = new THREE.MeshBasicMaterial({
          vertexColors: true,
          wireframe: wireframe,
        });
      } else {
        const orig = originalMaterials.get(obj.uuid);
        if (orig) {
          orig.wireframe = wireframe;
          obj.material = orig;
        }
      }
    });
  }

  function onWireframeChange() {
    applyWireframe(wireframe);
  }

  function onVertexColorsChange() {
    applyVertexColors(vertexColors);
  }

  onMount(() => {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    // false = don't stamp inline width/height styles; CSS controls canvas size
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(bgColor);

    camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.01, 1000);
    camera.position.set(0, 1, 3);

    controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 2);
    dir.position.set(5, 10, 7);
    scene.add(dir);

    const resize = () => {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    };
    window.addEventListener('resize', resize);

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      if (autoRotate) {
        scene.children
          .filter(c => c.userData.isModel)
          .forEach(c => { c.rotation.y += 0.005 * rotateSpeed; });
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => window.removeEventListener('resize', resize);
  });

  onDestroy(() => {
    cancelAnimationFrame(animFrameId);
    renderer?.dispose();
  });

  function collectStats(model) {
    let verts = 0, faces = 0;
    const texSet = new Set();
    model.traverse(obj => {
      if (!obj.isMesh) return;
      const geo = obj.geometry;
      verts += geo.attributes.position?.count ?? 0;
      faces += geo.index ? geo.index.count / 3 : (geo.attributes.position?.count ?? 0) / 3;
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach(m => {
        ['map','normalMap','roughnessMap','metalnessMap','emissiveMap','aoMap'].forEach(slot => {
          if (m[slot]?.image) texSet.add(m[slot].uuid);
        });
      });
    });
    stats = {
      verts: Math.round(verts),
      faces: Math.round(faces),
      textures: [...texSet],
    };
  }

  function loadFromUrl(url, revoke = false) {
    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
      scene.children
        .filter(c => c.userData.isModel)
        .forEach(c => scene.remove(c));

      originalMaterials.clear();
      wireframe = false;
      vertexColors = false;

      const model = gltf.scene;
      model.userData.isModel = true;

      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3()).length();
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);
      camera.position.set(0, size * 0.4, size * 1.2);
      camera.near = size * 0.001;
      camera.far = size * 100;
      camera.updateProjectionMatrix();
      controls.maxDistance = size * 10;
      controls.update();

      scene.add(model);
      modelLoaded = true;
      collectStats(model);
      if (revoke) URL.revokeObjectURL(url);
    });
  }

  function loadGLB(file) {
    loadFromUrl(URL.createObjectURL(file), true);
  }

  function onFileChange(e) {
    const file = e.target.files[0];
    if (file) loadGLB(file);
  }

  function onSampleLoad(url) {
    loadFromUrl(url);
  }
</script>

<div class="container">
  <Toolbar {modelLoaded} {onFileChange} {sampleModels} {onSampleLoad} />

  <div class="viewport">
    <SidePanel
      bind:panelOpen
      bind:wireframe
      bind:vertexColors
      bind:bgColor
      bind:autoRotate
      bind:rotateSpeed
      {modelLoaded}
      {stats}
      {onWireframeChange}
      {onVertexColorsChange}
      {onBgColorChange}
    />
    <canvas bind:this={canvas}></canvas>
  </div>
</div>

<style>
  :global(html),
  :global(body),
  :global(#app) {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  :global(body) {
    font-family: var(--sans);
  }

  .container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

  .viewport {
    position: relative;
    flex: 1;
    display: flex;
    overflow: hidden;
  }

  canvas {
    flex: 1;
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
