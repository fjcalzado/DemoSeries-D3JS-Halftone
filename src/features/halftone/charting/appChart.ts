import chroma from "chroma-js";
import * as d3 from "d3";

import { CreateTimer } from "../../../util";
import { LayerStack } from "../../../models/layerModel";
import * as layerManager from "./layerManager";
const styles = require("../halftoneTheme.scss");


/**
 * Local state.
 * @private
 */

// Svg main elements.
let svg = null;
let svgViewport = null;
let svgBackground = null;

// Width and Height of the svg component in relative units.
// Fit its parent by default unless a specific relative
// size is indicated from the caller.
let widthRel = "100%";
let heightRel = "100%";

// Input image.
 let srcImage: any[][] = null;

/**
 * Initialization public API. Provide a source image, a container or
 * parent node to hold the svg element as well as its width/height in
 * relative units.
 * @public
 * @function initialize
 * @param  {string} parentNode: string {Parent node to append SVG element to.}
 * @param  {string} width: string {Width of the SVG element in relative units.}
 * @param  {string} height: string {Height of the SVG element in relative units.}
 * @return {void}
 */
export function initialize(parentNode: string, width: string = widthRel, height: string = heightRel): void {
  // Component size.
  if (width) { widthRel = width; }
  if (height) { heightRel = height; }

  // Initialize SVG element.
  svg = d3.select(`.${parentNode}`)
    .append("svg")
      .attr("class", "svg")
      .attr("width", widthRel)
      .attr("height", heightRel)
      .attr("viewBox", `0 0 0 0`)
      .attr("preserveAspectRatio", "xMidYMid meet");
  svgViewport = svg.append("g")
      .attr("class", "svg-viewport");
  svgBackground = svgViewport.append("rect")
      .attr("class", "svg-background")
      .attr("fill", "rgba(255, 255, 255, 0)")
      .attr("x", 1).attr("y", 1);
}

/**
 * Set a new image to be drawn.
 * @public
 * @function setImage
 * @param  {type} sourceImage: any[][] {Source Image.}
 * @return {void}
 */
export function setImage(sourceImage: any[][]): void {
  // Clear layers and reset previous state.
  layerManager.clearLayers(svgViewport);
  layerManager.resetState();

  // Store Input image.
  srcImage = sourceImage;
  const srcImgWidth = srcImage[0].length;
  const srcImgHeight = srcImage.length;

  // Configure SVG Viewport adn SVG Background based on
  // new image dimensions.
  svg.attr("viewBox", `-1 -1 ${srcImgWidth + 2} ${srcImgHeight + 2}`);
  svgBackground.attr("width", srcImgWidth - 2).attr("height", srcImgHeight - 2);
}

/**
 * Set a background color for our viewport.
 * @function setBackgroundColor
 * @param  {any} color {Color in CSS or number format}
 * @return {void}
 */
export function setBackgroundColor(color): void {
  svgViewport.attr("fill", color);
}

/**
 * Draw halftone pattern for a given a set of layer parameters.
 * @public
 * @function draw
 * @param  {LayerStack} layers: LayerStack {Stack of layers described by its parameters.}
 * @return {Promise<boolean>} {Promise indicating if operation was succesfully completed.}
 */
export function draw(layers: LayerStack): Promise<boolean> {
  return layerManager.drawLayers(svgViewport, srcImage, layers);
}


















// ***********************************************************************
// To be removed, just for testing.
// ***********************************************************************

import { Channel } from "../../../models/channelModel";
import { DotType, DotParameters } from "../../../models/dotModel";
import { GridPatternType, GridParameters } from "../../../models/gridModel";
import { LayerParameters } from "../../../models/layerModel";

export function simulateLayerDrawing() {

  const gridParams: GridParameters = {
    pattern: GridPatternType.Square,
    targetWidth: srcImage[0].length,
    targetHeight: srcImage.length,
    scaleFactor: 1,
    //translateX: imgMatrix[0].length / 2,
    //translateY: imgMatrix.length / 2,
    rotationAngle: 0,
    specificParams: {wavelength: 30, amplitude: 5 },
  };

  const dotParams: DotParameters = {
    shape: DotType.Circle,
    sizeBinding: Channel.Lightness,
    sizeMinThreshold: 0,
    sizeMaxThreshold: 1,
    rotationAngle: 0,
    colorCustom: false,
    color: "rgb(0, 0, 243)",
  };

  const layerParams: LayerParameters = {
    name: "main",
    opacity: 1,
    zIndex: 0,
    gridParams,
    dotParams,
  };

  const layerStack1: LayerStack = [
    layerParams,
    // { ...layerParams,
    //   name: "crossblue",
    //   zIndex: 1,
    //   gridParams: {
    //     ...gridParams,
    //     rotationAngle: 15,
    //   },
    //   dotParams: {
    //     ...dotParams,
    //     shape: DotType.Cross,
    //     sizeMaxThreshold: 0.5,
    //     colorCustom: true,
    //   },
    // },
  ];

  // TODO: Handle Promise here.
  draw(layerStack1)
    .then((result) => layerManager.reportLayerDOMStatus(svgViewport));

  // const layerStack2 = layerStack1.slice(0);
  // layerStack2[0].dotParams.shape = DotType.Square;
  // layerStack2[1].zIndex = -1;

  // setTimeout(() => {
  //   layerManager.draw(svgViewport, srcImage, layerStack2)
  //   .then((result) => layerManager.reportLayerDOMStatus(svgViewport));
  // }, 6000);

  // const layerStack2 = layerStack1.map((item, i) => ({...item, zIndex: 1 - i}));
  // setTimeout(() => {
  //   layerManager.draw(svgViewport, srcImage, layerStack2)
  //   .then((result) => layerManager.reportLayerDOMStatus(svgViewport));
  // }, 4000);

  // const layerStack3 = [{...layerParams, dotParams: {...dotParams, shape: DotType.Square }}];
  // setTimeout(() => {
  //   layerManager.draw(svgViewport, srcImage, layerStack3)
  //   .then((result) => layerManager.reportLayerDOMStatus(svgViewport));
  // }, 4000);
}


// ***********************************************************************