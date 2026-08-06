import maplibregl from 'maplibre-gl';
import type { Map as MaplibreMap } from 'maplibre-gl';
import * as THREE from 'three';
import { applyDemo } from '../../core/demoEngine';

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

export function mount(_container: HTMLElement, map: MaplibreMap): () => void {
  return applyDemo(map, {
    style: STYLE,
    center: [127, 37.5],
    zoom: 14,
    pitch: 60,
    onLoad: (m) => {
      const camera = new THREE.PerspectiveCamera();
      const layerId = 'three-cube';
      const layer: maplibregl.CustomLayerInterface = {
        id: layerId,
        type: 'custom' as const,
        renderingMode: '3d' as const,
        onAdd: (mm, gl) => {
          const renderer = new THREE.WebGLRenderer({ canvas: mm.getCanvas(), context: gl, antialias: true });
          (renderer as unknown as { autoClear: boolean }).autoClear = false;
          const scene = new THREE.Scene();
          const light = new THREE.DirectionalLight(0xffffff, 1.0);
          light.position.set(0, -70, 100).normalize();
          scene.add(light);
          const geo = new THREE.BoxGeometry(20, 20, 20);
          const mat = new THREE.MeshStandardMaterial({ color: 0xff5050 });
          const cube = new THREE.Mesh(geo, mat);
          scene.add(cube);
          (layer as unknown as { _renderer: THREE.WebGLRenderer; _scene: THREE.Scene; _cube: THREE.Mesh })._renderer = renderer;
          (layer as unknown as { _renderer: THREE.WebGLRenderer; _scene: THREE.Scene; _cube: THREE.Mesh })._scene = scene;
          (layer as unknown as { _renderer: THREE.WebGLRenderer; _scene: THREE.Scene; _cube: THREE.Mesh })._cube = cube;
          const renderFn = (): void => {
            const r = (layer as unknown as { _renderer: THREE.WebGLRenderer })._renderer;
            const s = (layer as unknown as { _scene: THREE.Scene })._scene;
            const c = (layer as unknown as { _cube: THREE.Mesh })._cube;
            if (!r || !s || !c) return;
            const rot = (Date.now() / 100) % 360;
            c.rotation.set((rot * Math.PI) / 180, (rot * Math.PI) / 90, 0);
            r.resetState();
            r.render(s, camera);
            mm.triggerRepaint();
          };
          (layer as unknown as { render: (gl: WebGLRenderingContext, matrix: number[]) => void }).render = renderFn;
        },
        render: () => {},
      };
      m.addLayer(layer as unknown as maplibregl.LayerSpecification);
      return () => {
        if (m.getLayer(layerId)) m.removeLayer(layerId);
      };
    },
  });
}
