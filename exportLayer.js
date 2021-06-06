// exports each layer as individual svgs, and then converts them to pngs, and finally removes the temporary svg
// example run:
//  node exportLayer.js "../../Google Drive/Team Fighting Hex Game/ActionCards.svg" "../../Google Drive/Team Fighting Hex Game/"
//  first param is the svg file, second param is the output folder location
//  must have inkscape on path

const fs = require('fs');
const child_process = require('child_process');

const fileName = process.argv[2];
const outputFolder = process.argv[3] || './';

const getStyleLineOffset = ({ layerName, lineIndex, lines }) => {
  if (!lineIndex) {
    lineIndex = lines.findIndex((line) => line.match(layerName));
  }
  for (let styleLineIndex = -3; styleLineIndex < 5; styleLineIndex++) {
    if (lines[lineIndex + styleLineIndex].match('style="display')) {
      return { finalLineIndex: lineIndex, lineOffset: styleLineIndex };
    }
  }
  return null;
};

const isLockedLayer = ({ layerName, lineIndex, lines }) => {
  if (!lineIndex) {
    lineIndex = lines.findIndex((line) => line.match(layerName));
  }
  let lineOffset = null;
  for (let styleLineIndex = -3; styleLineIndex < 5; styleLineIndex++) {
    if (
      lines[lineIndex + styleLineIndex].match('sodipodi:insensitive="true"')
    ) {
      lineOffset = styleLineIndex;
      break;
    }
  }
  return lineOffset !== null;
};

const showLayer = ({ layerName, lineIndex, lines }) => {
  const { lineOffset, finalLineIndex } = getStyleLineOffset({
    layerName,
    lineIndex,
    lines,
  });
  const newLines = [...lines];
  const styleLine = newLines[finalLineIndex + lineOffset];
  newLines[finalLineIndex + lineOffset] = styleLine.replace(
    'display:none',
    'display:inline',
  );
  return newLines;
};

/**
 * @param layerGroup - string name of layer group,
 * @param lines - lines for fileData
 *
 * @returns function that takes layer name and line index
 */
const exportLayer = (layerGroup, lines) => {
  try {
    child_process.execSync(`mkdir "${outputFolder}/${layerGroup}"`);
  } catch (error) {
    // failed to make folder, probably already exists
  }
  return ({ layer, lineIndex }) => {
    console.log('export layer', layer);
    if (!isLockedLayer({ lineIndex, lines })) {
      const newLines = showLayer({ lineIndex, lines });
      const newSvgFileName = fileName
        .split('.')
        .slice(0, -1)
        .concat(layer)
        .concat('svg')
        .join('.');
      fs.writeFileSync(`${newSvgFileName}`, newLines.join('\n'));
      child_process.exec(
        `inkscape "${newSvgFileName}" -o "${outputFolder}/${layerGroup}/${layer}.png"`,
        (err, stdout, stderr) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log(`layer : ${layer}`);
          console.log(`stdout: ${stdout}`);
          console.log(`stderr: ${stderr}`);

          // delete file after use
          child_process.execSync(`rm -f "${newSvgFileName}"`);
        },
      );
    }
  };
};

const readFileData = (err, data) => {
  if (err) {
    throw err;
  }

  const fileData = data.toString();
  const lines = fileData.split('\n');
  const regexMatch = RegExp(`(?<spacer>.*)inkscape:label="(?<layerName>.+)"`);
  let spacerTest = 0;
  let groupName = '';
  const layers = { '': [] };
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const regexResult = regexMatch.exec(lines[lineIndex]);
    if (regexResult && regexResult.groups.spacer.length === 5) {
      spacerTest = regexResult.groups.spacer.length;
      groupName = regexResult.groups.layerName;
      layers[groupName] = [];
    }
    if (regexResult && regexResult.groups.spacer.length > spacerTest) {
      layers[groupName].push({
        layer: regexResult.groups.layerName,
        lineIndex,
      });
    }
  }

  console.log(layers);

  Object.keys(layers).forEach((layerGroupName) => {
    if (layerGroupName && layers[layerGroupName].length) {
      const newLines = showLayer({ layerName: layerGroupName, lines });
      layers[layerGroupName].forEach(exportLayer(layerGroupName, newLines));
    }
  });

  // sodipodi:insensitive="true" <- locked layer
  // style="display:none" <- hidden layer
  // style="display:inline" <- shown layer
  // inkscape:groupmode="layer" <- is layer
  // inkscape:label="Fire Blast" <- layer label
};

fs.readFile(fileName, readFileData);
