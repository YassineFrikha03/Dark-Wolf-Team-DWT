import * as THREE from 'three';

/**
 * textureComposer.js - Compositeur de texture haute résolution (CanvasTexture 4096×4096)
 * - Rendu en temps réel de tous les calques 2D (images, logos, textes) sur le patron UV
 * - Aucun texte parasite par défaut (zéro sponsor ni étiquette flottante)
 * - Support des zones de couleurs personnalisées (corps, manches, col, capuche)
 * - Flocage joueur esport haute définition (Gamertag, Numéro géant, Rôle)
 */

export class TextureComposer {
  constructor(size = 4096) {
    this.size = size;
    this.canvas = document.createElement('canvas');
    this.canvas.width = size;
    this.canvas.height = size;
    this.ctx = this.canvas.getContext('2d', { alpha: false, willReadFrequently: false });

    // Initialisation de la CanvasTexture Three.js
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.generateMipmaps = true;
    this.texture.minFilter = THREE.LinearMipmapLinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.wrapS = THREE.RepeatWrapping;
    this.texture.wrapT = THREE.RepeatWrapping;

    // Cache d'images
    this.imageCache = new Map();
  }

  getTexture() {
    return this.texture;
  }

  async loadImage(url) {
    if (!url) return null;
    if (this.imageCache.has(url)) {
      return this.imageCache.get(url);
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.imageCache.set(url, img);
        resolve(img);
      };
      img.onerror = () => {
        resolve(null);
      };
      img.src = url;
    });
  }

  /**
   * Rendu complet du canvas UV 4096×4096
   */
  async compose(state) {
    const ctx = this.ctx;
    if (!ctx) return;
    const s = this.size;

    const baseColor = state?.colors?.body || state?.color?.hex || '#0a0b0e';
    const secondaryColor = state?.colors?.sleeves || state?.color?.secondaryHex || '#ffffff';
    const collarColor = state?.colors?.collar || state?.color?.collarHex || '#e10613';
    const modelId = state?.modelId || 'model_1';

    // 1. FOND DE BASE TEXTILE
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, s, s);

    // 2. MOTIF ESPORT (M1 à M5)
    this.drawPattern(ctx, s, modelId, secondaryColor, collarColor);

    // 3. TRAME MICRO-MESH DRY-TECH
    this.drawMeshFabricTexture(ctx, s, state?.finish);

    // 4. RENDU DES CALQUES & FLOCAGE : Désormais projetés en 3D pure via DecalGeometry
    // Cette séparation supprime à 100 % le bogue de répétition à l'ourlet bas et au col,
    // et garantit un positionnement millimétrique sans distorsion de coordonnées UV.

    // Notifier Three.js de mettre à jour la texture GPU
    if (this.texture) {
      this.texture.needsUpdate = true;
    }
  }

  /**
   * Rendu précis d'un calque sur les coordonnées UV appropriées
   */
  async renderLayer(ctx, s, layer, category) {
    ctx.save();
    ctx.globalAlpha = layer.opacity ?? 1;

    // Déterminer la zone UV cible selon la face du calque
    let targetCenterX = s * 0.5;
    let targetCenterY = s * 0.5;
    let targetBaseScale = s * 0.28;

    if (layer.view === 'back') {
      targetCenterX = s * 0.5;
      targetCenterY = s * 0.5; // Coordonnées UV du dos
    } else if (layer.view === 'sleeve_left') {
      targetCenterX = s * 0.16;
      targetCenterY = s * 0.35;
      targetBaseScale = s * 0.16;
    } else if (layer.view === 'sleeve_right') {
      targetCenterX = s * 0.84;
      targetCenterY = s * 0.35;
      targetBaseScale = s * 0.16;
    } else if (layer.view === 'hood') {
      targetCenterX = s * 0.5;
      targetCenterY = s * 0.18;
      targetBaseScale = s * 0.18;
    } else {
      // Front (Devant)
      targetCenterX = s * 0.5;
      targetCenterY = s * 0.44;
    }

    // Calcul de la position finale avec l'offset utilisateur [-0.5, 0.5]
    const posX = targetCenterX + (layer.x || 0) * (s * 0.35);
    const posY = targetCenterY + (layer.y || 0) * (s * 0.35);

    ctx.translate(posX, posY);
    if (layer.rotation) {
      ctx.rotate((layer.rotation * Math.PI) / 180);
    }
    if (layer.flipX || layer.flipY) {
      ctx.scale(layer.flipX ? -1 : 1, layer.flipY ? -1 : 1);
    }

    const scale = (layer.scale || 1.0) * (targetBaseScale / 200);

    if (layer.type === 'text') {
      // Calque Texte
      ctx.font = `bold ${Math.round(48 * scale)}px ${layer.fontFamily || "'Orbitron', sans-serif"}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (layer.strokeWidth) {
        ctx.strokeStyle = layer.strokeColor || '#000000';
        ctx.lineWidth = layer.strokeWidth * scale * 2;
        ctx.strokeText(layer.text || '', 0, 0);
      }

      ctx.fillStyle = layer.textColor || '#ffffff';
      ctx.fillText(layer.text || '', 0, 0);
    } else if (layer.url) {
      // Calque Image ou Logo
      const img = await this.loadImage(layer.url);
      if (img) {
        const aspect = img.width / (img.height || 1);
        let renderW = 200 * scale;
        let renderH = (200 * scale) / aspect;
        if (aspect < 1) {
          renderH = 200 * scale;
          renderW = 200 * scale * aspect;
        }

        // Ombre portée subtile de flocage textile
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 10 * scale;
        ctx.shadowOffsetY = 4 * scale;

        ctx.drawImage(img, -renderW / 2, -renderH / 2, renderW, renderH);
      }
    }

    ctx.restore();
  }

  /**
   * Motifs graphiques esport (M1-M5)
   */
  drawPattern(ctx, s, modelId, secondaryColor, collarColor) {
    if (!modelId || modelId === 'none') return;
    ctx.save();
    ctx.globalAlpha = 0.20;

    if (modelId === 'model_1') {
      // Apex Striker : Trame dynamique en diagonale
      ctx.fillStyle = collarColor;
      for (let i = 0; i < s; i += 220) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 120, s);
        ctx.lineTo(i + 160, s);
        ctx.lineTo(i + 40, 0);
        ctx.closePath();
        ctx.fill();
      }
    } else if (modelId === 'model_2') {
      // Shadow Ops : Grilles hexagonales discrètes
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 4;
      const step = 160;
      for (let x = 0; x < s; x += step) {
        for (let y = 0; y < s; y += step) {
          ctx.strokeRect(x, y, step * 0.7, step * 0.7);
        }
      }
    } else if (modelId === 'model_3') {
      // Neon Glitch : Lignes glitch horizontales
      ctx.fillStyle = '#00e5ff';
      for (let y = 0; y < s; y += 80) {
        if ((y / 80) % 3 === 0) {
          ctx.fillRect(0, y, s, 18);
        }
      }
    } else if (modelId === 'model_4') {
      // Alpha Fang : Trame griffes de loup angulaires DWT
      ctx.fillStyle = '#e10613';
      for (let x = 300; x < s - 300; x += 400) {
        ctx.beginPath();
        ctx.moveTo(x, 400);
        ctx.lineTo(x + 100, 1600);
        ctx.lineTo(x + 40, 1800);
        ctx.closePath();
        ctx.fill();
      }
    } else if (modelId === 'model_5') {
      // Titan Armor : Panneaux d'armure angulaires
      ctx.strokeStyle = collarColor;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(s * 0.2, s * 0.1);
      ctx.lineTo(s * 0.8, s * 0.1);
      ctx.lineTo(s * 0.7, s * 0.9);
      ctx.lineTo(s * 0.3, s * 0.9);
      ctx.closePath();
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Trame réaliste de tissu micro-perforé dry-tech (sublimation textile)
   */
  drawMeshFabricTexture(ctx, s, finish) {
    if (finish === 'mat') return;

    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    const spacing = 18;
    for (let x = 0; x < s; x += spacing * 2) {
      for (let y = 0; y < s; y += spacing * 2) {
        ctx.fillRect(x, y, 2.5, 2.5);
      }
    }
    ctx.restore();
  }

  /**
   * Flocage officiel du dos (Gamertag, Rôle, Numéro)
   */
  drawBackFlocking(ctx, s, state) {
    const tag = (state?.gamertag || '').trim();
    const num = (state?.playerNumber || '').trim();
    const role = (state?.playerRole || '').trim();
    const team = (state?.teamName || 'DARK WOLF TEAM').trim();
    const font = state?.playerFont || 'Orbitron';

    if (!tag && !num) return;

    ctx.save();
    const cx = s * 0.5;

    // 1. Gamertag Joueur
    if (tag) {
      ctx.fillStyle = state?.playerTextColor || '#ffffff';
      ctx.font = `900 130px '${font}', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '8px';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 8;
      ctx.fillText(tag, cx, s * 0.24);
    }

    // 2. Badge Rôle Esport (Rouge DWT)
    if (role) {
      ctx.fillStyle = '#e10613';
      ctx.font = `bold 42px '${font}', monospace`;
      ctx.letterSpacing = '6px';
      ctx.fillText(role, cx, s * 0.31);
    }

    // 3. Numéro de Compétition Géant
    if (num) {
      ctx.fillStyle = state?.playerNumberColor || '#ffffff';
      ctx.font = `900 360px '${font}', sans-serif`;
      ctx.letterSpacing = '8px';
      ctx.fillText(num, cx, s * 0.48);
    }

    // 4. Slogan Officiel du Club
    if (team) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = `bold 36px 'Orbitron', monospace`;
      ctx.letterSpacing = '6px';
      ctx.fillText(team, cx, s * 0.65);

      ctx.fillStyle = '#e10613';
      ctx.font = `bold 24px 'Orbitron', sans-serif`;
      ctx.letterSpacing = '4px';
      ctx.fillText('ON NE JOUE PAS. ON DOMINE.', cx, s * 0.69);
    }

    ctx.restore();
  }

  dispose() {
    if (this.texture) {
      this.texture.dispose();
      this.texture = null;
    }
    this.canvas = null;
    this.ctx = null;
    this.imageCache.clear();
  }
}
