#!/usr/bin/env python3
import re
import os

# Tooltip CSS to add
tooltip_css = """        .btn-primary:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            position: relative;
        }

        .btn-primary:disabled::after {
            content: attr(data-validation-message);
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-bottom: 8px;
            padding: 12px 16px;
            background: #463F5F;
            color: white;
            border-radius: 8px;
            font-family: 'TT Travels', sans-serif;
            font-size: 13px;
            font-weight: 400;
            line-height: 1.5;
            white-space: nowrap;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            pointer-events: none;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s, visibility 0.2s;
        }

        .btn-primary:disabled:hover::after {
            opacity: 1;
            visibility: visible;
        }

        .btn-primary:disabled::before {
            content: '';
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-bottom: 2px;
            border: 6px solid transparent;
            border-top-color: #463F5F;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s, visibility 0.2s;
        }

        .btn-primary:disabled:hover::before {
            opacity: 1;
            visibility: visible;
        }"""

# Files to process
files = [
    'V2/prototype/05-company-info.html',
    'V2/prototype/05b-company-info-incomplete.html',
    'V2/prototype/06-program-review.html',
    'V2/prototype/06b-program-review-incomplete.html',
    'V2/prototype/07-group-review.html',
    'V2/prototype/07b-group-review-incomplete.html',
]

for filepath in files:
    full_path = f'/Users/thomasbarez/Desktop/Obsidian /Skipr/Onboarding/{filepath}'

    if not os.path.exists(full_path):
        print(f"Skipping {filepath} - file not found")
        continue

    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if already has the tooltip CSS
    if 'data-validation-message' in content:
        print(f"Skipping {filepath} - already has tooltips")
        continue

    # Find and replace the simple disabled state with tooltip version
    old_pattern = r'(\s+)\.btn-primary:disabled\s*\{\s*opacity:\s*0\.5;\s*cursor:\s*not-allowed;\s*\}'

    if re.search(old_pattern, content):
        content = re.sub(old_pattern, tooltip_css, content)

        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✓ Updated {filepath}")
    else:
        print(f"⚠ Could not find pattern in {filepath}")

print("\nDone!")
