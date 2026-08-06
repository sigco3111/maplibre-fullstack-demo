import maplibregl from 'maplibre-gl';
import type { Map as MaplibreMap } from 'maplibre-gl';
import * as THREE from 'three';
import { applyDemo } from '../../core/demoEngine';

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

export function mount(_container: HTMLElement, map: MaplibreMap): () => void {
  return applyDemo(map, {
    style: STYLE,
    center: [0, 0],
    zoom: 0,
    onLoad: (m) => {
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      camera.position.set(0, 0, 0.1);
      const refs: { renderer: THREE.WebGLRenderer | null; scene: THREE.Scene | null; sphere: THREE.Mesh | null } = { renderer: null, scene: null, sphere: null };
      const layerId = 'photosphere';
      const layer: maplibregl.CustomLayerInterface = {
        id: layerId,
        type: 'custom' as const,
        renderingMode: '3d' as const,
        onAdd: (mm, gl) => {
          const renderer = new THREE.WebGLRenderer({ canvas: mm.getCanvas(), context: gl, antialias: true });
          (renderer as unknown as { autoClear: boolean }).autoClear = false;
          const scene = new THREE.Scene();
          const tex = new THREE.CanvasTexture(generateGradientTexture());
          const geo = new THREE.SphereGeometry(500, 60, 40);
          const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide });
          const sphere = new THREE.Mesh(geo, mat);
          scene.add(sphere);
          refs.renderer = renderer;
          refs.scene = scene;
          refs.sphere = sphere;
        },
        render: () => {
          if (!refs.renderer || !refs.scene || !refs.sphere) return;
          const rot = (Date.now() / 100) % 360;
          refs.sphere.rotation.y = (rot * Math.PI) / 180;
          refs.renderer.resetState();
          refs.renderer.render(refs.scene, camera);
          map.triggerRepaint();
        },
      };
      m.addLayer(layer as unknown as maplibregl.LayerSpecification);
      return () => {
        if (m.getLayer(layerId)) m.removeLayer(layerId);
      };
    },
  });
}
