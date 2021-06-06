# svgExportLayer

Takes an inkscape file and export pngs based on layers / folders

exports each layer as individual svgs, and then converts them to pngs, and
finally removes the temporary svg

example run:

```
node exportLayer.js "./inkscape-examplesvg.svg" "./"
```

- first param is the svg file, second param is the output folder location
- must have inkscape on path to work

Make sure to have each individual layer folder to be hidden and make sure to **lock and have visible** any layers that you want to show on sub folders


![image](https://user-images.githubusercontent.com/1131494/120931808-3c71a280-c6c1-11eb-812b-0eeb0edb3af6.png)

The fixed layers here are designs we want shown on each of the other layers... like so:

A FIXED | B FIXED
--- | ---
![image](https://user-images.githubusercontent.com/1131494/120932039-2fa17e80-c6c2-11eb-8596-e1051b5aae82.png) | ![image](https://user-images.githubusercontent.com/1131494/120932026-257f8000-c6c2-11eb-9c0d-ecb939ddbb06.png)



In the end you should end up with each of these images

A 1 | A 2 | B 1 | B 2
--- | --- | --- | ---
![A 1](https://user-images.githubusercontent.com/1131494/120931908-96726800-c6c1-11eb-9eb4-459ae9482d08.png) | ![A 2](https://user-images.githubusercontent.com/1131494/120931909-96726800-c6c1-11eb-94e7-7ba3cd3fc55c.png) | ![B 1](https://user-images.githubusercontent.com/1131494/120931913-9ecaa300-c6c1-11eb-9438-68128c325afe.png) | ![B 2](https://user-images.githubusercontent.com/1131494/120931914-9ecaa300-c6c1-11eb-80bc-53c2af394a20.png)

and they should be in folders like so 
![image](https://user-images.githubusercontent.com/1131494/120931926-aee28280-c6c1-11eb-80b0-f5443dc81174.png)


Afterwards, if you need to say _tile these images for Tabletop sim_ ... just install imagemagick to path and do:
```
magick montage */*.png -geometry +0+0 -background none -tile 10x7 out.png
```
