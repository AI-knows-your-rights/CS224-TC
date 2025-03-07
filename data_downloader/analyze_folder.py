import os
import yaml
import json
import argparse


def is_valid_html(file_path):
    """Check if the HTML file is valid by looking for common error codes."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
            if any(error_code in content for error_code in ["404", "503"]):
                return False
        return True
    except Exception:
        return False


def is_valid_json(file_path):
    """Check if the JSON file is valid by ensuring it is not empty."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = json.load(file)
            if not content:
                return False
        return True
    except Exception:
        return False


def count_words_in_file(file_path):
    """Count the number of words in a text file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
            return len(content.split())
    except Exception:
        return 0


def analyze_documents_folder(documents_path):
    """Analyze the documents folder for TXT files and their statistics."""
    if not os.path.exists(documents_path):
        return None

    stats = {
        'total_txt_files': 0,
        'tc_files': 0,
        'review_files': 0,
        'file_stats': []
    }

    for file in os.listdir(documents_path):
        if file.endswith('.txt'):
            stats['total_txt_files'] += 1
            file_path = os.path.join(documents_path, file)
            file_size = os.path.getsize(file_path)
            word_count = count_words_in_file(file_path)

            file_stat = {
                'name': file,
                'size_bytes': file_size,
                'word_count': word_count
            }

            if file.startswith('TC_'):
                stats['tc_files'] += 1
            elif file.startswith('REVIEW_'):
                stats['review_files'] += 1

            stats['file_stats'].append(file_stat)

    return stats


def analyze_subfolders(data_dir):
    """Analyze subfolders and documents in the given directory."""
    analysis = {
        'summary': {
            'total_subfolders': 0,
            'total_files': 0,
            'total_documents': 0
        },
        'folders': []
    }
    
    subfolders = [f.path for f in os.scandir(data_dir) if f.is_dir()]
    analysis['summary']['total_subfolders'] = len(subfolders)

    for subfolder in subfolders:
        folder_info = {
            'name': os.path.basename(subfolder),
            'files': [],
            'documents_folder': None
        }
        
        # Analyze documents folder if it exists
        documents_path = os.path.join(subfolder, 'documents')
        if os.path.exists(documents_path):
            analysis_result = analyze_documents_folder(documents_path)
            if analysis_result:
                folder_info['documents_folder'] = {
                    'total_files': analysis_result['total_txt_files'],
                    'tc_files': analysis_result['tc_files'],
                    'review_files': analysis_result['review_files'],
                    'files': analysis_result['file_stats']
                }
                analysis['summary']['total_documents'] += analysis_result['total_txt_files']
        
        # Analyze other files
        documents = [f.path for f in os.scandir(subfolder) if f.is_file()]
        analysis['summary']['total_files'] += len(documents)

        for document in documents:
            doc_info = {'name': os.path.basename(document)}
            if document.endswith('.html'):
                doc_info['valid'] = is_valid_html(document)
            elif document.endswith('.json'):
                doc_info['valid'] = is_valid_json(document)
            else:
                doc_info['valid'] = 'Unknown format'
            folder_info['files'].append(doc_info)

        analysis['folders'].append(folder_info)

    return analysis


def create_yaml_report(data_dir, output_file):
    """Create a YAML report of the analysis."""
    analysis = analyze_subfolders(data_dir)
    with open(output_file, 'w', encoding='utf-8') as file:
        yaml.dump(
            analysis,
            file,
            allow_unicode=True,
            default_flow_style=False,
            sort_keys=False,
            indent=2
        )


def main():
    parser = argparse.ArgumentParser(
        description='Analyze folders and create YAML report'
    )
    parser.add_argument('data_dir', help='Directory to analyze')
    parser.add_argument(
        '--output', '-o',
        default='folder_analysis.yaml',
        help='Output YAML file name (will be saved in the input directory)'
    )
    
    args = parser.parse_args()
    
    if not os.path.exists(args.data_dir):
        print(f"Error: Directory '{args.data_dir}' does not exist")
        return

    # Create output file path in the input directory
    output_path = os.path.join(args.data_dir, args.output)
    create_yaml_report(args.data_dir, output_path)
    print(f"Analysis complete. Report saved to {output_path}")


if __name__ == '__main__':
    main()
