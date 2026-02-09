/* flavorless
 * Drawing board script
 */

"use strict";

const CANVAS_WIDTH = 288;
const CANVAS_HEIGHT = 48;
const MAX_OFFSET =
  CANVAS_WIDTH - 1 + (CANVAS_HEIGHT - 1) * CANVAS_WIDTH + (CANVAS_HEIGHT - 1);

const UNDO_STACK_SIZE = 32;

const DEFAULT_DRAWING = `                                                                                        ██████░░░░░░░░░░███    ▒▒▒▒▒    █████████████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█████                                                                                 
                                                                                     ████░░░░░░░░░░░░░░░░░███      ██████       ▒                  █░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████                                                                              
                                                                                  ████░░░░░░░░░░░░░░░░░░░░░░██  ████ ▒▒▒      ███████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████                                                                           
                                                                               ████░░░░░░░░░░░░░░░░░░░░░░░░░░████      ▒  █████                     ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░███                                                                         
                                                                             ███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░███      ████                            ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░███                                                                       
                                                                            ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░███  ███                  ███████       ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██                                                                      
                                                                          ███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████                  ███     ██       █░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██                                                                     
                                                                         ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██                                   ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██                                                                    
                       ▒▒▒▒▒▒▒▒   ▒▒▒▒▒▒▒▒▒▒▒                           ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██                                    █░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░███                █           █                                     
                     ▒▒▒      ▒▒▒▒▒         ▒▒▒▒▒▒▒▒▒▒                ███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██                                     █░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██               █    ███   ██         ███                         
            ▒▒▒▒▒▒▒▒▒▒                       ▒▒      ▒▒               █░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█                                     ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█               ██  ██ █████  ██ ███  ███     ██    █             
           ▒▒                                         ▒              ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█                      ████           █░░███████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██               ████         █    █    ███ █████ ███             
           ▒                                          ▒▒▒▒▒▒        ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█                         ████████    ████     █░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██                           ██████      ███   ███               
           ▒      note: quality of drawing is not          ▒▒       █░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█                                              █░░░░░░░░░░░░░░░░░░░░░░████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█                                                               
          ▒▒▒▒    demonstrative of the tool's full      ▒▒▒▒▒     ███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██                                        █    █░░░░░░░░░░░░░░░░░░░░░░█  ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██                                                              
        ▒▒▒       capabilities due to the programm        ▒▒      █░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█                                             █░░░░░░░░░░░░░░░░░███████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█                                                              
       ▒▒         er's total inability to draw             ▒▒    ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██                          ███               █░░░░░░░░░░░░░█████░░░░░░░░░░░░░████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█                                                              
       ▒                                                    ▒   ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░███                          ██     ██      ██░░░░░░░░░░████░░░░░░░░░░░░░░░░░░░░████░░░░░░░░░░░░░░░░░░░░░░░░░░█                                                              
       ▒▒                                              ▒  ▒▒▒   █░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██                          ███████     ███░░░░░░░░████░░░░░░░░░░░░░░░░░░░░░░░░░░████░░░░░░░░░░░░░░░░░░░░░░░█                                                              
        ▒▒▒   ▒▒▒                             ▒▒▒     ▒▒        █░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█                                    ███░░░░░░░░███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░███░░░░░░░░░░░░░░░░░░░░░█                                                              
          ▒▒▒▒▒ ▒▒▒         ▒▒▒▒▒          ▒▒▒▒ ▒▒▒▒▒▒▒         █░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█                                 ████░░░░░░░░███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░███░░░░░░░░░░░░░░░░░░░█                                                              
                  ▒▒▒▒▒▒▒▒▒▒▒   ▒▒▒▒▒▒▒▒▒▒▒▒                    █░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█                   ███        █████░░░░░░░░███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██░░░░░░░░░░░░░░░░░░█         cool!                                                
                                                                █░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█                   ▒▒██████████░░░░░░░░░░░██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██░░░░░░░░░░░░░░░░░█         ccool!                     cool!                     
                                                                █░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█                    ▒▒▒▒▒███░░░░░░░░░░░████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░███████░░░░░░░░░░░░██         cool!        ccool!      ccool!                     
                                                                █░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█                     ▒▒▒▒▒▒█░░░░░░░░░░█  ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░█████████████   ██░░░░░░░░░░░░░█         ccool!      ccccool!     cool!                      
                                                                █░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██                         ▒▒██░░░░░░░░░██        █████████████████████████████              ██░░░░░░░░░░░░░░█          ccool!    ccooccool!   ccool!                      
                                                                █░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█                             █░░░░░░░░░░████████            █████████████████           █████░░░░░░░░░░░░░░░█           cccool!cccool!ccool!cccool!                       
                                                                █░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██                             ██░░░░░░░░░░░░░░░░██████████████   █   ███  ██ █████████████░░░░░░░░░░░░░░░░░░░█             ccccccool!   ccccccool!                         
                                                                ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██                               █░░░░░░░░░░░░░░░░░░░░░░░░░█ █████ █     ████   █░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█                                                             
                                                                 █░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████████                            ██░░░░░░░░░░░░░░░░░░░░░░░░█     ███            █░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█                                                             
                                                                 ████░░░░░░░░░░██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██      ██████████           ████████ █░░░░░░░░██░░░░░░░░░░░░░░█                    █░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█                       cool!!                                
                                                               ██▒▒▒▒▒███████████░░░░░░░░░░░░░░░░███░░░░░░░░░░██                ███████████   ████████████████ ██░░░░░░░░░░░░░█                    █░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██                     cool!!cool!!!!!!!!!                     
                                                               █▒▒▒▒▒▒▒▒▒▒▒▒▒▒██████████░░░░░░████████████░░█████        ████             ███████▒▒▒▒▒▒▒██      ██░░░░░░░░░░░░█                    █░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█                     cool!!         cool!!                    
                                                               █▒▒▒▒▒▒▒▒▒▒▒▒▒▒███ ██▒▒██░░░░░░█▒▒▒▒▒▒▒▒▒█████▒▒▒█████   ██▒▒█    ████████     █▒▒▒▒▒▒▒▒▒▒█       ██░░░██░░░░░░█                    █░░░░░░░░░░░░░░░░░░░░░░░░░░░░██                     cool!           cool!                    
                                                               █▒▒▒▒▒▒███████████ █▒▒▒██░░░░░░█▒▒▒▒▒▒▒▒▒██ ██▒▒▒██  █████▒▒██   ██▒▒▒▒▒▒███   █▒▒▒████▒▒▒█    ██████░░██░░░░░░█                    █░░░░░░░░░░░░░░░░░░░░░░░░░░░░█                      cccool!        ccool!                    
                                                                █▒▒▒▒▒▒█████████  █▒▒▒██░░░░░░█▒▒████▒▒▒▒█  ██▒▒▒██   ███▒█████████▒▒▒▒▒▒▒█████▒▒▒▒▒▒▒▒▒██ ████     ███░░░░░░░██████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░█                        ccccccccccccccool!                     
                                                                █▒▒▒▒▒▒▒▒▒▒▒▒███  █▒▒▒██░░░░░░█▒▒▒▒██▒▒▒▒█   ██▒▒▒█  ██▒▒▒█   ██▒▒▒███▒▒▒▒▒█  █▒▒▒▒▒████████       ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██                                                               
                                                                █▒▒▒▒▒▒▒▒▒▒▒▒███  █▒▒▒██░░░░░░██▒▒▒▒▒▒▒▒▒██   █▒▒▒████▒▒▒██   █▒▒▒▒▒▒█▒▒▒▒▒█  █▒▒▒▒▒███           ██░░░░░░░░░░░░░░░░░░░░░███████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██                                                                
                                                                █▒▒▒▒▒▒█████████  █▒▒▒██████████▒▒█████▒▒▒██  ██▒▒▒▒▒▒▒▒██    █▒▒▒▒▒▒▒▒▒▒▒██  █▒▒███▒▒███       ███░░░░░██████████░░░░████░░░░░█░░░░░░██████░░░░░░░░░░░░░░░░░██                                                                 
                                                                ██▒▒▒█▒███        █▒▒▒▒▒▒▒▒▒██ █▒▒█   █▒▒▒▒██  ██▒▒▒▒▒▒▒█     ███▒▒▒▒▒█████  ██▒▒█ ███▒▒███    ██░░░░░░██░░░░░░░░█░░░░█░░░░░░░░░░░░░░░██░░░░░░░░░░░░░░░░░░░░░█                                                                  
                                                                ██▒▒▒▒▒▒███       █▒▒▒▒▒▒▒████ ████   ███████   █████████       ███████      █████  ███████   ██░░░░░░░███████████░░░░████████████░░░░░█████████░░░░░░░░░░░░██                      ccool!                   ccool!             
                                                                 ███▒▒▒▒▒██       ████████████                                                               ██░░░░░░░██░░░░░░░░░░░░██           ████░░░░░░░░░██░░░░░░░░░░░██                        ccool!    ccccool!     ccool!              
                                                                  ████████                                                                                  ██░░░░░░░░███░░░░░░░░░███    ██      ██  ██████████░░░░░░░░░░░██                          cccool!cccoocccool! cccool!               
                                                                                                                                                             ██░░░░░██  ███████████       ████████                █░░░░░░██                             ccccccool!  ccoolccool!                 
                                                                                                                                                              ███████                                                 ░███                               ccool!      cccccool!                  
                                                                                                                                                                                                                      ██                                                                        
                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                
`;

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
   * Mouse X position
   * @type {number}
   */
  #mouseX = 0;

  /**
   * Mouse Y position
   * @type {number}
   */
  #mouseY = 0;

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
   * Board info display
   * @type {HTMLSpanElement}
   */
  #boardInfo = null;

  /**
   * Old board info message
   * @type {string}
   */
  #oldBoardInfoMessage = null;

  /**
   * The undo button
   * @type {HTMLButtonElement}
   */
  #undoButton = null;

  /**
   * The redo button
   * @type {HTMLButtonElement}
   */
  #redoButton = null;

  /**
   * Undo stack
   * @type {string[][]}
   */
  #undoStack = null;

  /**
   * Undo stack pointer
   * @type {number}
   */
  #undoStackPointer = 0;

  /**
   * Occupied size of the undo stack
   * @type {number}
   */
  #undoStackSize = 0;

  /**
   * The current brush
   * @type {Brush}
   */
  #brush = null;

  constructor() {
    this.#initBoard();
    this.#initClear();
    // this.#initUndoRedo();
    this.#initSave();
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
    const offset = x + y * CANVAS_WIDTH + y;
    if (offset > MAX_OFFSET) {
      return MAX_OFFSET;
    }

    if (offset < 0) {
      return 0;
    }

    return offset;
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

    this.#boardInfo = document.getElementById("board-info");

    this.#data = DEFAULT_DRAWING.split("");
    this.blit();

    /* Calculate the dimensions of a single character (monospace font) */
    this.#charWidth = this.#board.offsetWidth / CANVAS_WIDTH;
    this.#charHeight = this.#board.offsetHeight / CANVAS_HEIGHT;

    /* Hack to disable text selection */
    document.addEventListener("selectionchange", () => {
      this.#boardSelection.removeAllRanges();
      return false;
    });

    this.#board.addEventListener("mousemove", (e) => {
      this.#mouseX = Math.floor(e.offsetX / this.#charWidth);
      this.#mouseY = Math.floor(e.offsetY / this.#charHeight);
      this.#updateBoardInfo();

      if (this.#isDrawing) {
        this.putLine(this.#oldX, this.#oldY, this.#mouseX, this.#mouseY);
        this.blit();

        this.#oldX = this.#mouseX;
        this.#oldY = this.#mouseY;
      }
    });

    this.#board.addEventListener("mousedown", (e) => {
      this.#isDrawing = true;
      this.#oldX = Math.floor(e.offsetX / this.#charWidth);
      this.#oldY = Math.floor(e.offsetY / this.#charHeight);

      const msg = this.#brush.draw(this.#oldX, this.#oldY, this);
      this.blit();

      if (msg) {
        this.#updateBoardInfo(msg);
      }

      return false;
    });

    this.#board.addEventListener("mouseup", () => {
      this.#saveState();
      this.#isDrawing = false;
    });

    this.#board.addEventListener("mouseleave", () => {
      this.#isDrawing = false;
    });
  }

  /* Initializes the clear button */
  #initClear() {
    const clearButton = document.getElementById("btn-clear-board");
    clearButton.addEventListener("click", () => {
      this.#updateBoardInfo("cleared screen");
      this.clear();
    });
  }

  /* Initializes the undo-redo system */
  #initUndoRedo() {
    this.#undoStack = new Array(UNDO_STACK_SIZE);

    this.#undoButton = document.getElementById("btn-undo-board");
    this.#redoButton = document.getElementById("btn-redo-board");
    this.#saveState();

    this.#undoButton.disabled = true;
    this.#redoButton.disabled = true;

    this.#undoButton.addEventListener("click", () => {
      if (this.#undoStackPointer === 0) {
        this.#updateBoardInfo("nothing to undo!");
        return;
      }

      this.#data = this.#undoStack[--this.#undoStackPointer];
      this.blit();

      console.log(
        "undo",
        this.#undoStackPointer,
        this.#undoStackSize,
        this.#undoStack,
      );
      if (this.#undoStackPointer === 0) {
        this.#undoButton.disabled = true;
      }

      this.#redoButton.disabled = false;
    });

    this.#redoButton.addEventListener("click", () => {
      if (this.#undoStackPointer === this.#undoStackSize) {
        this.#updateBoardInfo("nothing to redo!");
        return;
      }

      this.#data = this.#undoStack[this.#undoStackPointer++];
      this.blit();

      console.log(
        "redo",
        this.#undoStackPointer,
        this.#undoStackSize,
        this.#undoStack,
      );
      if (this.#undoStackPointer === this.#undoStackSize) {
        this.#redoButton.disabled = true;
      }

      this.#undoButton.disabled = false;
    });
  }

  /* Initializes the save system */
  #initSave() {
    const saveButton = document.getElementById("btn-save-board");

    saveButton.addEventListener("click", () => {
      const link = document.createElement("a");
      link.setAttribute("download", "image.txt");
      link.href = this.#createSaveTextFile();
      document.body.appendChild(link);

      window.requestAnimationFrame(() => {
        link.click();
        link.remove();
      });
    });
  }

  #createSaveTextFile() {
    const blob = new Blob([this.#data.join("")], { type: "text/plain" });
    const textFile = window.URL.createObjectURL(blob);

    return textFile;
  }

  /* Updates the board info line */
  #updateBoardInfo(boardInfoMessage) {
    let msg = `X ${this.#mouseX}, Y ${this.#mouseY} | `;
    if (boardInfoMessage) {
      msg += boardInfoMessage;
      this.#oldBoardInfoMessage = boardInfoMessage;
    } else if (this.#oldBoardInfoMessage) {
      msg += this.#oldBoardInfoMessage;
    }

    this.#boardInfo.innerText = msg;
  }

  /* Saves the state of the board for undo */
  #saveState() {
    /*
    if (this.#undoStackPointer === UNDO_STACK_SIZE - 1) {
      this.#undoStack.shift();
      this.#undoStack.push(this.#data.slice());
    } else {
      this.#undoStack[this.#undoStackPointer++] = this.#data.slice();
      if (this.#undoStackSize < this.#undoStackPointer) {
        ++this.#undoStackSize;
      }
    }

    console.log(this.#undoStack);
    this.#undoButton.disabled = false;
    */
  }
}
