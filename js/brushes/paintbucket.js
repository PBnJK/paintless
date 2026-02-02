/* flavorless
 * Paint bucket brush script
 */

"use strict";

/**
 * The Paint Bucket brush class
 */
class PaintBucketBrush extends Brush {
  /**
   * Size of the brush
   * @type {number}
   */
  #size = 0;

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

    return paletteElement;
  }

  setParam(key, value) {
    switch (key) {
      case "size":
        this.#size = value;
        break;
      case "color":
        this.#fillCharacter = value;
        break;
    }
  }
}
