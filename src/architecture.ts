import * as THREE from "three";

/** Original six-level concept. Batched boxes keep the facade under a few draw calls. */
export function createArchitecture() {
  const group = new THREE.Group();
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = 256;
  textureCanvas.height = 256;
  const context = textureCanvas.getContext("2d");
  if (context) {
    const image = context.createImageData(256, 256);
    for (let i = 0; i < image.data.length; i += 4) {
      const shade = 152 + Math.sin(i * 12.9898) * 12;
      image.data[i] = shade;
      image.data[i + 1] = shade;
      image.data[i + 2] = shade;
      image.data[i + 3] = 255;
    }
    context.putImageData(image, 0, 0);
  }
  const concreteTexture = new THREE.CanvasTexture(textureCanvas);
  concreteTexture.wrapS = concreteTexture.wrapT = THREE.RepeatWrapping;
  concreteTexture.repeat.set(6, 2);
  const concrete = new THREE.MeshStandardMaterial({
    color: "#6b7479",
    roughness: 0.82,
    metalness: 0.04,
    bumpMap: concreteTexture,
    bumpScale: 0.015,
  });
  const bronze = new THREE.MeshStandardMaterial({
    color: "#604b35",
    roughness: 0.36,
    metalness: 0.72,
  });
  const glass = new THREE.MeshStandardMaterial({
    color: "#25333b",
    roughness: 0.22,
    metalness: 0.55,
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
  });
  const warm = new THREE.MeshStandardMaterial({
    color: "#624a32",
    roughness: 0.56,
    emissive: "#eab16b",
    emissiveIntensity: 0.48,
  });
  const dark = new THREE.MeshStandardMaterial({
    color: "#1c2428",
    roughness: 0.72,
  });
  const greenery = new THREE.MeshStandardMaterial({
    color: "#283c2b",
    roughness: 1,
  });
  const light = new THREE.MeshBasicMaterial({
    color: "#f2cc8f",
    toneMapped: false,
  });
  type Box = {
    position: [number, number, number];
    scale: [number, number, number];
  };
  const batches = new Map<THREE.Material, Box[]>();
  const box = (
    material: THREE.Material,
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
  ) => {
    if (!batches.has(material)) batches.set(material, []);
    batches.get(material)?.push({ position: [x, y, z], scale: [w, h, d] });
  };
  // Podium, approach, stairs and a reflecting pool edge.
  box(concrete, 0, 0.06, 0, 16, 0.2, 10);
  box(dark, 0, -0.12, 0, 16.4, 0.16, 10.4);
  for (let step = 0; step < 4; step++)
    box(concrete, -1, -0.02 - step * 0.06, 5.15 + step * 0.2, 5, 0.1, 0.4);
  // A lifted base and exposed structural columns.
  box(glass, 0, 0.72, -0.1, 10.6, 1.2, 5.2);
  box(warm, 0, 0.7, -1.7, 10.4, 1.1, 0.12);
  for (let x = -5.6; x <= 5.6; x += 1.4) {
    box(bronze, x, 0.72, 2.8, 0.12, 1.3, 0.12);
    box(bronze, x, 0.72, -2.8, 0.12, 1.3, 0.12);
  }
  const levels = 6;
  for (let level = 0; level < levels; level++) {
    const y = 1.4 + level * 0.77;
    const width = 13.2 - level * 0.68;
    const depth = 7.4 - level * 0.38;
    const x = level * 0.35 - 0.8;
    const z = -level * 0.18;
    box(concrete, x, y, z, width, 0.19, depth);
    box(dark, x, y + 0.14, z, width - 0.38, 0.08, depth - 0.38);
    box(glass, x, y + 0.46, z, width - 1.05, 0.58, depth - 1.08);
    box(warm, x, y + 0.45, z + depth / 2 - 0.65, width - 1.2, 0.52, 0.1);
    box(warm, x + width / 2 - 0.65, y + 0.45, z, 0.1, 0.52, depth - 1.2);
    box(light, x, y - 0.11, z + depth / 2 + 0.01, width - 0.3, 0.025, 0.025);
    // Fine mullion rhythm on all facades. Material instancing avoids individual meshes.
    for (let u = -width / 2 + 0.6; u < width / 2 - 0.4; u += 0.23) {
      box(bronze, x + u, y + 0.47, z + depth / 2 - 0.46, 0.035, 0.63, 0.28);
      box(bronze, x + u, y + 0.47, z - depth / 2 + 0.46, 0.035, 0.63, 0.28);
    }
    for (let v = -depth / 2 + 0.7; v < depth / 2 - 0.5; v += 0.23) {
      box(bronze, x + width / 2 - 0.46, y + 0.47, z + v, 0.28, 0.63, 0.035);
      box(bronze, x - width / 2 + 0.46, y + 0.47, z + v, 0.28, 0.63, 0.035);
    }
    // Planter strips on the recessed terrace, broken to retain a quiet silhouette.
    if (level > 0) {
      box(dark, x - width / 2 + 0.24, y + 0.28, z, 0.18, 0.18, depth * 0.62);
      box(greenery, x - width / 2 + 0.24, y + 0.42, z, 0.24, 0.22, depth * 0.6);
      box(
        dark,
        x + width * 0.2,
        y + 0.26,
        z + depth / 2 - 0.2,
        width * 0.28,
        0.16,
        0.2,
      );
      box(
        greenery,
        x + width * 0.2,
        y + 0.39,
        z + depth / 2 - 0.2,
        width * 0.28,
        0.2,
        0.26,
      );
    }
  }
  const roofY = 1.4 + levels * 0.77;
  box(concrete, 0.6, roofY, -0.9, 9.3, 0.16, 5.3);
  box(dark, 0.6, roofY + 0.1, -0.9, 8.8, 0.1, 4.8);
  // Ground-level planted islands and simple sculptural trees.
  for (const [x, z] of [
    [-6.8, 3.6],
    [6.9, -3.7],
    [-6.7, -3.7],
    [6.8, 3.5],
  ]) {
    box(dark, x, 0.23, z, 1.2, 0.2, 1.2);
    box(greenery, x, 0.42, z, 1.05, 0.3, 1.05);
    box(bronze, x, 0.9, z, 0.07, 1.0, 0.07);
    const leafGeometry = new THREE.SphereGeometry(0.42, 12, 8);
    for (let leaf = 0; leaf < 5; leaf++) {
      const crown = new THREE.Mesh(leafGeometry, greenery);
      const angle = leaf * 2.4;
      crown.position.set(
        x + Math.cos(angle) * 0.22,
        1.3 + leaf * 0.12,
        z + Math.sin(angle) * 0.22,
      );
      crown.scale.set(1, 0.85 + leaf * 0.08, 1);
      crown.castShadow = true;
      group.add(crown);
    }
  }
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const matrix = new THREE.Matrix4();
  const position = new THREE.Vector3();
  const scale = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  for (const [material, boxes] of batches) {
    const mesh = new THREE.InstancedMesh(geometry, material, boxes.length);
    boxes.forEach((b, i) => {
      matrix.compose(
        position.fromArray(b.position),
        quaternion,
        scale.fromArray(b.scale),
      );
      mesh.setMatrixAt(i, matrix);
    });
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  }
  return { group, warm, light, concreteTexture };
}
