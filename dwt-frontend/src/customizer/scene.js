import * as THREE from 'three';
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js';
import { loadGarmentModel, disposeHierarchy, hasWebGLSupport } from './models.js';
import { isColorDark, getSafeContrastColor } from './state.js';

/**
 * scene.js - Moteur de scène 3D Three.js pour DARK WOLF TEAM
 * - Rendu WebGL pur avec projection de decals haute précision (DecalGeometry)
 * - Aucune répétition ni bleeding de texture (buste, dos, manches, capuche isolés)
 * - Contrôles tactiles et souris avec inertie et amortissement fluide
 * - Éclairage studio esport : Key light + Rim light rouge intense (#E10613)
 * - Ombre de contact au sol et anneau cybernétique
 * - Synchronisation bidirectionnelle avec le slider et les boutons de vue
 */

/**
 * Nettoie la chaine de police pour eliminer les guillemets et fallbacks multiples
 */
export function getCleanFontFamily(fontFamily) {
  if (!fontFamily) return 'Orbitron';
  const first = fontFamily.split(',')[0];
  return first.replace(/['"]/g, '').trim() || 'Orbitron';
}

/**
 * Retourne la graisse exacte supportee par le webfont pour eviter le repli Times New Roman
 */
export function getValidFontWeight(fontFamily, isNumber = false) {
  const fam = (fontFamily || '').toLowerCase();
  if (fam.includes('bebas')) return '400';
  if (fam.includes('teko')) return isNumber ? '700' : '600';
  if (fam.includes('rajdhani')) return isNumber ? '700' : '600';
  if (fam.includes('inter')) return isNumber ? '700' : '600';
  if (fam.includes('impact')) return 'bold';
  return isNumber ? '900' : '700';
}

export class CustomizerScene {
  constructor(containerElement, textureComposer, options = {}) {
    this.container = containerElement;
    this.textureComposer = textureComposer;
    this.options = options;

    this.onAngleChange = options.onAngleChange || null;
    this.onError = options.onError || null;

    // État d'angle et de caméra
    this.targetAngle = (options.initialAngle || 0) * (Math.PI / 180);
    this.currentAngle = this.targetAngle;
    this.isAutoRotate = !!options.isAutoRotate;
    this.autoRotateSpeed = 0.008;

    // Zoom & Cadrage (10% de marge pour que tout le vêtement de 0.70m et l'anneau au sol restent visibles)
    this.targetZoom = 1.65;
    this.currentZoom = 1.65;
    this.minZoom = 0.9;
    this.maxZoom = 2.8;

    // Glisser-déposer avec inertie
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.velocity = 0;

    // Modèle actif & Conteneur de decals 3D
    this.currentModelGroup = null;
    this.decalContainer = new THREE.Group();
    this.decalContainer.name = 'dwt-decals-container';
    this.imageCache = new Map();
    this.lastState = null;
    this.isSyncingDecals = false;
    this.currentCategory = options.initialCategory || 'hoodies';

    // Animation loop
    this.animFrameId = null;
    this.lastTime = performance.now();

    this.init();
  }

  init() {
    window.__DWT_SCENE__ = this;
    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 600;

    // 1. SCÈNE
    this.scene = new THREE.Scene();
    this.scene.background = null; // Fond transparent

    // 2. CAMÉRA CADRÉE
    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    this.camera.position.set(0, 0, this.currentZoom);
    this.camera.lookAt(0, 0, 0);

    // 3. RENDERER
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true, // Requis pour capture PNG panier
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // 4. ÉCLAIRAGE STUDIO ESPORT HAUTE DÉFINITION
    this.setupLighting();

    // 5. SOL ET OMBRE DE CONTACT
    this.setupGround();

    // 6. ÉCOUTEURS D'ÉVÉNEMENTS (SOURIS, TACTILE, RESIZE)
    this.bindEvents();

    // 7. CHARGEMENT INITIAL DU MODÈLE
    this.loadCategory(this.currentCategory);

    // 8. DÉMARRAGE DE LA BOUCLE DE RENDU
    this.animate = this.animate.bind(this);
    this.animFrameId = requestAnimationFrame(this.animate);
  }

  setupLighting() {
    // Lumière d'ambiance studio renforcée pour faire ressortir les tenues et leurs plis
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.15);
    this.scene.add(ambientLight);

    // Éclairage hémisphérique pour simuler le rebond naturel studio sur le tissu PBR
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x252a38, 1.35);
    this.scene.add(hemiLight);

    // Key Light blanche naturelle haute définition
    this.keyLight = new THREE.DirectionalLight(0xffffff, 1.65);
    this.keyLight.position.set(2, 3, 3);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 1024;
    this.keyLight.shadow.mapSize.height = 1024;
    this.keyLight.shadow.bias = -0.0005;
    this.scene.add(this.keyLight);

    // Fill Light adoucissant avec nuances fraîches
    const fillLight = new THREE.DirectionalLight(0xddeeff, 0.95);
    fillLight.position.set(-2.5, 1.2, 2.2);
    this.scene.add(fillLight);

    // Back Light blanche studio pour illuminer le dos et les flocages
    const backLight = new THREE.DirectionalLight(0xffffff, 1.65);
    backLight.position.set(0, 2.5, -3);
    this.scene.add(backLight);

    // Rim Light ROUGE DWT esport subtile (#E10613) sur les contours
    this.rimLight = new THREE.DirectionalLight(0xe10613, 1.1);
    this.rimLight.position.set(0, 2, -2.5);
    this.scene.add(this.rimLight);
  }

  setupGround() {
    // 1. Ombre portée douce au sol
    const shadowGeo = new THREE.PlaneGeometry(1.2, 1.2);
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.75)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.35)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    const shadowTex = new THREE.CanvasTexture(canvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });

    this.shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    this.shadowMesh.rotation.x = -Math.PI / 2;
    this.shadowMesh.position.y = -0.36;
    this.scene.add(this.shadowMesh);

    // 2. Anneau cybernétique au sol (diamètre adapté pour tenir sous le vêtement de 0.70m)
    const ringGeo = new THREE.RingGeometry(0.44, 0.46, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xe10613,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    });
    this.podiumRing = new THREE.Mesh(ringGeo, ringMat);
    this.podiumRing.rotation.x = -Math.PI / 2;
    this.podiumRing.position.y = -0.355;
    this.scene.add(this.podiumRing);
  }

  async loadCategory(category) {
    this.currentCategory = category;

    // Supprimer et libérer proprement l'ancien modèle (dispose)
    if (this.currentModelGroup) {
      this.scene.remove(this.currentModelGroup);
      disposeHierarchy(this.currentModelGroup);
      this.currentModelGroup = null;
    }

    try {
      const texture = this.textureComposer ? this.textureComposer.getTexture() : null;
      const result = await loadGarmentModel(category, texture, {
        isDebug: this.options.isDebug,
        colors: this.lastState?.colors,
      });

      if (result.isUnavailable) {
        if (this.shadowMesh) this.shadowMesh.visible = false;
        if (this.podiumRing) this.podiumRing.visible = false;
        if (this.options.onModelUnavailable) {
          this.options.onModelUnavailable(result.statusMessage);
        }
        return;
      }

      if (this.shadowMesh) this.shadowMesh.visible = true;
      if (this.podiumRing) this.podiumRing.visible = true;

      this.currentModelGroup = result.model;
      this.currentModelGroup.add(this.decalContainer);
      this.scene.add(this.currentModelGroup);

      if (this.lastState) {
        this.updateColors(this.lastState.colors);
        this.syncDecals(this.lastState);
      }

      if (this.options.onModelLoaded) {
        this.options.onModelLoaded(result);
      }
    } catch (err) {
      console.error('Erreur chargement modèle .glb:', err);
      if (this.onError) this.onError(err);
    }
  }

  updateColors(colors) {
    if (!colors || !this.currentModelGroup || !this.currentModelGroup.userData) return;
    const { bodyMaterial, sleevesMaterial, collarMaterial } = this.currentModelGroup.userData;

    const resolveHex = (hex, fallback = '#141722') => {
      if (!hex) return fallback;
      const lower = hex.toLowerCase().trim();
      if (lower === '#0a0b0e' || lower === '#000000') return '#141722';
      return hex;
    };

    if (bodyMaterial) {
      bodyMaterial.color.set(resolveHex(colors.body, '#141722'));
      bodyMaterial.needsUpdate = true;
    }
    if (sleevesMaterial) {
      sleevesMaterial.color.set(resolveHex(colors.sleeves || colors.body, '#141722'));
      sleevesMaterial.needsUpdate = true;
    }
    if (collarMaterial) {
      collarMaterial.color.set(resolveHex(colors.collar, '#e10613'));
      collarMaterial.needsUpdate = true;
    }
  }

  bindEvents() {
    const el = this.renderer.domElement;

    this.handleMouseDown = (e) => {
      this.isDragging = true;
      this.velocity = 0;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    this.handleMouseMove = (e) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.previousMousePosition.x;
      this.velocity = deltaX * 0.007;
      this.targetAngle += this.velocity;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    this.handleMouseUp = () => {
      this.isDragging = false;
    };

    // Molette pour le zoom
    this.handleWheel = (e) => {
      e.preventDefault();
      const zoomDelta = e.deltaY * 0.002;
      this.targetZoom = Math.min(this.maxZoom, Math.max(this.minZoom, this.targetZoom + zoomDelta));
    };

    // Tactile mobile
    this.handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.velocity = 0;
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    this.handleTouchMove = (e) => {
      if (!this.isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
      this.velocity = deltaX * 0.007;
      this.targetAngle += this.velocity;
      this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    this.handleTouchEnd = () => {
      this.isDragging = false;
    };

    el.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
    el.addEventListener('wheel', this.handleWheel, { passive: false });

    el.addEventListener('touchstart', this.handleTouchStart, { passive: true });
    el.addEventListener('touchmove', this.handleTouchMove, { passive: true });
    el.addEventListener('touchend', this.handleTouchEnd, { passive: true });

    // ResizeObserver pour adapter la résolution
    this.resizeObserver = new ResizeObserver(() => {
      this.onResize();
    });
    this.resizeObserver.observe(this.container);
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (w === 0 || h === 0) return;

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  setTargetAngleDegrees(deg) {
    this.targetAngle = (deg * Math.PI) / 180;
    this.velocity = 0;
  }

  setAutoRotate(enabled) {
    this.isAutoRotate = enabled;
  }

  resetView() {
    this.targetAngle = 0;
    this.velocity = 0;
    this.targetZoom = 1.65;
    this.isAutoRotate = false;
  }

  zoomIn() {
    this.targetZoom = Math.max(this.minZoom, this.targetZoom - 0.4);
  }

  zoomOut() {
    this.targetZoom = Math.min(this.maxZoom, this.targetZoom + 0.4);
  }

  animate() {
    this.animFrameId = requestAnimationFrame(this.animate);

    // Inertie et auto-rotation
    if (this.isAutoRotate && !this.isDragging) {
      this.targetAngle += this.autoRotateSpeed;
    } else if (!this.isDragging && Math.abs(this.velocity) > 0.0001) {
      this.targetAngle += this.velocity;
      this.velocity *= 0.92; // Friction
    }

    // Amortissement fluide de l'angle
    this.currentAngle += (this.targetAngle - this.currentAngle) * 0.12;

    // Amortissement du zoom caméra
    this.currentZoom += (this.targetZoom - this.currentZoom) * 0.12;
    this.camera.position.z = this.currentZoom;

    // Rotation du modèle vêtement actif (entraîne rigidement decalContainer)
    if (this.currentModelGroup && !this.isProjecting) {
      this.currentModelGroup.rotation.y = this.currentAngle;
    }

    // Rotation synchronisée de l'anneau de sol
    if (this.podiumRing) {
      this.podiumRing.rotation.z = this.currentAngle;
    }

    // Notification de l'angle en degrés [0, 360[ pour synchroniser l'UI
    if (this.onAngleChange) {
      const degrees = (((this.currentAngle * 180) / Math.PI) % 360 + 360) % 360;
      this.onAngleChange(degrees);
    }

    this.renderer.render(this.scene, this.camera);
  }

  capturePreview() {
    if (!this.renderer) return null;
    return this.renderer.domElement.toDataURL('image/png');
  }

  loadImage(url) {
    if (!url) return Promise.resolve(null);
    if (this.imageCache.has(url)) {
      return Promise.resolve(this.imageCache.get(url));
    }
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.imageCache.set(url, img);
        resolve(img);
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  }

  clearDecals() {
    while (this.decalContainer.children.length > 0) {
      const child = this.decalContainer.children[0];
      this.decalContainer.remove(child);
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (child.material.map) child.material.map.dispose();
        child.material.dispose();
      }
    }
  }

  async preloadLayer(layer) {
    if (!layer || !layer.visible) return;
    if (layer.type === 'text') {
      const cleanFam = getCleanFontFamily(layer.fontFamily);
      const isMatchNumber = /^\d{1,2}$/.test((layer.text || '').trim());
      const weight = getValidFontWeight(cleanFam, isMatchNumber);
      if (typeof document !== 'undefined' && document.fonts && document.fonts.load) {
        try {
          await document.fonts.load(`${weight} 60px "${cleanFam}"`);
        } catch {}
      }
    } else if (layer.url) {
      await this.loadImage(layer.url);
    }
  }

  async syncDecals(state) {
    if (!state) return;
    this.lastState = state;
    if (!this.currentModelGroup) return;

    if (this.isSyncingDecals) {
      this.pendingSyncState = state;
      return;
    }
    this.isSyncingDecals = true;

    try {
      // 1. Précharger toutes les ressources (polices, images) AVANT de modifier la rotation
      const activeLayers = (state.layers || []).filter(l => l && l.visible);
      await Promise.all(activeLayers.map(l => this.preloadLayer(l)));

      // 2. Verrouiller la rotation pour un cycle de projection 100% synchrone
      this.isProjecting = true;
      const prevRot = this.currentModelGroup.rotation.y;
      this.currentModelGroup.rotation.y = 0;
      this.currentModelGroup.updateMatrixWorld(true);

      // 3. Nettoyer les anciens decals
      this.clearDecals();

      // 4. Projeter chaque calque 2D actif (Le modèle 3D suit strictement le patron 2D)
      for (const layer of activeLayers) {
        this.createLayerDecal(layer);
      }

      // 5. Restaurer immédiatement la rotation du modèle
      this.currentModelGroup.rotation.y = prevRot;
      this.currentModelGroup.updateMatrixWorld(true);
      this.isProjecting = false;
    } catch (err) {
      console.warn('Erreur projection decals:', err);
      this.isProjecting = false;
    } finally {
      this.isSyncingDecals = false;
      if (this.pendingSyncState) {
        const next = this.pendingSyncState;
        this.pendingSyncState = null;
        this.syncDecals(next);
      }
    }
  }

  createLayerDecal(layer) {
    let texture = null;
    let decalAspect = 1.0;

    if (layer.type === 'text') {
      const text = layer.text || '';
      const cleanFam = getCleanFontFamily(layer.fontFamily);
      const isMatchNumber = /^\d{1,2}$/.test(text.trim());
      const weight = getValidFontWeight(cleanFam, isMatchNumber);

      // Calculer les dimensions de canvas adaptées au ratio du texte
      const targetW = Math.max(80, layer.width || 200);
      const targetH = Math.max(40, layer.height || 60);
      decalAspect = targetW / targetH;

      // Résolution haute définition (1024px sur le grand axe)
      const maxDim = 1024;
      let cvW, cvH;
      if (decalAspect >= 1) {
        cvW = maxDim;
        cvH = Math.max(128, Math.round(maxDim / decalAspect));
      } else {
        cvH = maxDim;
        cvW = Math.max(128, Math.round(maxDim * decalAspect));
      }

      const cv = document.createElement('canvas');
      cv.width = cvW;
      cv.height = cvH;
      const ctx = cv.getContext('2d');
      ctx.clearRect(0, 0, cvW, cvH);

      let fontSize = isMatchNumber ? Math.round(cvH * 0.78) : Math.round(cvH * 0.62);
      ctx.font = `${weight} ${fontSize}px "${cleanFam}", "Orbitron", "Rajdhani", sans-serif`;

      // Mesurer et ajuster la taille de police pour éliminer tout risque de rognage
      const textMetrics = ctx.measureText(text);
      if (textMetrics.width > cvW * 0.88) {
        fontSize = Math.round(fontSize * ((cvW * 0.88) / textMetrics.width));
        ctx.font = `${weight} ${fontSize}px "${cleanFam}", "Orbitron", "Rajdhani", sans-serif`;
      }

      const bodyColor = this.lastState?.colors?.body || this.lastState?.color?.hex || '#0a0b0e';
      const textColor = getSafeContrastColor(layer.textColor || '#ffffff', bodyColor);
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (layer.curve && Number(layer.curve) !== 0) {
        // Rendu courbe le long d'une arche
        const curveVal = Number(layer.curve);
        const radius = Math.max(140, 950 - Math.abs(curveVal) * 14);
        const isUp = curveVal > 0;
        const totalAngle = (text.length * 85) / radius;
        const startAngle = isUp ? -Math.PI / 2 - totalAngle / 2 : Math.PI / 2 - totalAngle / 2;
        const centerY = isUp ? (cvH / 2) + radius : (cvH / 2) - radius;

        ctx.save();
        ctx.translate(cvW / 2, centerY);
        const charAngleStep = totalAngle / Math.max(1, text.length - 1);

        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          const angle = startAngle + i * charAngleStep;
          ctx.save();
          ctx.rotate(angle + (isUp ? Math.PI / 2 : -Math.PI / 2));
          ctx.translate(0, isUp ? -radius : radius);
          if (layer.strokeWidth && layer.strokeColor) {
            ctx.lineWidth = layer.strokeWidth * 2;
            ctx.strokeStyle = layer.strokeColor;
            ctx.strokeText(char, 0, 0);
          }
          ctx.fillText(char, 0, 0);
          ctx.restore();
        }
        ctx.restore();
      } else {
        if (layer.strokeWidth && layer.strokeColor) {
          ctx.lineWidth = layer.strokeWidth * 2;
          ctx.strokeStyle = layer.strokeColor;
          ctx.strokeText(text, cvW / 2, cvH / 2);
        }
        ctx.fillText(text, cvW / 2, cvH / 2);
      }

      texture = new THREE.CanvasTexture(cv);
      texture.colorSpace = THREE.SRGBColorSpace;
    } else {
      if (!layer.url) return;
      const img = this.imageCache.get(layer.url);
      if (!img) return;

      const imgAspect = (img.naturalWidth && img.naturalHeight) ? (img.naturalWidth / img.naturalHeight) : 1;
      const targetW = layer.width || 200;
      const targetH = layer.height || 200;
      decalAspect = (targetW / targetH) || imgAspect;

      const cv = document.createElement('canvas');
      cv.width = 1024;
      cv.height = Math.max(128, Math.round(1024 / (decalAspect || 1)));
      const ctx = cv.getContext('2d');
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.save();
      ctx.globalAlpha = layer.opacity ?? 1;
      if (layer.flipX || layer.flipY) {
        ctx.translate(layer.flipX ? cv.width : 0, layer.flipY ? cv.height : 0);
        ctx.scale(layer.flipX ? -1 : 1, layer.flipY ? -1 : 1);
      }
      ctx.drawImage(img, 0, 0, cv.width, cv.height);
      ctx.restore();

      texture = new THREE.CanvasTexture(cv);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = true;
    }

    if (!texture) return;

    const isBack = layer.view === 'back';
    const isLeft = layer.view === 'sleeve_left';
    const isRight = layer.view === 'sleeve_right';
    const isHood = layer.view === 'hood';

    const pos = new THREE.Vector3();
    const rot = new THREE.Euler();
    const rad = -((layer.rotation || 0) * Math.PI) / 180;

    const scale = layer.scale || 1.0;
    const baseDim = 0.22;
    // Profondeur de projection calibrée à 0.08m pour éviter tout saignement sur la face opposée
    const sz = new THREE.Vector3(baseDim * scale * decalAspect, baseDim * scale, 0.08);

    if (isBack) {
      // Dos : rotation compensée (-rad) pour synchroniser rigoureusement le sens horaire
      pos.set(
        -(layer.x || 0) * 0.28,
        0.06 - (layer.y || 0) * 0.46,
        -0.150
      );
      rot.set(0, Math.PI, -rad);
      sz.set(baseDim * scale * decalAspect, baseDim * scale, 0.08);
    } else if (isLeft) {
      // Manche gauche (Wearer's Left Arm, looking from front = X > 0)
      pos.set(
        0.25,
        0.08 - (layer.y || 0) * 0.22,
        0.02 - (layer.x || 0) * 0.14
      );
      rot.set(0, -Math.PI * 0.5, rad);
      sz.set(0.14 * scale * decalAspect, 0.14 * scale, 0.08);
    } else if (isRight) {
      // Manche droite (Wearer's Right Arm, looking from front = X < 0)
      pos.set(
        -0.25,
        0.08 - (layer.y || 0) * 0.22,
        0.02 + (layer.x || 0) * 0.14
      );
      rot.set(0, Math.PI * 0.5, rad);
      sz.set(0.14 * scale * decalAspect, 0.14 * scale, 0.08);
    } else if (isHood) {
      // Capuche
      pos.set(
        -0.14 + (layer.x || 0) * 0.12,
        0.28 - (layer.y || 0) * 0.14,
        0.0
      );
      rot.set(0, Math.PI * 0.5, rad);
      sz.set(0.14 * scale * decalAspect, 0.14 * scale, 0.08);
    } else {
      // Devant : synchronisation rigoureuse avec le patron 2D (centre torse Y = 0.08m)
      pos.set(
        (layer.x || 0) * 0.28,
        0.08 - (layer.y || 0) * 0.46,
        0.150
      );
      rot.set(0, 0, rad);
      sz.set(baseDim * scale * decalAspect, baseDim * scale, 0.08);
    }

    // Diagnostic et projection du decal sur les maillages du modèle avec isolation stricte des pièces
    let totalDecalCount = 0;
    this.currentModelGroup.traverse((child) => {
      if (child.isMesh && child.parent !== this.decalContainer) {
        const parentName = child.parent ? (child.parent.name || '') : '';
        const nodeHierarchy = `${child.name} ${parentName}`;
        
        // Isolation stricte des sous-maillages de tshirt.glb
        if (parentName) {
          if (isBack && (parentName.includes('Body_Front') || parentName.includes('Sleeves') || parentName.includes('Ribbing'))) return;
          if (!isBack && !isLeft && !isRight && !isHood && (parentName.includes('Body_Back') || parentName.includes('Sleeves') || parentName.includes('Ribbing'))) return;
          if (isLeft && (!parentName.includes('Sleeves_Node_6') && !nodeHierarchy.includes('Object_18'))) return;
          if (isRight && (!parentName.includes('Sleeves_Node_7') && !nodeHierarchy.includes('Object_20'))) return;
        }
        if (isLeft && (nodeHierarchy.includes('Body_Back') || nodeHierarchy.includes('Sleeves_Node_7'))) return;
        if (isRight && (nodeHierarchy.includes('Body_Back') || nodeHierarchy.includes('Sleeves_Node_6'))) return;

        try {
          const decalGeo = new DecalGeometry(child, pos, rot, sz);
          const vCount = decalGeo.attributes.position ? decalGeo.attributes.position.count : 0;
          if (vCount > 0) {
            const decalMat = new THREE.MeshStandardMaterial({
              map: texture,
              transparent: true,
              depthTest: true,
              depthWrite: false,
              polygonOffset: true,
              polygonOffsetFactor: -1.2,
              polygonOffsetUnits: -1.2,
              roughness: 0.68,
              metalness: 0.03,
              alphaTest: 0.01,
            });
            const decalMesh = new THREE.Mesh(decalGeo, decalMat);
            this.decalContainer.add(decalMesh);
            totalDecalCount++;
          } else {
            decalGeo.dispose();
          }
        } catch (e) {
          console.warn(`[DECAL ERR] Layer ${layer.view} on ${child.name}:`, e);
        }
      }
    });
    if (totalDecalCount === 0) {
      console.warn(`[DECAL MISSED] Layer ${layer.view} produced 0 decal meshes! Pos was:`, pos.toArray().map(v=>v.toFixed(3)));
    }
  }

  destroy() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    const el = this.renderer?.domElement;
    if (el) {
      el.removeEventListener('mousedown', this.handleMouseDown);
      window.removeEventListener('mousemove', this.handleMouseMove);
      window.removeEventListener('mouseup', this.handleMouseUp);
      el.removeEventListener('wheel', this.handleWheel);
      el.removeEventListener('touchstart', this.handleTouchStart);
      el.removeEventListener('touchmove', this.handleTouchMove);
      el.removeEventListener('touchend', this.handleTouchEnd);
      el.remove();
    }

    if (this.currentModelGroup) {
      disposeHierarchy(this.currentModelGroup);
      this.currentModelGroup = null;
    }

    if (this.shadowMesh) {
      this.shadowMesh.geometry.dispose();
      this.shadowMesh.material.dispose();
    }

    if (this.podiumRing) {
      this.podiumRing.geometry.dispose();
      this.podiumRing.material.dispose();
    }

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
  }
}
