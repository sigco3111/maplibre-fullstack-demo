import type { Map as MaplibreMap } from 'maplibre-gl';
import * as THREE from 'three';

const STYLE = {
  version: 8 as const,
  sources: {},
  layers: [],
};

function generateGradientTexture(): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext('2d')!;
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#001a4d');
  grad.addColorStop(0.4, '#3088ff');
  grad.addColorStop(0.6, '#88ccff');
  grad.addColorStop(1, '#ffaa00');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);
  return c;
}

export function mount(container: HTMLElement, _previous: MaplibreMap): () => void {
  const map = new (window as unknown as { maplibregl: typeof import('maplibre-gl') }).maplibregl.Map({
    container,
    style: STYLE,
    center: [0, 0],
    zoom: 0,
  });

  let renderer: THREE.WebGLRenderer | null = null;
  let scene: THREE.Scene | null = null;
  let sphere: THREE.Mesh | null = null;
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

  const layer: maplibregl.CustomLayerInterface = {
    id: 'photosphere',
    type: 'custom' as const,
    renderingMode: '3d' as const,
    onAdd: (m, gl) => {
      renderer = new THREE.WebGLRenderer({ canvas: m.getCanvas(), context: gl, antialias: true });
      renderer!.autoClear = false;
      scene = new THREE.Scene();
      const tex = new THREE.CanvasTexture(generateGradientTexture());
      const geo = new THREE.SphereGeometry(500, 60, 40);
      const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide });
      sphere = new THREE.Mesh(geo, mat);
      scene.add(sphere);
      camera.position.set(0, 0, 0.1);
    },
    render: () => {
      if (!renderer || !scene || !sphere) return;
      const rot = (Date.now() / 100) % 360;
      sphere.rotation.y = (rot * Math.PI) / 180;
      renderer.resetState();
      renderer.render(scene, camera);
      map.triggerRepaint();
    },
  };

  map.on('load', () => {
    if (map.getLayer('photosphere')) return;
    map.addLayer(layer as unknown as maplibregl.LayerSpecification);
  });

  return () => {
    if (sphere) { scene?.remove(sphere); sphere.geometry.dispose(); (sphere.material as THREE.Material).dispose(); }
    renderer?.dispose();
    if (map.getLayer('photosphere')) map.removeLayer('photosphere');
    map.remove();
  };
}
