#!/bin/bash

input_dir="samples-cropped"
output_dir="samples-resized"

width=300
height=115

mkdir -p "$output_dir"

for file in "$input_dir"/*.png; do
    filename=$(basename "$file")
    magick "$file" -gravity Center -background transparent -extent ${width}x${height} "$output_dir/$filename"
done

# magick input.png -gravity Center -background transparent -extent WIDTHxHEIGHT output.png
