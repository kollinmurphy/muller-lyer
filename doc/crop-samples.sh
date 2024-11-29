#!/bin/bash

input_dir="samples"
output_dir="samples-cropped"

# Create the output directory if it doesn't exist
mkdir -p "$output_dir"

# Loop through all PNG files in the input directory
for file in "$input_dir"/*.png; do
    # Extract the filename without the directory
    filename=$(basename "$file")

    # Crop the image and save it to the output directory
    magick "$file" -trim +repage "$output_dir/$filename"
done
