#!/bin/bash

# get prefix from command line
input_dir="samples-resized"
output_file="grouped-samples/baseline.png"
padding=20 # Adjust padding as needed

# Create a temporary list of image files
file_list=$(mktemp)

# Collect all PNG files into the list
for file in "$input_dir"/*.png; do
    # if file contains "baseline" then skip
    if [[ $file == *"baseline"* ]]; then
        echo "$file" >> "$file_list"
    fi
done

# reverse the order of file_list to put the vertical configuration first
tac "$file_list" > "$file_list.tmp"
mv "$file_list.tmp" "$file_list"

# Combine images into a two-column layout with padding
magick montage -geometry +${padding}+${padding} -tile 2x @"$file_list" "$output_file"

# Clean up the temporary files
rm -f "$file_list"
rm -f "$file_list.tmp"

echo "Combined image saved as $output_file"
