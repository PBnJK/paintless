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
}

/* Creates a pencil brush */
function createBrushPencil() {
  const pencil = new PencilBrush();
  addBrush(pencil);

  board.setBrush(pencil);
}

/* Creates an eraser brush */
function createBrushEraser() {
  const eraser = new EraserBrush();
  addBrush(eraser);
}

/* Adds a brush to the palette */
function addBrush(brush) {
  palette.addBrush(brush, board);
}

main();
