/**
 * cart.js - Module d'intégration du panier et guide des tailles DARK WOLF TEAM
 * - Calcul dynamique des prix en dinars tunisiens (« 69,99 TND »)
 * - Capture PNG haute fidélité du vêtement 3D
 * - Tableau des mensurations en cm
 * - Événements d'ajout au panier sécurisés
 */

import { BASE_PRICES } from './state.js';

export const SIZE_CHART = {
  maillots: [
    { size: 'S', chest: '92 - 96 cm', length: '70 cm', shoulders: '42 cm' },
    { size: 'M', chest: '97 - 102 cm', length: '72 cm', shoulders: '44 cm' },
    { size: 'L', chest: '103 - 108 cm', length: '74 cm', shoulders: '46 cm' },
    { size: 'XL', chest: '109 - 114 cm', length: '76 cm', shoulders: '48 cm' },
    { size: '2XL', chest: '115 - 122 cm', length: '78 cm', shoulders: '50 cm' },
  ],
  hoodies: [
    { size: 'S', chest: '98 - 102 cm', length: '68 cm', sleeve: '63 cm' },
    { size: 'M', chest: '103 - 108 cm', length: '70 cm', sleeve: '65 cm' },
    { size: 'L', chest: '109 - 114 cm', length: '73 cm', sleeve: '67 cm' },
    { size: 'XL', chest: '115 - 120 cm', length: '75 cm', sleeve: '69 cm' },
    { size: '2XL', chest: '121 - 128 cm', length: '77 cm', sleeve: '71 cm' },
  ],
  't-shirt': [
    { size: 'S', chest: '90 - 95 cm', length: '69 cm', shoulders: '41 cm' },
    { size: 'M', chest: '96 - 101 cm', length: '71 cm', shoulders: '43 cm' },
    { size: 'L', chest: '102 - 107 cm', length: '73 cm', shoulders: '45 cm' },
    { size: 'XL', chest: '108 - 113 cm', length: '75 cm', shoulders: '47 cm' },
    { size: '2XL', chest: '114 - 120 cm', length: '77 cm', shoulders: '49 cm' },
  ],
  casquettes: [
    { size: 'Unique (54 - 61 cm)', details: 'Fermeture snapback réglable 7 crans' },
  ],
  'tote-bags': [
    { size: 'Standard (38 × 42 cm)', details: 'Anses renforcées 65 cm, capacité 18L' },
  ],
};

export function formatTND(val) {
  const num = typeof val === 'number' ? val : parseFloat(val) || 0;
  return `${num.toFixed(2).replace('.', ',')} TND`;
}

export function computeCustomPrice(state) {
  const base = BASE_PRICES[state?.category] || 69.99;
  const hasFlocking = !!(state?.showGamertag || state?.showPlayerNumber || state?.showPlayerRole);
  const finishExtra = state?.finish === 'mesh' ? 5.0 : 0.0;
  return base + (hasFlocking ? 5.0 : 0.0) + finishExtra;
}

export function buildCartPayload(state, previewSnapshotUrl = null) {
  const price = computeCustomPrice(state);
  const categoryTitles = {
    maillots: 'Maillot Esport Pro 2026',
    hoodies: 'Hoodie Techwear Pro DWT',
    't-shirt': 'T-Shirt Athletic Esport',
    casquettes: 'Casquette Snapback Esport',
    'tote-bags': 'Tote Bag Toile Esport',
  };

  return {
    _id: `custom_${state.category}_${Date.now()}`,
    name: `${categoryTitles[state.category] || 'Équipement Esport'} - ${state.modelName || 'Custom'}`,
    price: price,
    category: state.category,
    size: state.size || 'L',
    image: previewSnapshotUrl || '/logo-dwt.png',
    images: previewSnapshotUrl ? [previewSnapshotUrl] : ['/logo-dwt.png'],
    isCustom: true,
    customConfig: {
      category: state.category,
      gamertag: state.gamertag || '',
      playerNumber: state.playerNumber || '',
      playerRole: state.playerRole || '',
      collarStyle: state.collarStyle,
      jerseyFit: state.jerseyFit,
      frontNumberEnabled: state.frontNumberEnabled,
      teamMode: state.teamMode,
      teamRoster: state.teamRoster,
      finish: state.finish,
      colors: state.colors,
      layersCount: state.layers?.length || 0,
    },
    customDetails: {
      model: categoryTitles[state.category] || 'Équipement Esport',
      color: state.colors?.body || state.color?.name || 'Noir',
      finish: state.finish || 'mesh',
      gamertag: state.gamertag || '',
      number: state.playerNumber || '',
      role: state.playerRole || '',
      layersCount: state.layers?.length || 0,
    },
  };
}
