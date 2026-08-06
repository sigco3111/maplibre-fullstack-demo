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
  const map = new (window as unknown as { maplibregl: typeof import('maplibre-gl') }).maplibregl.Map({
    container,
    style: STYLE,
    center: [127, 37.5],
    zoom: 14,
    pitch: 60,
  });

  let renderer: THREE.WebGLRenderer | null = null;
  let scene: THREE.Scene | null = null;
  let cube: THREE.Mesh | null = null;
  const camera = new THREE.PerspectiveCamera();
  const transform = { translateX: 0, translateY: 0, translateZ: 0, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1 };

  const layer: maplibregl.CustomLayerInterface = {
    id: 'three-cube',
    type: 'custom' as const,
    renderingMode: '3d' as const,
    onAdd: (m, gl) => {
      renderer = new THREE.WebGLRenderer({ canvas: m.getCanvas(), context: gl, antialias: true });
      renderer!.autoClear = false;
      scene = new THREE.Scene();
      const light = new THREE.DirectionalLight(0xffffff, 1.0);
      light.position.set(0, -70, 100).normalize();
      scene.add(light);
      const geo = new THREE.BoxGeometry(20, 20, 20);
      const mat = new THREE.MeshStandardMaterial({ color: 0xff5050 });
      cube = new THREE.Mesh(geo, mat);
      scene.add(cube);
    },
    render: (_gl, _matrix) => {
      if (!renderer || !scene || !cube) return;
      const rot = (Date.now() / 100) % 360;
      cube.rotation.set((rot * Math.PI) / 180, (rot * Math.PI) / 90, 0);
      const m = new THREE.Matrix4();
      m.makeTranslation(transform.translateX, transform.translateY, transform.translateZ);
      m.scale(new THREE.Vector3(transform.scale, transform.scale, transform.scale));
      m.setPosition(0, 0, 0);
      camera.projectionMatrix.copy(m);
      renderer.resetState();
      renderer.render(scene, camera);
      map.triggerRepaint();
    },
  };

  map.on('load', () => {
    if (map.getLayer('three-cube')) return;
    map.addLayer(layer as unknown as maplibregl.LayerSpecification);
  });

  return () => {
    if (cube) { scene?.remove(cube); cube.geometry.dispose(); (cube.material as THREE.Material).dispose(); }
    renderer?.dispose();
    if (map.getLayer('three-cube')) map.removeLayer('three-cube');
    map.remove();
  };
}
