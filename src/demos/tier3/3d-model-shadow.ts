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
    zoom: 16,
    pitch: 60,
    onLoad: (m) => {
      const camera = new THREE.PerspectiveCamera();
      const layerId = 'three-shadow';
      const refs: { renderer: THREE.WebGLRenderer | null; scene: THREE.Scene | null; cube: THREE.Mesh | null; ground: THREE.Mesh | null } = {
        renderer: null, scene: null, cube: null, ground: null,
      };
      const layer: maplibregl.CustomLayerInterface = {
        id: layerId,
        type: 'custom' as const,
        renderingMode: '3d' as const,
        onAdd: (mm, gl) => {
          const renderer = new THREE.WebGLRenderer({ canvas: mm.getCanvas(), context: gl, antialias: true });
          (renderer as unknown as { autoClear: boolean }).autoClear = false;
          const scene = new THREE.Scene();
          const dir = new THREE.DirectionalLight(0xffffff, 1.0);
          dir.position.set(50, 60, 30);
          (dir as unknown as { castShadow: boolean }).castShadow = true;
          (dir as unknown as { shadow: { mapSize: { width: number; height: number } } }).shadow.mapSize.width = 1024;
          (dir as unknown as { shadow: { mapSize: { width: number; height: number } } }).shadow.mapSize.height = 1024;
          scene.add(dir);
          const amb = new THREE.AmbientLight(0x404040, 0.6);
          scene.add(amb);
          const cubeGeo = new THREE.BoxGeometry(8, 8, 8);
          const cubeMat = new THREE.MeshStandardMaterial({ color: 0xff5050 });
          const cube = new THREE.Mesh(cubeGeo, cubeMat);
          cube.position.set(0, 5, 0);
          (cube as unknown as { castShadow: boolean }).castShadow = true;
          scene.add(cube);
          const groundGeo = new THREE.PlaneGeometry(40, 40);
          const groundMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
          const ground = new THREE.Mesh(groundGeo, groundMat);
          ground.rotation.x = -Math.PI / 2;
          ground.position.y = 0;
          (ground as unknown as { receiveShadow: boolean }).receiveShadow = true;
          scene.add(ground);
          refs.renderer = renderer;
          refs.scene = scene;
          refs.cube = cube;
          refs.ground = ground;
        },
        render: () => {
          if (!refs.renderer || !refs.scene || !refs.cube) return;
          const rot = (Date.now() / 100) % 360;
          (refs.cube as THREE.Mesh).rotation.y = (rot * Math.PI) / 180;
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
