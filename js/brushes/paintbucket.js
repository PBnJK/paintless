/* flavorless
 * Paint bucket brush script
 */

"use strict";

/**
 * The Paint Bucket brush class
 */
class PaintBucketBrush extends Brush {
  /**
   * Fill character
   * @type {string}
   */
  #fillCharacter = CHAR_FULL_BLOCK;

  constructor() {
    super("Paint Bucket");
  }

  draw(x, y, board) {
    const c = board.getChar(x, y);
    if (c === this.#fillCharacter) {
      return "nothing to fill";
    }

    const stack = [board.xyToOffset(x, y)];

    let replaceNumber = 0;

    while (stack.length) {
      const n = stack.pop();
      if (board.getCharAtOffset(n) === c) {
        board.putCharAtOffset(n, this.#fillCharacter);
        ++replaceNumber;

        const left = n - 1;
        if (left >= 0) {
          stack.push(left);
        }

        const right = n + 1;
        if (right <= MAX_OFFSET) {
          stack.push(right);
        }

        const above = n - CANVAS_WIDTH - 1;
        if (above >= 0) {
          stack.push(above);
        }

        const below = n + CANVAS_WIDTH + 1;
        if (below <= MAX_OFFSET) {
          stack.push(below);
        }
      }
    }

    return `filled ${replaceNumber} '${c}' characters with '${this.#fillCharacter}' characters`;
  }

  buildPaletteElement() {
    const paletteElement = new PaletteElement(this);
    paletteElement.addNumberParam("size", 1, 32);
    paletteElement.addColorPickerParam(
      "color",
      [CHAR_FULL_BLOCK, CHAR_DARK_SHADE, CHAR_MEDIUM_SHADE, CHAR_LIGHT_SHADE],
      true,
    );

    return paletteElement;
  }

  setParam(key, value) {
    switch (key) {
      case "color":
        this.#fillCharacter = value;
        break;
    }
  }
}
