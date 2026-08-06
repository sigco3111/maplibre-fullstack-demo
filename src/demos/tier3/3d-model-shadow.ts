import maplibregl from 'maplibre-gl';
import type { Map as MaplibreMap } from 'maplibre-gl';
import * as THREE from 'three';

const STYLE = {
  version: 8 as const,
  sources: {
    osm: {
      type: 'raster' as const,
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [{ id: 'osm', type: 'raster' as const, source: 'osm' }],
};

export function mount(container: HTMLElement, _previous: MaplibreMap): () => void {
  const map = new maplibregl.Map({
    container,
    style: STYLE,
    center: [127, 37.5],
    zoom: 16,
    pitch: 60,
  });

  let renderer: THREE.WebGLRenderer | null = null;
  let scene: THREE.Scene | null = null;
  let cube: THREE.Mesh | null = null;
  let ground: THREE.Mesh | null = null;
  const camera = new THREE.PerspectiveCamera();

  const layer: maplibregl.CustomLayerInterface = {
    id: 'three-shadow',
    type: 'custom' as const,
    renderingMode: '3d' as const,
    onAdd: (m, gl) => {
      renderer = new THREE.WebGLRenderer({ canvas: m.getCanvas(), context: gl, antialias: true });
      renderer!.autoClear = false;
      scene = new THREE.Scene();
      const dir = new THREE.DirectionalLight(0xffffff, 1.0);
      dir.position.set(50, 60, 30);
      dir.castShadow = true;
      dir.shadow.mapSize.width = 1024;
      dir.shadow.mapSize.height = 1024;
      scene.add(dir);
      const amb = new THREE.AmbientLight(0x404040, 0.6);
      scene.add(amb);
      const cubeGeo = new THREE.BoxGeometry(8, 8, 8);
      const cubeMat = new THREE.MeshStandardMaterial({ color: 0xff5050 });
      cube = new THREE.Mesh(cubeGeo, cubeMat);
      cube.position.set(0, 5, 0);
      cube.castShadow = true;
      scene.add(cube);
      const groundGeo = new THREE.PlaneGeometry(40, 40);
      const groundMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
      ground = new THREE.Mesh(groundGeo, groundMat);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = 0;
      ground.receiveShadow = true;
      scene.add(ground);
    },
    render: () => {
      if (!renderer || !scene) return;
      const rot = (Date.now() / 100) % 360;
      if (cube) cube.rotation.y = (rot * Math.PI) / 180;
      renderer.resetState();
      renderer.render(scene, camera);
      map.triggerRepaint();
    },
  };

  map.on('load', () => {
    if (map.getLayer('three-shadow')) return;
    map.addLayer(layer as unknown as maplibregl.LayerSpecification);
  });

  return () => {
    if (cube) { scene?.remove(cube); cube.geometry.dispose(); (cube.material as THREE.Material).dispose(); }
    if (ground) { scene?.remove(ground); ground.geometry.dispose(); (ground.material as THREE.Material).dispose(); }
    renderer?.dispose();
    if (map.getLayer('three-shadow')) map.removeLayer('three-shadow');
    map.remove();
  };
}
