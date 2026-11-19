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
 * Génère une texture procédurale de tissage textile micro-perforé Dry-Tech PBR
 */
export function createFabricWeaveTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);

  // Micro-perforations et croisillons de maille esport respirante
  for (let x = 0; x < 256; x += 4) {
    for (let y = 0; y < 256; y += 4) {
      const isAlt = (Math.floor(x / 4) + Math.floor(y / 4)) % 2 === 0;
      ctx.fillStyle = isAlt ? '#8e8e8e' : '#6f6f6f';
      ctx.fillRect(x, y, 3, 3);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(24, 24);
  return texture;
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
 * Retourne le modèle 3D actif pour une catégorie (dynamique d'après l'espace Admin)
 */
export function getActiveGlbModel(category) {
  try {
    const customConfig = localStorage.getItem('dwt_custom_glb_models');
    if (customConfig) {
      const parsed = JSON.parse(customConfig);
      if (parsed[category] && parsed[category].trim()) {
        return parsed[category].trim();
      }
    }
  } catch (_) {}

  if (category === 'hoodies') return '/models/hoodie_posed.glb';
  if (category === 'casquettes') return '';
  if (category === 'tote-bags') return '';
  return '/models/tshirt.glb';
}

/**
 * Chargeur principal des modèles .glb de l'utilisateur
 */
export async function loadGarmentModel(category, canvasTexture, options = {}) {
  const isDebug = options.isDebug || window.location.search.includes('debug=1');

  // Détermination de la source .glb (dynamique ou par défaut officiel)
  const glbUrl = getActiveGlbModel(category);

  // Catégories sans modèle 3D configuré : Signalement propre
  if (!glbUrl) {
    return {
      model: null,
      isUnavailable: true,
      category,
      statusMessage: 'Modèle 3D bientôt disponible (Session Pro DWT en cours d\'intégration)',
    };
  }

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

  // Correction rigoureuse de l'orientation native du fichier 3D
  // tshirt.glb (Sketchfab) possède une rotation interne parasite (-28.865° sur Y et -5.16° sur X)
  // qui décalait la face avant vers la droite et tronquait la projection des logos sur les côtes.
  if (glbUrl.includes('tshirt.glb')) {
    model.rotation.set(
      THREE.MathUtils.degToRad(5.16),
      THREE.MathUtils.degToRad(28.865),
      THREE.MathUtils.degToRad(0.165),
      'YXZ'
    );
    model.updateMatrixWorld(true);
  }

  // 3. Normalisation de l'échelle et du centrage rigoureux dans un pivotGroup
  const bbox = new THREE.Box3().setFromObject(model);
  const size = bbox.getSize(new THREE.Vector3());

  // Hauteur cible standardisée : 0.70 mètre (proportions humaines réelles)
  const targetHeight = 0.70;
  const currentHeight = size.y > 0.001 ? size.y : 1;
  const scaleFactor = targetHeight / currentHeight;

  model.scale.setScalar(scaleFactor);
  model.updateMatrixWorld(true);

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

  // Création des matériaux PBR textile haute performance pour chaque zone
  const initialColors = options.colors || {};
  const resolveColor = (hex, fallback = '#141722') => {
    if (!hex) return fallback;
    const lower = hex.toLowerCase().trim();
    if (lower === '#0a0b0e' || lower === '#000000') return '#141722';
    return hex;
  };

  const fabricBumpMap = createFabricWeaveTexture();

  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(resolveColor(initialColors.body, '#141722')),
    roughness: 0.65,
    metalness: 0.04,
    bumpMap: fabricBumpMap,
    bumpScale: 0.003,
    side: THREE.DoubleSide,
  });

  const sleevesMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(resolveColor(initialColors.sleeves || initialColors.body, '#141722')),
    roughness: 0.65,
    metalness: 0.04,
    bumpMap: fabricBumpMap,
    bumpScale: 0.003,
    side: THREE.DoubleSide,
  });

  const collarMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(resolveColor(initialColors.collar, '#e10613')),
    roughness: 0.78,
    metalness: 0.03,
    bumpMap: fabricBumpMap,
    bumpScale: 0.004,
    side: THREE.DoubleSide,
  });

  // 4. Traversée et affectation des matériaux par pièce
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

      const parentName = child.parent ? (child.parent.name || '') : '';
      const nodeName = child.name || '';

      if (isDebug) {
        child.material = new THREE.MeshStandardMaterial({
          map: activeTexture,
          roughness: 0.65,
          metalness: 0.05,
          side: THREE.DoubleSide,
        });
      } else if (parentName.includes('Sleeves') || nodeName.includes('Sleeves')) {
        child.material = sleevesMaterial;
      } else if (parentName.includes('Ribbing') || nodeName.includes('Ribbing')) {
        child.material = collarMaterial;
      } else {
        child.material = bodyMaterial;
      }

      const box = new THREE.Box3().setFromObject(child);
      console.log(`[GARMENT MESH] "${child.name}" (Parent: "${parentName}"): center=(${box.getCenter(new THREE.Vector3()).toArray().map(v=>v.toFixed(3))})`);
    }
  });

  pivotGroup.userData = {
    bodyMaterial,
    sleevesMaterial,
    collarMaterial,
  };

  return {
    model: pivotGroup,
    rawModel: model,
    isUnavailable: false,
    debugInfo,
    category,
  };
}
