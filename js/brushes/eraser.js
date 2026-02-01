/* flavorless
 * Eraser brush script
 */

"use strict";

/**
 * The eraser brush class
 */
class EraserBrush extends Brush {
  constructor() {
    super("Eraser");
  }

  draw(x, y, board) {
    board.putChar(x, y, " ");
  }

  buildPaletteElement() {
    const paletteElement = new PaletteElement(this);
    paletteElement.addNumberParam("size", 1, 32);

    return paletteElement;
  }
}
