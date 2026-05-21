#!/bin/bash

# SVG logo to insert
SVG_LOGO='<svg class="logo-icon" width="30" height="30" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="55" height="55" rx="12" fill="#00D563"/>
                <g transform="translate(27.5, 20)">
                    <rect x="-2" y="-10" width="4" height="20" rx="2" fill="#221C46" transform="rotate(45)"/>
                    <rect x="-2" y="-10" width="4" height="20" rx="2" fill="#221C46" transform="rotate(-45)"/>
                </g>
                <text x="27.5" y="48" text-anchor="middle" font-family="'"'"'TT Travels'"'"', Arial, sans-serif" font-size="5.5" fill="#221C46" font-weight="500" letter-spacing="0.3">mobility</text>
            </svg>'

# Update files
for file in 05-company-info.html 06-program-review.html 07-group-review.html 08-final-review.html; do
    if [ -f "$file" ]; then
        # Replace the div with class logo-icon containing ✕
        sed -i '' 's|<div class="logo-icon">✕</div>|'"$SVG_LOGO"'|g' "$file"
        echo "Updated $file"
    fi
done

echo "Logo updates complete"
