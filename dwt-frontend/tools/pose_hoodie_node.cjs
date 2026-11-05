const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '..', 'src', 'format glb', 'hoodie.glb');
const outputPath = path.join(__dirname, '..', 'public', 'models', 'hoodie_posed.glb');

console.log('Loading hoodie from:', inputPath);
const buf = Buffer.from(fs.readFileSync(inputPath));

// Read glTF header
const magic = buf.readUInt32LE(0);
const version = buf.readUInt32LE(4);
const totalLength = buf.readUInt32LE(8);

// Read Chunk 0: JSON
const jsonLen = buf.readUInt32LE(12);
const jsonType = buf.readUInt32LE(16);
const jsonStr = buf.toString('utf8', 20, 20 + jsonLen);
const gltf = JSON.parse(jsonStr);

// Binary chunk offset
const binHeaderOffset = 20 + jsonLen;
const binLen = buf.readUInt32LE(binHeaderOffset);
const binDataOffset = binHeaderOffset + 8;

console.log(`GLTF v${version}, JSON length: ${jsonLen}, BIN length: ${binLen}`);

// Accessors:
// 0: POSITION (bufferView 2, offset 0, count 21290)
// 1: NORMAL   (bufferView 2, offset 255480, count 21290)
// 2: TEXCOORD_0 (bufferView 1, offset 413904, count 21290)
// 3: INDICES  (bufferView 0, offset 0, count 103476)

const posByteOffset = binDataOffset + gltf.bufferViews[2].byteOffset + (gltf.accessors[0].byteOffset || 0);
const normByteOffset = binDataOffset + gltf.bufferViews[2].byteOffset + (gltf.accessors[1].byteOffset || 0);
const vertexCount = gltf.accessors[0].count;

console.log(`Processing ${vertexCount} vertices...`);

// Pivot points for shoulders
// Torso width at shoulder level is roughly [-18.5, +18.5], Y ~ 47.0
const PIVOT_Y = 47.0;
const PIVOT_Z = -1.3;
const PIVOT_X_LEFT = -18.0;
const PIVOT_X_RIGHT = 18.0;

// Transition zone width across shoulder joint
const TRANS_INNER = 16.0; // Torso stays completely rigid
const TRANS_OUTER = 22.0; // Fully rotated beyond this

// Rotation angle: ~20 degrees inward (closer to body)
const ROT_ANGLE = 20.0 * (Math.PI / 180.0);

let minX = Infinity, maxX = -Infinity;
let minY = Infinity, maxY = -Infinity;
let minZ = Infinity, maxZ = -Infinity;

