const fs = require('fs');
const path = require('path');

function testMirror(glbPath) {
  const buf = fs.readFileSync(glbPath);
  const jsonLen = buf.readUInt32LE(12);
  const gltf = JSON.parse(buf.toString('utf8', 20, 20 + jsonLen));
  const binDataOffset = 20 + jsonLen + 8;

  const mesh = gltf.meshes[0];
  const prim = mesh.primitives[0];
  const posAcc = gltf.accessors[prim.attributes.POSITION];
  const uvAcc = gltf.accessors[prim.attributes.TEXCOORD_0];

  function getAccessorData(acc) {
    const bv = gltf.bufferViews[acc.bufferView];
    const offset = binDataOffset + (bv.byteOffset || 0) + (acc.byteOffset || 0);
    return { offset, count: acc.count };
  }

  const uvData = getAccessorData(uvAcc);
  const posData = getAccessorData(posAcc);

  let leftPts = [];  // x > 5
  let rightPts = []; // x < -5

  for (let i = 0; i < posData.count; i++) {
    const po = posData.offset + i * 12;
    const x = buf.readFloatLE(po);
    const y = buf.readFloatLE(po + 4);
    const z = buf.readFloatLE(po + 8);

    const uo = uvData.offset + i * 8;
    const u = buf.readFloatLE(uo);

    if (y > 30 && y < 45 && z > 5) {
      if (x > 5) leftPts.push(u % 1.0 < 0 ? (u % 1.0) + 1.0 : u % 1.0);
      if (x < -5) rightPts.push(u % 1.0 < 0 ? (u % 1.0) + 1.0 : u % 1.0);
    }
  }

  const avg = arr => (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(3);
  console.log(`x > 5 (user's right, model's left): U avg = ${avg(leftPts)}`);
  console.log(`x < -5 (user's left, model's right): U avg = ${avg(rightPts)}`);
}

testMirror(path.join(__dirname, '../src/format glb/hoodie.glb'));
