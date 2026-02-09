/* flavorless
 * Text brush script
 */

"use strict";

const WrapType = {
  NONE: "none",
  BOARD_START: "wrap-board",
  TEXT_START: "wrap-text",
};

/**
 * The text brush class
 */
class TextBrush extends Brush {
  /**
   * Text to be drawn
   * @type {string}
   */
  #text = "";

  /**
   * Wrap style
   * @type {WrapType}
   */
  #wrap = WrapType.NONE;

  /**
   * Maximum width of text
   * @type {number}
   */
  #width = 0;

  constructor() {
    super("Text");
  }

  draw(x, y, board) {
    const ORIGINAL_X = this.#wrap === WrapType.BOARD_START ? 0 : x;

    let w = 0;
    for (const c of this.#text) {
      board.putChar(x, y, c);

      ++x;
      ++w;

      if (x >= CANVAS_WIDTH) {
        if (this.#wrap === WrapType.NONE) {
          break;
        }

        y += 1;
        if (y >= CANVAS_HEIGHT) {
          break;
        }

        x = ORIGINAL_X;
        w = 0;
      } else if (this.#width > 0 && w >= this.#width) {
        if (this.#wrap === WrapType.NONE) {
          break;
        }

        y += 1;
        if (y >= CANVAS_HEIGHT) {
          break;
        }

        x = ORIGINAL_X;
        w = 0;
      }
    }

    return `drew text`;
  }

  buildPaletteElement() {
    const paletteElement = new PaletteElement(this);
    paletteElement.addStringParam("text", 32);
    paletteElement.addSelectParam("wrap", [
      paletteElement.createOption("None", WrapType.NONE),
      paletteElement.createOption("Wrap to board start", WrapType.BOARD_START),
      paletteElement.createOption("Wrap to text start", WrapType.TEXT_START),
    ]);

    paletteElement.addNumberParam("width", 0, CANVAS_WIDTH);

    return paletteElement;
  }

  setParam(key, value) {
    switch (key) {
      case "text":
        this.#text = value;
        break;
      case "wrap":
        this.#wrap = value;
        break;
      case "width":
        this.#width = value;
        break;
    }
  }
}
