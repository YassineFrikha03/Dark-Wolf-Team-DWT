const fs = require('fs');
const path = require('path');

function getBounds(glbPath) {
  const buf = fs.readFileSync(glbPath);
  const jsonLen = buf.readUInt32LE(12);
  const gltf = JSON.parse(buf.toString('utf8', 20, 20 + jsonLen));
  const binDataOffset = 20 + jsonLen + 8;
  const prim = gltf.meshes[0].primitives[0];
  const posAcc = gltf.accessors[prim.attributes.POSITION];
  const uvAcc = gltf.accessors[prim.attributes.TEXCOORD_0];
  console.log(`\nModel: ${path.basename(glbPath)}`);
  console.log('Position min:', posAcc.min, 'max:', posAcc.max);
  console.log('UV min:', uvAcc.min, 'max:', uvAcc.max);
}

getBounds(path.join(__dirname, '../src/format glb/hoodie.glb'));
getBounds(path.join(__dirname, '../src/format glb/t_shirt.glb'));
