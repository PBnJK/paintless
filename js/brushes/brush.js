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
    this.element = this.buildPaletteElement();
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

  /**
   * Updates a parameter
   *
   * @abstract
   * @param {string} key Parameter key
   * @param {any} value Parameter value
   */
  setParam(key, value) {
    throw new Error("Abstract method 'setParam' not implemented");
  }

  /**
   * Returns the name of the brush
   * @returns {string}
   */
  getName() {
    return this.name;
  }

  /**
   * Returns the palette element
   * @returns {HTMLDivElement}
   */
  getElement() {
    return this.element.getElement();
  }
}
