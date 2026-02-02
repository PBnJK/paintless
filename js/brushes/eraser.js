/* flavorless
 * Eraser brush script
 */

"use strict";

/**
 * The eraser brush class
 */
class EraserBrush extends Brush {
  /**
   * Size of the brush
   * @type {number}
   */
  #size = 0;

  constructor() {
    super("Eraser");
  }

  draw(x, y, board) {
    const dy = Math.floor(this.#size / 2.0);
    const dx = dy * 2.0;

    for (let px = x - dx; px <= x + dx; ++px) {
      for (let py = y - dy; py <= y + dy; ++py) {
        const actualX = Math.floor(px);
        if (actualX < 0 || actualX >= CANVAS_WIDTH) {
          continue;
        }

        const actualY = Math.floor(py);
        if (actualY < 0 || actualY >= CANVAS_HEIGHT) {
          continue;
        }

        board.putChar(actualX, actualY, " ");
      }
    }
  }

  buildPaletteElement() {
    const paletteElement = new PaletteElement(this);
    paletteElement.addNumberParam("size", 1, 32);

    return paletteElement;
  }

  setParam(key, value) {
    switch (key) {
      case "size":
        this.#size = value;
    }
  }
}
