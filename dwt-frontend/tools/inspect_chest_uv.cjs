const fs = require('fs');
const path = require('path');

function inspectChestUV(glbPath) {
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

  let frontChestU = [];
  let frontChestV = [];

  for (let i = 0; i < posData.count; i++) {
    const po = posData.offset + i * 12;
    const x = buf.readFloatLE(po);
    const y = buf.readFloatLE(po + 4);
    const z = buf.readFloatLE(po + 8);

    const uo = uvData.offset + i * 8;
    const u = buf.readFloatLE(uo);
    const v = buf.readFloatLE(uo + 4);

    if (Math.abs(x) < 12 && y > 30 && y < 45 && z > 5) {
      frontChestU.push(u);
      frontChestV.push(v);
    }
  }

  const minU = Math.min(...frontChestU);
  const maxU = Math.max(...frontChestU);
  const minV = Math.min(...frontChestV);
  const maxV = Math.max(...frontChestV);
  const avg = arr => (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(3);

  console.log(`\nFront chest vertices: ${frontChestU.length}`);
  console.log(`U: [${minU.toFixed(3)}, ${maxU.toFixed(3)}] avg: ${avg(frontChestU)}`);
  console.log(`V: [${minV.toFixed(3)}, ${maxV.toFixed(3)}] avg: ${avg(frontChestV)}`);
  console.log(`U mod 1: ${(avg(frontChestU) % 1.0).toFixed(3)}, V mod 1: ${(avg(frontChestV) % 1.0).toFixed(3)}`);
}

inspectChestUV(path.join(__dirname, '../src/format glb/hoodie.glb'));
