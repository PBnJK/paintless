/* flavorless
 * Pencil brush script
 */

"use strict";

/**
 * The pencil brush class
 */
class PencilBrush extends Brush {
  constructor() {
    super("Pencil");
  }

  draw(x, y, board) {
    board.putChar(x, y, "█");
  }

  buildPaletteElement() {
    const paletteElement = new PaletteElement(this);
    paletteElement.addNumberParam("size", 1, 32);

    return paletteElement;
  }
}
