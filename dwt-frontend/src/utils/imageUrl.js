// Utilitaire pour résoudre les URLs des images téléversées ou distantes
export const getImageUrl = (img) => {
  if (!img) {
    return 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80';
  }
  if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:')) {
    return img;
  }
  // Fichiers statiques du dossier public frontend
  if (img.startsWith('/backgrounds/') || img.startsWith('/logo-dwt.png') || img.startsWith('/favicon.')) {
    return img;
  }
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  return `${backendUrl}${img.startsWith('/') ? '' : '/'}${img}`;
};

export default getImageUrl;
