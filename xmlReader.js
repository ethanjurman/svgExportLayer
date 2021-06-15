import fs from 'fs';
import parser from 'xml2json';

// function find(objectParam) {
//   const key = Object.keys(objectParam)[0];
//   const value = objectParam[key];
//   if (key in this) {
//     if (this[key] === value) {
//       return this;
//     }
//   }
//   const keys = Object.keys(this);
//   return keys.find((keyItem) => this[keyItem].find(objectParam));
// }

const findInSVG = (svgJson, objectParam) => {
  const key = Object.keys(objectParam)[0];
  const value = objectParam[key];
  if (typeof svgJson !== 'object') {
    // is not object type
    return null;
  }
  if (key in svgJson) {
    if (svgJson[key] === value) {
      return svgJson;
    }
  }
  // const keys = Object.keys(svgJson);
  for (let keyItem in svgJson) {
    const childResult = findInSVG(svgJson[keyItem], objectParam);
    if (childResult) {
      return childResult;
    }
  }
};

// Object.prototype.find = find;

export const jsonFromSVG = (fileName = './inkscape-examplesvg.svg') => {
  const bufferData = fs.readFileSync(fileName);
  const jsonData = JSON.parse(parser.toJson(bufferData.toString()));
  return jsonData;
};

const svgJson = jsonFromSVG();
const element = findInSVG(svgJson, { 'inkscape:label': 'B text' });
console.log({ element });
console.log({ element, svgJson });
console.log('test');
