#!/usr/bin/env python3
import re
import os

# Files to fix
files = [
    'V2/prototype/02-activate-account.html',
    'V2/prototype/04a-upload-data.html',
    'V2/prototype/06b-program-review-incomplete.html',
    'V2/prototype/07b-group-review-incomplete.html',
    'V2/prototype/08-invite-employees.html',
]

for filepath in files:
    full_path = f'/Users/thomasbarez/Desktop/Obsidian /Skipr/Onboarding/{filepath}'
    
    if not os.path.exists(full_path):
        print(f"Skipping {filepath} - file not found")
        continue
    
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace opacity-based disabled button with rgba colors
    old_disabled = r'(\s+)\.btn-primary:disabled\s*\{\s*opacity:\s*0\.5;\s*cursor:\s*not-allowed;'
    new_disabled = r'\1.btn-primary:disabled {\n\1    cursor: not-allowed;\n\1    position: relative;\n\1    background: rgba(43, 253, 127, 0.5);\n\1    color: rgba(54, 47, 84, 0.5);\n\1    border-color: rgba(43, 253, 127, 0.5);'
    
    if re.search(old_disabled, content):
        content = re.sub(old_disabled, new_disabled, content)
        
        # Add !important to tooltip opacity
        content = re.sub(
            r'(\.btn-primary:disabled:hover::after\s*\{[^}]*opacity:\s*)1;',
            r'\1 1 !important;',
            content
        )
        content = re.sub(
            r'(\.btn-primary:disabled:hover::before\s*\{[^}]*opacity:\s*)1;',
            r'\1 1 !important;',
            content
        )
        
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✓ Fixed {filepath}")
    else:
        print(f"⚠ Pattern not found in {filepath}")

print("\nDone!")
