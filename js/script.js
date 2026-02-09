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
  createPencilBrush();
  createEraserBrush();
  createPaintBucketBrush();
  createTextBrush();
  createStampBrush();
}

/* Creates a pencil brush */
function createPencilBrush() {
  const pencil = new PencilBrush();
  addBrush(pencil);
}

/* Creates an eraser brush */
function createEraserBrush() {
  const eraser = new EraserBrush();
  addBrush(eraser);
}

/* Creates a paint bucket brush */
function createPaintBucketBrush() {
  const paintBucket = new PaintBucketBrush();
  addBrush(paintBucket);
}

/* Creates a text brush */
function createTextBrush() {
  const text = new TextBrush();
  addBrush(text);
}

/* Creates a stamp brush */
function createStampBrush() {
  const stamp = new StampBrush();
  addBrush(stamp);
}

/* Adds a brush to the palette */
function addBrush(brush) {
  palette.addBrush(brush, board);
}

main();
