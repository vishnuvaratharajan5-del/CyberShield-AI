import os
import zipfile

def create_archive():
    root_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    output_zip = os.path.join(root_dir, 'public', 'cybershield-ai.zip')
    
    print(f"Creating export zip from {root_dir} to {output_zip}...")
    
    # Excluded directories and file patterns
    excluded_dirs = {'node_modules', 'dist', '.git', '.cache', '__pycache__', '.temp'}
    excluded_files = {'.DS_Store', 'cybershield-ai.zip'}
    
    with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        for root, dirs, files in os.walk(root_dir):
            # Modify dirs in-place to prune excluded directories
            dirs[:] = [d for d in dirs if d not in excluded_dirs and not d.startswith('.git')]
            
            for file in files:
                if file in excluded_files or file.endswith('.zip') or file.endswith('.tar.gz'):
                    continue
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, root_dir)
                zip_file.write(file_path, rel_path)
                
    print(f"Export zip created successfully at {output_zip} (Size: {os.path.getsize(output_zip)} bytes)")

if __name__ == '__main__':
    create_archive()
