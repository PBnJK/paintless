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
  #fillCharacter = "#";

  constructor() {
    super("Paint Bucket");
  }

  draw(x, y, board) {
    const c = board.getChar(x, y);
    const stack = [board.xyToOffset(x, y)];

    while (stack.length) {
      const n = stack.pop();
      if (board.getCharAtOffset(n) === c) {
        console.log(n);
        board.putCharAtOffset(n, this.#fillCharacter);

        stack.push(n - 1);
        stack.push(n + 1);
        stack.push(n + CANVAS_WIDTH + 1);
        stack.push(n - CANVAS_WIDTH - 1);
      }
    }
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
