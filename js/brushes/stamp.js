/* flavorless
 * Stamp brush script
 */

"use strict";

const TAU = Math.PI * 2;

const StampType = {
  CIRCLE: "circle",
  SQUARE: "square",
  STAR: "star",
};

/**
 * The stamp brush class
 */
class StampBrush extends Brush {
  /**
   * Stamp to be drawn
   * @type {StampType}
   */
  #stamp = StampType.CIRCLE;

  /**
   * Size of the stamp
   * @type {number}
   */
  #size = 1;
  /**
   * The "brush" (character)
   * @type {string}
   */
  #brush = CHAR_FULL_BLOCK;

  constructor() {
    super("Stamp");
  }

  draw(x, y, board) {
    switch (this.#stamp) {
      case StampType.CIRCLE:
        return this.#drawCircle(x, y, board);
      case StampType.SQUARE:
        return this.#drawSquare(x, y, board);
      case StampType.STAR:
        return this.#drawStar(x, y, board);
    }

    return `stamped design`;
  }

  buildPaletteElement() {
    const paletteElement = new PaletteElement(this);
    paletteElement.addNumberParam("size", 1, 32);
    paletteElement.addSelectParam("stamp", [
      paletteElement.createOption("Circle", StampType.CIRCLE),
      paletteElement.createOption("Square", StampType.SQUARE),
      paletteElement.createOption("Star", StampType.STAR),
    ]);
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
        this.#size = parseInt(value);
        break;
      case "stamp":
        this.#stamp = value;
        break;
      case "brush":
        this.#brush = value;
        break;
    }
  }

  /* Draws a circle shape */
  #drawCircle(x, y, board) {
    const r = Math.floor(this.#size / 2);
    let t1 = r / 16;
    let ox = r;
    let oy = 0;

    while (ox >= oy) {
      board.putChar(ox + x, oy + y, this.#brush);
      board.putChar(ox + x, y - oy, this.#brush);

      board.putChar(x - ox, oy + y, this.#brush);
      board.putChar(x - ox, y - oy, this.#brush);

      board.putChar(oy + x, ox + y, this.#brush);
      board.putChar(oy + x, y - ox, this.#brush);

      board.putChar(x - oy, ox + y, this.#brush);
      board.putChar(x - oy, y - ox, this.#brush);

      ++oy;

      t1 += oy;
      const t2 = t1 - ox;
      if (t2 >= 0) {
        t1 = t2;
        --ox;
      }
    }

    return "stamped circle";
  }

  /* Draws a square shape */
  #drawSquare(x, y, board) {
    const length = this.#size;
    const r = Math.floor(length / 2);

    let ox = x - r;
    let oy = y - r / 2;

    const callback = (lx, ly) => {
      board.putChar(lx, ly, this.#brush);
    };

    board.putLine(ox, oy, ox + length, oy, callback);
    ox += length;

    board.putLine(ox, oy, ox, oy + r, callback);
    oy += r;

    board.putLine(ox, oy, ox - length, oy, callback);
    ox -= length;

    board.putLine(ox, oy, ox, oy - r, callback);
    oy -= r;

    return "stamped square";
  }

  /* Draws a star shape
   *
   * Star math taken from here:
   *   https://archive.p5js.org/examples/form-star.html
   */
  #drawStar(x, y, board) {
    console.log("hi oh dee o ram no lie");
    const r2 = this.#size / 2.0;
    const r1 = r2 / 2.0;

    const angle = TAU / 5.0;
    const halfAngle = angle / 4.0;

    let oldX = -1;
    let oldY = -1;

    for (let a = -halfAngle / 2.0; a < TAU; a += angle) {
      const sx1 = Math.floor(x + Math.cos(a) * r2);
      const sy1 = Math.floor(y + Math.sin(a) * r2);

      const sx2 = Math.floor(x + Math.cos(a + halfAngle) * r1);
      const sy2 = Math.floor(y + Math.sin(a + halfAngle) * r1);

      if (oldX > -1) {
        board.putLine(oldX, oldY, sx1, sy1, (lx, ly) => {
          board.putChar(lx, ly, this.#brush);
        });
      }

      board.putLine(sx1, sy1, sx2, sy2, (lx, ly) => {
        board.putChar(lx, ly, this.#brush);
      });

      oldX = sx2;
      oldY = sy2;
    }

    return "stamped star";
  }
}
