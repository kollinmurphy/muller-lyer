#!/bin/bash

# get prefix from command line
prefix=$1

input_dir="samples-resized"
output_file="grouped-samples/$prefix.png"
padding=20 # Adjust padding as needed

# Create a temporary list of image files
file_list=$(mktemp)

# Collect all PNG files into the list
for file in "$input_dir"/$prefix*.png; do
    # if file contains "baseline" then skip
    if [[ $file == *"baseline"* ]]; then
        continue
    fi
    echo "$file" >> "$file_list"
done

# Combine images into a two-column layout with padding
magick montage -geometry +${padding}+${padding} -tile 2x @"$file_list" "$output_file"

# Clean up the temporary file
rm -f "$file_list"

echo "Combined image saved as $output_file"
