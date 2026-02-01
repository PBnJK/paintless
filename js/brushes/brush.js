/* flavorless
 * Brush script
 */

"use strict";

/**
 * The drawing brush class
 *
 * Base class from which different brushes are created
 */
class Brush {
  /**
   * Brush constructor
   *
   * @param {string} name Name of the brush (shown on the UI)
   */
  constructor(name) {
    this.name = name;
  }

  /**
   * Called when drawing something with the brush
   *
   * @abstract
   * @param {number} x X-coordinate
   * @param {number} y Y-coordinate
   * @param {Board} board Reference to the board
   */
  draw(x, y, board) {
    throw new Error("Abstract method 'draw' not implemented");
  }

  /**
   * Builds the palette UI element
   *
   * @abstract
   * @returns {PaletteElement}
   */
  buildPaletteElement() {
    throw new Error("Abstract method 'buildPaletteElement' not implemented");
  }

  getParam(key) {}

  /**
   * Returns the name of the brush
   * @returns {string}
   */
  getName() {
    return this.name;
  }
}
