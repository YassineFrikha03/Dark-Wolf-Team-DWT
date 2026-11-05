const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

function analyzeAndDrawUV(glbPath, outPngPath, width = 2048, height = 2048) {
  const buf = fs.readFileSync(glbPath);
  const jsonLen = buf.readUInt32LE(12);
  const jsonStr = buf.toString('utf8', 20, 20 + jsonLen);
  const gltf = JSON.parse(jsonStr);

  const binHeaderOffset = 20 + jsonLen;
  const binDataOffset = binHeaderOffset + 8;

  console.log(`\n=== Analyse UV de : ${path.basename(glbPath)} ===`);

  // Find primitive accessors
  const mesh = gltf.meshes[0];
  const prim = mesh.primitives[0];
  const posAcc = gltf.accessors[prim.attributes.POSITION];
  const uvAcc = gltf.accessors[prim.attributes.TEXCOORD_0];
  const idxAcc = gltf.accessors[prim.indices];

  console.log(`Primitive: ${prim.attributes.POSITION !== undefined ? 'POS ' : ''}${prim.attributes.NORMAL !== undefined ? 'NORM ' : ''}${prim.attributes.TEXCOORD_0 !== undefined ? 'UV ' : ''} (Indices: ${idxAcc.count})`);

  // Read bufferViews
  function getAccessorData(acc) {
    const bv = gltf.bufferViews[acc.bufferView];
    const offset = binDataOffset + (bv.byteOffset || 0) + (acc.byteOffset || 0);
    return { offset, count: acc.count, componentType: acc.componentType, type: acc.type };
  }

  const uvData = getAccessorData(uvAcc);
  const idxData = getAccessorData(idxAcc);
  const posData = getAccessorData(posAcc);

  const uvs = [];
  for (let i = 0; i < uvData.count; i++) {
    const o = uvData.offset + i * 8;
    const u = buf.readFloatLE(o);
    const v = buf.readFloatLE(o + 4);
    uvs.push([u, v]);
  }

  const positions = [];
  for (let i = 0; i < posData.count; i++) {
    const o = posData.offset + i * 12;
    const x = buf.readFloatLE(o);
    const y = buf.readFloatLE(o + 4);
    const z = buf.readFloatLE(o + 8);
    positions.push([x, y, z]);
  }

  const indices = [];
  const isU32 = idxData.componentType === 5125;
  const stride = isU32 ? 4 : 2;
  for (let i = 0; i < idxData.count; i++) {
    const o = idxData.offset + i * stride;
    const idx = isU32 ? buf.readUInt32LE(o) : buf.readUInt16LE(o);
    indices.push(idx);
  }

  let minU = Infinity, maxU = -Infinity, minV = Infinity, maxV = -Infinity;
  for (const [u, v] of uvs) {
    if (u < minU) minU = u;
    if (u > maxU) maxU = u;
    if (v < minV) minV = v;
    if (v > maxV) maxV = v;
  }
  console.log(`Plage UV: U [${minU.toFixed(3)}, ${maxU.toFixed(3)}], V [${minV.toFixed(3)}, ${maxV.toFixed(3)}]`);

  // Analyse de l'orientation UV pour détecter les miroirs (test d'inversion)
  let mirroredTriangles = 0;
  let regularTriangles = 0;
  const triCount = indices.length / 3;

  for (let t = 0; t < triCount; t++) {
    const i0 = indices[t * 3];
    const i1 = indices[t * 3 + 1];
    const i2 = indices[t * 3 + 2];

    const u0 = uvs[i0][0], v0 = uvs[i0][1];
    const u1 = uvs[i1][0], v1 = uvs[i1][1];
    const u2 = uvs[i2][0], v2 = uvs[i2][1];

    // 2D cross product in UV space
    const uvCross = (u1 - u0) * (v2 - v0) - (v1 - v0) * (u2 - u0);

    // 3D normal estimate
    const p0 = positions[i0], p1 = positions[i1], p2 = positions[i2];
    const d1x = p1[0] - p0[0], d1y = p1[1] - p0[1], d1z = p1[2] - p0[2];
    const d2x = p2[0] - p0[0], d2y = p2[1] - p0[1], d2z = p2[2] - p0[2];
    // Z component of normal (facing front vs facing back)
    const nz = d1x * d2y - d1y * d2x;

    if (nz > 0) { // Face avant
      if (uvCross < 0) mirroredTriangles++;
      else regularTriangles++;
    }
  }

  console.log(`Face avant : ${regularTriangles} triangles réguliers vs ${mirroredTriangles} triangles inversés`);
  if (mirroredTriangles > regularTriangles * 0.1) {
    console.warn(`ATTENTION : Détection d'îlots UV inversés/miroir sur la face avant ! Explication directe du texte en miroir "WOOD" !`);
  } else {
    console.log(`Orientation des UV face avant : Standard (non-miroir).`);
  }

  // Tracer le wireframe UV vers SVG puis PNG
  console.log(`Génération du rendu wireframe UV vers ${outPngPath}...`);
  let svgPaths = [];
  const rangeU = maxU - minU || 1;
  const rangeV = maxV - minV || 1;
  const step = Math.max(1, Math.floor(triCount / 20000));
  for (let t = 0; t < triCount; t += step) {
    const i0 = indices[t * 3];
    const i1 = indices[t * 3 + 1];
    const i2 = indices[t * 3 + 2];

    const x0 = (((uvs[i0][0] - minU) / rangeU) * (width - 80) + 40).toFixed(1);
    const y0 = ((1 - ((uvs[i0][1] - minV) / rangeV)) * (height - 180) + 140).toFixed(1);
    const x1 = (((uvs[i1][0] - minU) / rangeU) * (width - 80) + 40).toFixed(1);
    const y1 = ((1 - ((uvs[i1][1] - minV) / rangeV)) * (height - 180) + 140).toFixed(1);
    const x2 = (((uvs[i2][0] - minU) / rangeU) * (width - 80) + 40).toFixed(1);
    const y2 = ((1 - ((uvs[i2][1]) - minV) / rangeV) * (height - 180) + 140).toFixed(1);

    svgPaths.push(`M${x0},${y0}L${x1},${y1}L${x2},${y2}Z`);
  }

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="${width}" height="${height}" fill="#0a0b0e" />
      <g stroke="rgba(225, 6, 19, 0.45)" stroke-width="0.75" fill="rgba(255, 255, 255, 0.04)">
        <path d="${svgPaths.join(' ')}" />
      </g>
      <text x="40" y="60" fill="#f5f6f8" font-family="monospace" font-size="28" font-weight="bold">
        DARK WOLF TEAM - CARTE UV OFFICIELLE (${path.basename(glbPath)})
      </text>
      <text x="40" y="100" fill="#e10613" font-family="monospace" font-size="20">
        Résolution: ${width}x${height} | Triangles: ${triCount}
      </text>
    </svg>
  `;

  return sharp(Buffer.from(svgContent))
    .png()
    .toFile(outPngPath);
}

async function run() {
  const hoodieInput = path.join(__dirname, '..', 'src', 'format glb', 'hoodie.glb');
  const hoodiePng = path.join(__dirname, '..', 'public', 'models', 'hoodie_uv_map.png');
  await analyzeAndDrawUV(hoodieInput, hoodiePng);

  console.log(`Carte UV hoodie enregistrée avec succès : ${hoodiePng}`);
}

run().catch(console.error);
