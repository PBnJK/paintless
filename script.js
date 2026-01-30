/* flavorless
 * Main script
 */

const CANVAS_WIDTH = 288;
const CANVAS_HEIGHT = 48;

/**
 * The main drawing board class
 *
 * Wrangles all of the image data & painting functionality together
 */
class Board {
  /** @type {HTMLPreElement} */
  #board = null;

  /** @type {Selection} */
  #boardSelection = null;

  /** @type {string[]} */
  #data = [];

  /** @type {number} */
  #charWidth = 0;

  /** @type {number} */
  #charHeight = 0;

  /** @type {boolean} */
  #isDrawing = false;

  /** @type {number} */
  #oldX = 0;

  /** @type {number} */
  #oldY = 0;

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
    this.#data[x + y * CANVAS_WIDTH + y] = char;
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
   * @param {string} char Character used for drawing
   */
  putLine(x1, y1, x2, y2, char) {
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;

    let error = dx + dy;
    while (true) {
      this.putChar(x1, y1, char);

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

  /* Initializes the drawing board */
  #initBoard() {
    this.#board = document.getElementById("board");
    this.#boardSelection = document.getSelection();

    /* Initialize with all blank spots */
    for (let j = 0; j < CANVAS_HEIGHT; ++j) {
      for (let i = 0; i < CANVAS_WIDTH; ++i) {
        this.#data.push(" ");
      }

      if (j < CANVAS_HEIGHT - 1) {
        this.#data.push("\n");
      }
    }

    this.blit();

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

        this.putLine(this.#oldX, this.#oldY, x, y, "█");
        this.blit();

        this.#oldX = x;
        this.#oldY = y;
      }
    });

    this.#board.addEventListener("mousedown", (e) => {
      this.#isDrawing = true;
      this.#oldX = Math.floor(e.offsetX / this.#charWidth);
      this.#oldY = Math.floor(e.offsetY / this.#charHeight);

      this.putChar(this.#oldX, this.#oldY, "█");
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

/* Entry-point */
function main() {
  const board = new Board();
}

main();
