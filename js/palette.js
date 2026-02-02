/* flavorless
 * Palette script
 */

"use strict";

/**
 * The palette class
 *
 * Handles the palette UI (brush selection, configuration)
 */
class Palette {
  /** @type {HTMLTableCellElement} */
  #brushTable = null;

  /** @type {HTMLLegendElement} */
  #paramLegend = null;

  /** @type {HTMLTableCellElement} */
  #paramTable = null;

  constructor() {
    this.#brushTable = document.getElementById("brush-table");

    this.#paramLegend = document.getElementById("param-legend");
    this.#paramTable = document.getElementById("param-table");
  }

  /**
   * Adds a brush to the palette
   *
   * @param {Brush} brush
   * @param {Board} board
   */
  addBrush(brush, board) {
    const td = document.createElement("td");

    const button = document.createElement("button");
    button.innerText = brush.getName();

    td.appendChild(button);
    this.#brushTable.appendChild(td);

    button.addEventListener("click", () => {
      board.setBrush(brush);

      if (this.#paramTable.lastChild) {
        this.#paramTable.removeChild(this.#paramTable.lastChild);
      }

      this.#paramLegend.innerText = `Parameters (${brush.getName()})`;
      this.#paramTable.appendChild(brush.getElement());
    });

    /* STUPID BUT WHATEVER MAN!!! LIVE A LITTLE */
    if (brush.getName() === "Pencil") {
      button.click();
    }
  }
}

/**
 * The palette element class
 *
 * Handles the individual palette elements
 */
class PaletteElement {
  /**
   * This callback is called when requesting brush parameters
   * @callback paramCallback
   */

  /** @type {Brush} */
  #brush = null;

  /** @type {HTMLDivElement} */
  #element = null;

  constructor(brush) {
    this.#brush = brush;
    this.#element = document.createElement("div");
  }

  /**
   * Adds a numerical parameter to the brush
   *
   * @param {string} name
   * @param {number} [min=0]
   * @param {number} [max=0]
   */
  addNumberParam(name, min = 0, max = 0) {
    const label = this.#createLabel(name);

    const number = this.#createInput("number");
    number.setAttribute("value", min);
    number.setAttribute("min", min);
    number.setAttribute("max", max);

    number.addEventListener("change", (e) => {
      this.#brush.setParam(name, e.target.value);
    });

    label.appendChild(number);

    this.#element.appendChild(label);
  }

  /**
   * Returns the element
   * @returns {HTMLDivElement}
   */
  getElement() {
    return this.#element;
  }

  #createLabel(text) {
    const label = document.createElement("label");
    label.innerText = text;

    return label;
  }

  #createInput(type) {
    const input = document.createElement("input");
    input.setAttribute("type", type);

    return input;
  }
}
