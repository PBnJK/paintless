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
    this.#element = document.createElement("tr");
  }

  /**
   * Adds a numerical parameter to the brush
   *
   * @param {string} name
   * @param {number} [min=0]
   * @param {number} [max=0]
   *
   * @returns {HTMLLabelElement}
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
    return this.#addToElement(label);
  }

  /**
   * Adds a string parameter to the brush
   *
   * @param {string} name
   * @param {number} [max=0]
   *
   * @returns {HTMLLabelElement}
   */
  addStringParam(name, max = 0) {
    const label = this.#createLabel(name);

    const text = this.#createInput("text");
    text.setAttribute("maxlength", max);

    text.addEventListener("input", (e) => {
      console.log("text");
      this.#brush.setParam(name, e.target.value);
    });

    label.appendChild(text);
    return this.#addToElement(label);
  }

  /**
   * Adds a select parameter to the brush
   *
   * @param {string} name
   * @param {object[]} options
   */
  addSelectParam(name, options) {
    const label = this.#createLabel(name);

    const select = document.createElement("select");
    for (const obj of options) {
      const option = document.createElement("option");
      option.innerText = obj.text;
      option.value = obj.value;

      select.appendChild(option);
    }

    label.appendChild(select);
    select.addEventListener("change", (e) => {
      this.#brush.setParam(name, e.target.value);
    });

    return this.#addToElement(label);
  }

  /**
   * Creates an option for a select parameter
   *
   * @param {string} text
   * @param {string} value
   */
  createOption(text, value) {
    return {
      text: text,
      value: value,
    };
  }

  /**
   * Adds a a "color" picker to the brush
   *
   * @param {string} name
   * @param {string[]} colors
   * @param {boolean} allowCustom
   *
   * @returns {HTMLLabelElement}
   */
  addColorPickerParam(name, colors, allowCustom) {
    const label = this.#createLabel(name);

    const select = document.createElement("select");
    for (const c of colors) {
      const option = document.createElement("option");
      option.value = c;
      option.innerText = c;

      select.appendChild(option);
    }

    label.appendChild(select);

    if (allowCustom) {
      const customOption = document.createElement("option");
      customOption.value = "custom";
      customOption.innerText = "Custom";

      select.appendChild(customOption);
    }

    select.addEventListener("change", (e) => {
      if (allowCustom) {
        const customFieldID = `custom-field-${this.#brush.getName()}`;
        const existingCustomField = document.getElementById(customFieldID);
        if (e.target.value === "custom") {
          if (existingCustomField === null) {
            const customField = this.addStringParam(name, 1);
            customField.id = customFieldID;
            return;
          }
        } else {
          if (existingCustomField !== null) {
            existingCustomField.remove();
          }

          this.#brush.setParam(name, e.target.value);
        }
      } else {
        this.#brush.setParam(name, e.target.value);
      }
    });

    return this.#addToElement(label);
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
    label.innerText = text + ": ";

    return label;
  }

  #createInput(type) {
    const input = document.createElement("input");
    input.setAttribute("type", type);

    return input;
  }

  #addToElement(element) {
    const td = document.createElement("td");
    td.appendChild(element);

    this.#element.appendChild(td);
    return td;
  }
}
