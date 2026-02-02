/* flavorless
 * Drawing board script
 */

"use strict";

const CANVAS_WIDTH = 288;
const CANVAS_HEIGHT = 48;

/**
 * The main drawing board class
 *
 * Wrangles all of the image data & painting functionality together
 */
class Board {
  /**
   * The main board pre tag
   * @type {HTMLPreElement}
   */
  #board = null;

  /**
   * Selection inside the pre tag
   * @type {Selection}
   */
  #boardSelection = null;

  /**
   * Image data, as an array of characters
   * @type {string[]}
   */
  #data = [];

  /**
   * Width of a single monospaced character inside a pre tag
   * @type {number}
   */
  #charWidth = 0;

  /**
   * Height of a single monospaced character inside a pre tag
   * @type {number}
   */
  #charHeight = 0;

  /**
   * If we're currently drawing
   * @type {boolean}
   */
  #isDrawing = false;

  /**
   * Old X-coordinate for continuous drawing
   * @type {number}
   */
  #oldX = 0;

  /**
   * Old Y-coordinate for continuous drawing
   * @type {number}
   */
  #oldY = 0;

  /**
   * The current brush
   * @type {Brush}
   */
  #brush = null;

  constructor() {
    this.#initBoard();
  }

  /**
   * Puts a character at a given coordinate
   *
   * @param {number} x X-coordinate
   * @param {number} y Y-coordinate
   * @param {string} char Character used for drawing
   */
  putChar(x, y, char) {
    this.#data[this.xyToOffset(x, y)] = char;
  }

  /**
   * Puts a character at the given offset
   *
   * @param {number} offset Offset
   * @param {string} char Character used for drawing
   */
  putCharAtOffset(offset, char) {
    return (this.#data[offset] = char);
  }

  /**
   * Returns the character at the given coordinate
   *
   * @param {number} x X-coordinate
   * @param {number} y Y-coordinate
   * @returns {string}
   */
  getChar(x, y) {
    return this.#data[this.xyToOffset(x, y)];
  }

  /**
   * Returns the character at the given offset
   *
   * @param {number} offset Offset
   * @returns {string}
   */
  getCharAtOffset(offset) {
    return this.#data[offset];
  }

  /**
   * Converts an XY coordinate to an offset into the data array
   *
   * @param {number} x X-coordinate
   * @param {number} y Y-coordinate
   * @returns {number} Offset
   */
  xyToOffset(x, y) {
    return x + y * CANVAS_WIDTH + y;
  }

  /**
   * "Blits" the board data to the webpage
   */
  blit() {
    this.#board.innerText = this.#data.join("");
  }

  /**
   * Draws a line using the Bresenham line algorithm
   *
   * @param {number} x1 Starting point X-coordinate
   * @param {number} y1 Starting point Y-coordinate
   * @param {number} x2 Ending point X-coordinate
   * @param {number} y2 Ending point Y-coordinate
   */
  putLine(x1, y1, x2, y2) {
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;

    let error = dx + dy;
    while (true) {
      this.#brush.draw(x1, y1, this);

      const epsilon = 2 * error;
      if (epsilon >= dy) {
        if (x1 == x2) {
          break;
        }

        error += dy;
        x1 += sx;
      }
      if (epsilon <= dx) {
        if (y1 == y2) {
          break;
        }

        error += dx;
        y1 += sy;
      }
    }
  }

  /**
   * Clears the board
   */
  clear() {
    this.#data = [];
    for (let j = 0; j < CANVAS_HEIGHT; ++j) {
      for (let i = 0; i < CANVAS_WIDTH; ++i) {
        this.#data.push(" ");
      }

      if (j < CANVAS_HEIGHT - 1) {
        this.#data.push("\n");
      }
    }

    this.blit();
  }

  /**
   * Sets the current brush;
   * @param {Brush} brush
   */
  setBrush(brush) {
    this.#brush = brush;
  }

  /**
   * Returns the image dimensions
   * @returns {Array<number>}
   */
  getDimensions() {
    return [this.#board.offsetWidth, this.#board.offsetHeight];
  }

  /**
   * Returns the board data
   * @returns {string[]}
   */
  getData() {
    return this.#data;
  }

  /* Initializes the drawing board */
  #initBoard() {
    this.#board = document.getElementById("board");
    this.#boardSelection = document.getSelection();

    this.clear();

    /* Calculate the dimensions of a single character (monospace font) */
    this.#charWidth = this.#board.offsetWidth / CANVAS_WIDTH;
    this.#charHeight = this.#board.offsetHeight / CANVAS_HEIGHT;

    /* Hack to disable text selection */
    document.addEventListener("selectionchange", (e) => {
      this.#boardSelection.removeAllRanges();
      return false;
    });

    this.#board.addEventListener("mousemove", (e) => {
      if (this.#isDrawing) {
        const x = Math.floor(e.offsetX / this.#charWidth);
        const y = Math.floor(e.offsetY / this.#charHeight);

        this.putLine(this.#oldX, this.#oldY, x, y);
        this.blit();

        this.#oldX = x;
        this.#oldY = y;
      }
    });

    this.#board.addEventListener("mousedown", (e) => {
      this.#isDrawing = true;
      this.#oldX = Math.floor(e.offsetX / this.#charWidth);
      this.#oldY = Math.floor(e.offsetY / this.#charHeight);

      this.#brush.draw(this.#oldX, this.#oldY, this);
      this.blit();

      return false;
    });

    this.#board.addEventListener("mouseup", (e) => {
      this.#isDrawing = false;
    });

    this.#board.addEventListener("mouseleave", (e) => {
      this.#isDrawing = false;
    });
  }
}
