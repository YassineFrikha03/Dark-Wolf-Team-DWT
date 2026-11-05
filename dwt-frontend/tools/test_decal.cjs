const fs = require('fs');
const path = require('path');
const THREE = require('three');
const { GLTFLoader } = require('three/examples/jsm/loaders/GLTFLoader.js');
const { DecalGeometry } = require('three/examples/jsm/geometries/DecalGeometry.js');

// Test decal projection on hoodie.glb
async function test() {
  const glbPath = path.resolve(__dirname, '../src/format glb/hoodie.glb');
  const buf = fs.readFileSync(glbPath);
  const loader = new GLTFLoader();
  
  const gltf = await new Promise((resolve, reject) => {
    loader.parse(buf.buffer, '', resolve, reject);
  });

  console.log('GLTF loaded successfully');
  let targetMesh = null;
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      console.log('Found mesh:', child.name, 'geometry vertices:', child.geometry.attributes.position.count);
      targetMesh = child;
    }
  });

  if (!targetMesh) {
    console.error('No mesh found');
    return;
  }

  // Calculate bounding box of mesh
  targetMesh.geometry.computeBoundingBox();
  const bbox = targetMesh.geometry.boundingBox;
  console.log('BBox min:', bbox.min, 'max:', bbox.max);

  // Position for front chest decal:
  // Center X = 0, Y = bbox.max.y * 0.65, Z = bbox.max.z
  const position = new THREE.Vector3(0, (bbox.min.y + bbox.max.y) * 0.5 + 0.05, bbox.max.z - 0.01);
  const orientation = new THREE.Euler(0, 0, 0);
  const size = new THREE.Vector3(0.25, 0.25, 0.2); // width, height, depth

  console.log('Projecting decal at:', position, 'size:', size);
  const decalGeom = new DecalGeometry(targetMesh, position, orientation, size);
  console.log('Decal generated! Vertex count:', decalGeom.attributes.position.count);
}

test().catch(console.error);
