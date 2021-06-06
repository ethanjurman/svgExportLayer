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
