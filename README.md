# JigsawGenerator
A tool for generating interesting and organic jigsaw puzzle shapes. Ideal for use with a laser cutter.

The project is still in the discovery phase, and the procedural generation method is still a WIP. The current idea is to generate jittered lines and circles and place them within a cell of a voronoi diagram. From there, the idea is to section off pieces of these rows to create 4 sided pieces. Finally, the pieces need to be stitched together to fill in all the gaps and each side will recieve a randomly generated connector nib.

Another idea is to use noise (perlin, simplex, etc) to generate lines along and across the gradient of that noise. The lines get smaller and fill in more space until all the shapes have roughly the correct size, at which point the nibs are generated.

The first part of idea number 1 is complete and can be found here: https://jacobvalore.github.io/JigsawGenerator/
Here are some sample images that this can create:
![lines-sample](https://user-images.githubusercontent.com/100165696/168670855-a714a06a-e6b8-4195-a5b9-9e08ef6c4976.png)
![nolines-sample](https://user-images.githubusercontent.com/100165696/168670867-c1e98d06-265a-4a22-badc-0e37b489102b.png)

Here is a sample image for the piece shapes I am aiming for:
![81-54rTuNsL _AC_SL1000_](https://user-images.githubusercontent.com/100165696/168670649-8ae1a1a5-9359-4ad1-b624-4e40aa953cbd.jpg)
