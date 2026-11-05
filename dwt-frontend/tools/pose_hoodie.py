#!/usr/bin/env python3
"""
Dark Wolf Team (DWT) - 3D Hoodie Posing Tool
Automates posing of hoodie.glb from T-pose/wide-spread pose to natural A-pose (~55-65°).
Preserves intact UV coordinates, normals, and materials.
Usage: blender --background --python tools/pose_hoodie.py
"""

import sys
import os
import math

try:
    import bpy
    import mathutils
except ImportError:
    print("Ce script doit être exécuté dans l'environnement Blender (blender --background --python tools/pose_hoodie.py)")
    sys.exit(1)

def run():
    print("=== DWT 3D Hoodie Posing Tool ===")
    
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    input_path = os.path.join(base_dir, "src", "format glb", "hoodie.glb")
    output_path = os.path.join(base_dir, "public", "models", "hoodie_posed.glb")
    
    if not os.path.exists(input_path):
        input_path = os.path.join(base_dir, "public", "models", "hoodie.glb")
        
    print(f"Chargement du modèle: {input_path}")
    
    # Nettoyer la scène par défaut
    bpy.ops.wm.read_factory_settings(use_empty=True)
    
    # Importer le GLB
    bpy.ops.import_scene.gltf(filepath=input_path)
    
    # Trouver le mesh du vêtement
    mesh_objs = [obj for obj in bpy.context.scene.objects if obj.type == 'MESH']
    if not mesh_objs:
        print("Erreur: aucun mesh trouvé dans le fichier glTF.")
        sys.exit(1)
        
    hoodie_obj = mesh_objs[0]
    print(f"Mesh identifié: {hoodie_obj.name} ({len(hoodie_obj.data.vertices)} sommets)")
    
    # Déterminer les dimensions et les pivots des épaules
    bbox = [hoodie_obj.matrix_world @ mathutils.Vector(corner) for corner in hoodie_obj.bound_box]
    min_x = min(v.x for v in bbox)
    max_x = max(v.x for v in bbox)
    min_y = min(v.y for v in bbox)
    max_y = max(v.y for v in bbox)
    min_z = min(v.z for v in bbox)
    max_z = max(v.z for v in bbox)
    
    print(f"Bounding box: X=[{min_x:.2f}, {max_x:.2f}], Y=[{min_y:.2f}, {max_y:.2f}], Z=[{min_z:.2f}, {max_z:.2f}]")
    
    # Torso transition zone: ~35% of total half-width
    half_width = (max_x - min_x) / 2.0
    shoulder_x_left = min_x + half_width * 0.65  # -X shoulder
    shoulder_x_right = max_x - half_width * 0.65 # +X shoulder
    shoulder_y = min_y + (max_y - min_y) * 0.75  # ~shoulder height
    
    print(f"Pivots d'épaule calculés: G=[{shoulder_x_left:.2f}, {shoulder_y:.2f}], D=[{shoulder_x_right:.2f}, {shoulder_y:.2f}]")
    
    # Déformation douce des manches vers le bas (smoothstep)
    # Angle de rotation: ~25° supplémentaire vers le bas (Z-forward, Y-up)
    rotation_angle = math.radians(-25.0) # vers le bas
    
    mesh = hoodie_obj.data
    for v in mesh.vertices:
        co = v.co
        # Bras gauche (X négatif)
        if co.x < shoulder_x_left:
            dist = shoulder_x_left - co.x
            transition_width = half_width * 0.2
            weight = min(1.0, max(0.0, dist / transition_width))
            # Smoothstep
            weight = weight * weight * (3.0 - 2.0 * weight)
            
            # Rotation autour du pivot gauche
            angle = -rotation_angle * weight
            dx = co.x - shoulder_x_left
            dy = co.y - shoulder_y
            cos_a = math.cos(angle)
            sin_a = math.sin(angle)
            v.co.x = shoulder_x_left + (dx * cos_a - dy * sin_a)
            v.co.y = shoulder_y + (dx * sin_a + dy * cos_a)
            
        # Bras droit (X positif)
        elif co.x > shoulder_x_right:
            dist = co.x - shoulder_x_right
            transition_width = half_width * 0.2
            weight = min(1.0, max(0.0, dist / transition_width))
            # Smoothstep
            weight = weight * weight * (3.0 - 2.0 * weight)
            
            # Rotation autour du pivot droit
            angle = rotation_angle * weight
            dx = co.x - shoulder_x_right
            dy = co.y - shoulder_y
            cos_a = math.cos(angle)
            sin_a = math.sin(angle)
            v.co.x = shoulder_x_right + (dx * cos_a - dy * sin_a)
            v.co.y = shoulder_y + (dx * sin_a + dy * cos_a)
            
    mesh.update()
    
    # Exporter le modèle posé
    print(f"Exportation vers {output_path}...")
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        export_draco_mesh_compression_enable=True,
        export_materials='EXPORT',
        export_normals=True
    )
    print("Pose du hoodie terminée avec succès !")

if __name__ == '__main__':
    run()
