/* flavorless
 * Main script
 */

"use strict";

const board = new Board();
const palette = new Palette();

/* Entry-point */
function main() {
  createBrushes();
}

/* Creates brushes */
function createBrushes() {
  createBrushPencil();
  createBrushEraser();
  createBrushPaintBucket();
  createBrushText();
}

/* Creates a pencil brush */
function createBrushPencil() {
  const pencil = new PencilBrush();
  addBrush(pencil);
}

/* Creates an eraser brush */
function createBrushEraser() {
  const eraser = new EraserBrush();
  addBrush(eraser);
}

/* Creates a paint bucket brush */
function createBrushPaintBucket() {
  const paintBucket = new PaintBucketBrush();
  addBrush(paintBucket);
}

/* Creates a text brush */
function createBrushText() {
  const text = new TextBrush();
  addBrush(text);
}

/* Adds a brush to the palette */
function addBrush(brush) {
  palette.addBrush(brush, board);
}

main();
