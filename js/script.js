/* flavorless
 * Main script
 */

"use strict";

const board = new Board();
const palette = new Palette();

/* Entry-point */
function main() {
  hookButtons();
  createBrushes();
}

/* Hooks up button events */
function hookButtons() {
  hookButtonClear();
}

/* Hooks up clear board button */
function hookButtonClear() {
  const buttonClear = document.getElementById("btn-clear-board");
  buttonClear.addEventListener("click", () => {
    board.clear();
  });
}

/* Creates brushes */
function createBrushes() {
  createBrushPencil();
  createBrushEraser();
  createBrushPaintBucket();
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

/* Adds a brush to the palette */
function addBrush(brush) {
  palette.addBrush(brush, board);
}

main();
