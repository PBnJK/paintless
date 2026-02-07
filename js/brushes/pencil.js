/* flavorless
 * Pencil brush script
 */

"use strict";

const CHAR_LIGHT_SHADE = "\u2591"; /* ░ */
const CHAR_MEDIUM_SHADE = "\u2592"; /* ▒ */
const CHAR_DARK_SHADE = "\u2593"; /* ▓ */
const CHAR_FULL_BLOCK = "\u2588"; /* █ */

/**
 * The pencil brush class
 */
class PencilBrush extends Brush {
  /**
   * Size of the brush
   * @type {number}
   */
  #size = 0;

  /**
   * The "brush" (character)
   * @type {string}
   */
  #brush = CHAR_FULL_BLOCK;

  constructor() {
    super("Pencil");
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

        board.putChar(actualX, actualY, this.#brush);
      }
    }
  }

  buildPaletteElement() {
    const paletteElement = new PaletteElement(this);
    paletteElement.addNumberParam("size", 1, 32);
    paletteElement.addColorPickerParam(
      "brush",
      [CHAR_FULL_BLOCK, CHAR_DARK_SHADE, CHAR_MEDIUM_SHADE, CHAR_LIGHT_SHADE],
      true,
    );

    return paletteElement;
  }

  setParam(key, value) {
    switch (key) {
      case "size":
        this.#size = value;
        break;
      case "brush":
        this.#brush = value;
        break;
    }
  }
}
