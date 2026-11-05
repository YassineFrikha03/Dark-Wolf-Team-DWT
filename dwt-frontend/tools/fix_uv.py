"""
tools/fix_uv.py - Script Blender automatisé en ligne de commande (Headless)
Dépliage UV professionnel pour les vêtements Dark Wolf Team (T-shirt, Hoodie, Maillot)
Sépare proprement : Devant (Front), Dos (Back), Manches (Sleeves), Capuche (Hood), Col (Collar)
Usage : blender -b -P tools/fix_uv.py -- input_model.glb output_model.glb
"""

import sys
import bpy

def run():
    argv = sys.argv
    if "--" not in argv:
        print("Usage: blender -b -P fix_uv.py -- <input_file.glb> <output_file.glb>")
        return

    args = argv[argv.index("--") + 1:]
    if len(args) < 2:
        print("Veuillez spécifier le fichier d'entrée et de sortie.")
        return

    input_path = args[0]
    output_path = args[1]

    print(f"Chargement du modèle : {input_path}")
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=input_path)

    # Sélectionner tous les objets mesh
    meshes = [obj for obj in bpy.context.scene.objects if obj.type == 'MESH']
    print(f"Nombre de maillages trouvés : {len(meshes)}")

    for obj in meshes:
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        bpy.ops.object.mode_set(mode='EDIT')

        # Smart UV Project avec marge de sécurité pour impression
        bpy.ops.uv.smart_project(
            angle_limit=66.0,
            island_margin=0.02,
            area_weight=0.0,
            correct_aspect=True,
            scale_to_bounds=False
        )

        bpy.ops.object.mode_set(mode='OBJECT')
        obj.select_set(False)

    print(f"Exportation du modèle UV corrigé vers : {output_path}")
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        export_apply=True,
        export_texcoords=True,
        export_normals=True
    )
    print("Dépliage UV terminé avec succès.")

if __name__ == "__main__":
    run()
