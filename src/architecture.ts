import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/** Modern Office Building by CN Entertainment, CC BY 4.0. See /credits/. */
export async function loadArchitecture(signal: AbortSignal) {
  const root = document.documentElement.dataset.root ?? import.meta.env.BASE_URL;
  const url = new URL(`${root}models/modern-office.glb`, location.href);
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Architectural model: HTTP ${response.status}`);
  const data = await response.arrayBuffer();
  signal.throwIfAborted();
  const gltf = await new GLTFLoader().parseAsync(data, new URL(".", url).href);
  const group = new THREE.Group();
  group.add(gltf.scene);
  const materials = new Set<THREE.Material>();
  const sourceGround: THREE.Object3D[] = [];
  const glazing = new Set<THREE.MeshStandardMaterial>();
  group.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    const sourceMaterials = Array.isArray(object.material) ? object.material : [object.material];
    if (sourceMaterials.some((material: THREE.Material) => material.name === "Paving"))
      sourceGround.push(object);
    object.castShadow = true;
    object.receiveShadow = true;
    const isArray = Array.isArray(object.material);
    const adapted = (Array.isArray(object.material)
      ? object.material
      : [object.material]
    ).map((material: THREE.Material) => {
      // Reflective glazing avoids the source transmission's extra framebuffer pass.
      if (material.name === "Glass") {
        materials.add(material);
        return new THREE.MeshStandardMaterial({
          name: "LAVA reflective glass",
          color: "#8b9da5",
          metalness: 0.85,
          roughness: 0.12,
          transparent: true,
          opacity: 0.38,
          depthWrite: false,
          side: THREE.DoubleSide,
        });
      }
      if (material instanceof THREE.MeshStandardMaterial) {
        if (material.name === "Behind_Glass") {
          material.color.set("#7891a1");
          material.metalness = 0.4;
          material.roughness = 0.35;
          material.emissive.set("#d49a50");
          glazing.add(material);
        }
        if (material.name === "White") material.roughness = 0.7;
      }
      return material;
    });
    object.material = isArray ? adapted : adapted[0];
  });
  // The source paving extends far beyond the building. Exclude it from framing,
  // while retaining it in the group for complete resource disposal.
  sourceGround.forEach((object) => { object.visible = false; });
  const bounds = new THREE.Box3();
  group.updateMatrixWorld(true);
  group.traverse((object) => {
    if (object instanceof THREE.Mesh && object.visible)
      bounds.union(new THREE.Box3().setFromObject(object));
  });
  const size = bounds.getSize(new THREE.Vector3());
  const center = bounds.getCenter(new THREE.Vector3());
  const scale = 14 / Math.max(size.x, size.z);
  gltf.scene.position.set(-center.x, -bounds.min.y, -center.z);
  group.scale.setScalar(scale);
  function setDay(day: boolean) {
    glazing.forEach((material) => {
      material.emissiveIntensity = day ? 0.01 : 0.08;
    });
  }
  function dispose() {
    const geometries = new Set<THREE.BufferGeometry>();
    const textures = new Set<THREE.Texture>();
    group.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      geometries.add(object.geometry);
      (Array.isArray(object.material) ? object.material : [object.material])
        .forEach((material: THREE.Material) => materials.add(material));
    });
    materials.forEach((material) => {
      Object.values(material).forEach((value: unknown) => {
        if (value instanceof THREE.Texture) textures.add(value);
      });
      material.dispose();
    });
    textures.forEach((texture) => {
      if (typeof ImageBitmap !== "undefined" && texture.image instanceof ImageBitmap)
        texture.image.close();
      texture.dispose();
    });
    geometries.forEach((geometry) => geometry.dispose());
  }
  if (signal.aborted) {
    dispose();
    signal.throwIfAborted();
  }
  setDay(false);
  return { group, setDay, dispose };
}