for (let i = 0; i < vertexCount; i++) {
  const pOff = posByteOffset + i * 12;
  const nOff = normByteOffset + i * 12;

  let x = buf.readFloatLE(pOff);
  let y = buf.readFloatLE(pOff + 4);
  let z = buf.readFloatLE(pOff + 8);

  let nx = buf.readFloatLE(nOff);
  let ny = buf.readFloatLE(nOff + 4);
  let nz = buf.readFloatLE(nOff + 8);

  // Left sleeve (X < 0)
  if (x < -TRANS_INNER) {
    const absX = -x;
    const t = Math.min(1.0, Math.max(0.0, (absX - TRANS_INNER) / (TRANS_OUTER - TRANS_INNER)));
    // Cubic smoothstep
    const weight = t * t * (3.0 - 2.0 * t);
    
    // Rotate towards body (counter-clockwise around Z in left arm: dx becomes less negative, dy more negative)
    // Pivot: (PIVOT_X_LEFT, PIVOT_Y)
    const angle = ROT_ANGLE * weight;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    const dx = x - PIVOT_X_LEFT;
    const dy = y - PIVOT_Y;

    // Standard 2D rotation:
    // To rotate a vector (dx < 0, dy < 0) toward -Y:
    // new_dx = dx * cosA - dy * (-sinA) = dx * cosA + dy * sinA
    // Since dx < 0 and dy < 0, dx * cosA is negative, dy * sinA is negative... wait!
    // Let's verify:
    // dx = -36.5, dy = -39.
    // We want dx to become -22.5 (less negative) and dy to become -48.4 (more negative).
    // If angle = +20°:
    // cos(20°) = 0.9397, sin(20°) = 0.3420
    // new_dx = dx * cosA - dy * sinA = -36.5 * 0.9397 - (-39) * 0.3420 = -34.3 + 13.3 = -21.0!
    // new_dy = dx * sinA + dy * cosA = -36.5 * 0.3420 + (-39) * 0.9397 = -12.5 - 36.6 = -49.1!
    // EXACT MATCH! dx became -21.0 and dy became -49.1!
    const newDx = dx * cosA - dy * sinA;
    const newDy = dx * sinA + dy * cosA;

    x = PIVOT_X_LEFT + newDx;
    y = PIVOT_Y + newDy;

    // Rotate normal as well
    const newNx = nx * cosA - ny * sinA;
    const newNy = nx * sinA + ny * cosA;
    nx = newNx;
    ny = newNy;
  }
  // Right sleeve (X > 0)
  else if (x > TRANS_INNER) {
    const absX = x;
    const t = Math.min(1.0, Math.max(0.0, (absX - TRANS_INNER) / (TRANS_OUTER - TRANS_INNER)));
    const weight = t * t * (3.0 - 2.0 * t);

    // Opposite rotation for right arm (clockwise: angle = -ROT_ANGLE * weight)
    const angle = -ROT_ANGLE * weight;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    const dx = x - PIVOT_X_RIGHT;
    const dy = y - PIVOT_Y;

    const newDx = dx * cosA - dy * sinA;
    const newDy = dx * sinA + dy * cosA;

    x = PIVOT_X_RIGHT + newDx;
    y = PIVOT_Y + newDy;

    const newNx = nx * cosA - ny * sinA;
    const newNy = nx * sinA + ny * cosA;
    nx = newNx;
    ny = newNy;
  }

  // Update buffer
  buf.writeFloatLE(x, pOff);
  buf.writeFloatLE(y, pOff + 4);
  buf.writeFloatLE(z, pOff + 8);

  buf.writeFloatLE(nx, nOff);
  buf.writeFloatLE(ny, nOff + 4);
  buf.writeFloatLE(nz, nOff + 8);

  minX = Math.min(minX, x);
  maxX = Math.max(maxX, x);
  minY = Math.min(minY, y);
  maxY = Math.max(maxY, y);
  minZ = Math.min(minZ, z);
  maxZ = Math.max(maxZ, z);
}

// Update glTF accessor min/max
gltf.accessors[0].min = [minX, minY, minZ];
gltf.accessors[0].max = [maxX, maxY, maxZ];

console.log('New Bounding Box:');
console.log(`X: [${minX.toFixed(2)}, ${maxX.toFixed(2)}] (width: ${(maxX - minX).toFixed(2)})`);
console.log(`Y: [${minY.toFixed(2)}, ${maxY.toFixed(2)}] (height: ${(maxY - minY).toFixed(2)})`);
console.log(`Z: [${minZ.toFixed(2)}, ${maxZ.toFixed(2)}] (depth: ${(maxZ - minZ).toFixed(2)})`);

// Reconstruct GLB
const newJsonStr = JSON.stringify(gltf);
let newJsonLen = Buffer.byteLength(newJsonStr, 'utf8');
// GLB chunks must be aligned to 4 bytes
const padding = (4 - (newJsonLen % 4)) % 4;
newJsonLen += padding;
const paddedJsonStr = newJsonStr + ' '.repeat(padding);

const newTotalLen = 12 + 8 + newJsonLen + 8 + binLen;
const outBuf = Buffer.alloc(newTotalLen);

// Header
outBuf.writeUInt32LE(0x46546C67, 0); // 'glTF'
outBuf.writeUInt32LE(2, 4);          // version 2
outBuf.writeUInt32LE(newTotalLen, 8);

// Chunk 0: JSON
outBuf.writeUInt32LE(newJsonLen, 12);
outBuf.writeUInt32LE(0x4E4F534A, 16); // 'JSON'
outBuf.write(paddedJsonStr, 20, newJsonLen, 'utf8');

// Chunk 1: BIN
const newBinHeader = 20 + newJsonLen;
outBuf.writeUInt32LE(binLen, newBinHeader);
outBuf.writeUInt32LE(0x004E4942, newBinHeader + 4); // 'BIN\0'
buf.copy(outBuf, newBinHeader + 8, binDataOffset, binDataOffset + binLen);

fs.writeFileSync(outputPath, outBuf);
console.log('Successfully written posed hoodie to:', outputPath, `(${outBuf.length} bytes)`);
