import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

/**
 * models.js - Chargeur officiel et normaliseur 3D pour DARK WOLF TEAM
 * - Utilise exclusivement les vrais modèles .glb importés par l'utilisateur
 * - Jamais de géométrie procédurale bidon (cylindre / boîte de remplacement)
 * - Normalisation automatique (Box3) : échelle réaliste, centrage rigoureux sur l'origine
 * - Détection et application du damier UV pour le mode debug (?debug=1)
 * - Nettoyage GPU strict (dispose) à chaque transition
 */

let dracoLoaderInstance = null;

function getDRACOLoader() {
  if (!dracoLoaderInstance) {
    dracoLoaderInstance = new DRACOLoader();
    dracoLoaderInstance.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
  }
  return dracoLoaderInstance;
}

export function hasWebGLSupport() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

/**
 * Génère une texture de damier UV pour le mode diagnostic (?debug=1)
 */
export function createUVCheckerTexture(size = 2048) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const tiles = 32;
  const tileSize = size / tiles;

  for (let x = 0; x < tiles; x++) {
    for (let y = 0; y < tiles; y++) {
      const isEven = (x + y) % 2 === 0;
      ctx.fillStyle = isEven ? '#12151c' : '#e10613';
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

      // Coordonnées de grille
      if (x % 4 === 0 && y % 4 === 0) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px monospace';
        ctx.fillText(`U:${(x / tiles).toFixed(2)}`, x * tileSize + 8, y * tileSize + 28);
        ctx.fillText(`V:${(y / tiles).toFixed(2)}`, x * tileSize + 8, y * tileSize + 52);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Libération complète et récursive des ressources Three.js (dispose)
 */
export function disposeHierarchy(object) {
  if (!object) return;

  object.traverse((child) => {
    if (child.isMesh) {
      if (child.geometry) {
        child.geometry.dispose();
      }
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => {
            if (mat.map && mat.map.isCanvasTexture) {
              // géré à part
            } else if (mat.map) {
              mat.map.dispose();
            }
            mat.dispose();
          });
        } else {
          if (child.material.map && !child.material.map.isCanvasTexture) {
            child.material.map.dispose();
          }
          child.material.dispose();
        }
      }
    }
  });
}

/**
 * Chargeur principal des modèles .glb de l'utilisateur
 */
export async function loadGarmentModel(category, canvasTexture, options = {}) {
  const isDebug = options.isDebug || window.location.search.includes('debug=1');

  // 1. Catégories non encore fournies en .glb : Signalement propre sans forme bidon
  if (category === 'casquettes' || category === 'tote-bags') {
    return {
      model: null,
      isUnavailable: true,
      category,
      statusMessage: 'Modèle 3D bientôt disponible (Session Pro DWT en cours d\'intégration)',
    };
  }

  // 2. Détermination de la source .glb
  // Les maillots et les t-shirts utilisent le modèle tshirt.glb optimisé, les hoodies utilisent hoodie_posed.glb
  const glbUrl = category === 'hoodies' ? '/models/hoodie_posed.glb' : '/models/tshirt.glb';

  const loader = new GLTFLoader();
  loader.setDRACOLoader(getDRACOLoader());

  const gltf = await new Promise((resolve, reject) => {
    loader.load(
      glbUrl,
      (data) => resolve(data),
      (xhr) => {
        if (options.onProgress && xhr.total > 0) {
          options.onProgress(xhr.loaded / xhr.total);
        }
      },
      (err) => reject(err)
    );
  });

  const model = gltf.scene;
  const debugInfo = {
    file: glbUrl,
    meshes: [],
    materials: [],
    triangles: 0,
    bbox: null,
  };

  // 3. Normalisation de l'échelle et du centrage rigoureux dans un pivotGroup
  const bbox = new THREE.Box3().setFromObject(model);
  const size = bbox.getSize(new THREE.Vector3());

  // Hauteur cible standardisée : 0.70 mètre (proportions humaines réelles)
  const targetHeight = 0.70;
  const currentHeight = size.y > 0.001 ? size.y : 1;
  const scaleFactor = targetHeight / currentHeight;

  model.scale.setScalar(scaleFactor);

  // Recalcul de la boîte après échelle pour centrer exactement
  const scaledBbox = new THREE.Box3().setFromObject(model);
  const scaledCenter = scaledBbox.getCenter(new THREE.Vector3());

  // Création du groupe pivot centré strictement à l'origine (0, 0, 0)
  const pivotGroup = new THREE.Group();
  pivotGroup.name = 'dwt-garment-pivot';

  // Centrer le modèle interne pour que le centre géométrique soit exactement (0, 0, 0)
  model.position.x = -scaledCenter.x;
  model.position.y = -scaledCenter.y;
  model.position.z = -scaledCenter.z;
  pivotGroup.add(model);

  debugInfo.bbox = {
    width: (size.x * scaleFactor).toFixed(2),
    height: (size.y * scaleFactor).toFixed(2),
    depth: (size.z * scaleFactor).toFixed(2),
  };

  // Texture active (damier si debug, sinon CanvasTexture officielle)
  const activeTexture = isDebug ? createUVCheckerTexture() : canvasTexture;

  // 4. Traversée et affectation des matériaux
  model.traverse((child) => {
    if (child.isMesh) {
      debugInfo.meshes.push(child.name || 'UnnamedMesh');
      if (child.geometry) {
        const triCount = child.geometry.index
          ? child.geometry.index.count / 3
          : child.geometry.attributes.position.count / 3;
        debugInfo.triangles += Math.round(triCount);
      }

      child.castShadow = true;
      child.receiveShadow = true;

      const matName = child.material ? child.material.name : 'DefaultMat';
      if (!debugInfo.materials.includes(matName)) {
        debugInfo.materials.push(matName);
      }

      // Application du matériau PBR textile (rugosité 0.72 pour un beau relief sur tenues sombres et claires)
      child.material = new THREE.MeshStandardMaterial({
        map: activeTexture || null,
        roughness: 0.72,
        metalness: 0.05,
        side: THREE.DoubleSide,
      });

      if (child.material.map) {
        child.material.map.flipY = false;
        child.material.map.anisotropy = 8;
        child.material.map.needsUpdate = true;
      }

      const box = new THREE.Box3().setFromObject(child);
      console.log(`[GARMENT MESH] "${child.name}": center=(${box.getCenter(new THREE.Vector3()).toArray().map(v=>v.toFixed(3))}) min=(${box.min.toArray().map(v=>v.toFixed(3))}) max=(${box.max.toArray().map(v=>v.toFixed(3))})`);
    }
  });

  return {
    model: pivotGroup,
    rawModel: model,
    isUnavailable: false,
    debugInfo,
    category,
  };
}
