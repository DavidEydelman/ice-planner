/**
 * Copyright 2025 DavidEydelman
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `input-stepper`
 * 
 * @demo index.html
 * @element input-stepper
 */
export class InputStepper extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "input-stepper";
  }

  constructor() {
    super();
    this.value = 0;
    this.min = 0;
    this.max = 100;
    this.step = 1;
    this.label = "";
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      value: { type: Number, reflect: true },
      min: { type: Number, reflect: true },
      max: { type: Number, reflect: true },
      step: { type: Number, reflect: true },
      label: { type: String, reflect: true },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-default-coalyGray);
        background-color: var(--ddd-theme-default-roarLight);
        font-family: var(--ddd-font-navigation);
      }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-2);
      }
      .controls {
        display: flex;
        gap: var(--ddd-spacing-2);
        align-items: center;
        justify-content: center;
      }
      label {
        display: block;
        text-align: center;
        font-weight: bold;
        margin-bottom: var(--ddd-spacing-1);
        font-size: var(--ddd-font-size-s);
      }
      button {
        padding: var(--ddd-spacing-2);
        font-size: var(--ddd-font-size-m);
        border: var(--ddd-border-sm);
        min-width: var(--ddd-spacing-15);
      }
      button:hover {
        cursor: pointer;
        background-color: var(--ddd-theme-default-shrineTan);
      }
      input {
        text-align: center;
        padding: var(--ddd-spacing-2);
        font-size: var(--ddd-font-size-m);
        border: var(--ddd-border-sm);
        border-radius: var(--ddd-radius-sm);
      }
    `];
  }

  // Lit render the HTML
  render() {
    return html`
      <div class="wrapper">
        ${this.label ? html`<label>${this.label}</label>` : ''}
        <div class="controls">
          <button @click="${this.decrease}" ?disabled="${this.min === this.value}">-</button>
          <input 
            type="number" 
            value="${this.value}" 
            @input="${this.handleInput}"
            min="${this.min}" 
            max="${this.max}" 
            step="${this.step}">
          <button @click="${this.increase}" ?disabled="${this.max === this.value}">+</button>
        </div>
      </div>
    `;
  }

  // Method to increment value
  increase() {
    if (this.value < this.max) {
      this.value += this.step;
    }
  }

  // Method to decrement value
  decrease() {
    if (this.value > this.min) {
      this.value -= this.step;
    }
  }

  // Method to handle direct input changes
  handleInput(e) {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      this.value = Math.max(this.min, Math.min(this.max, newValue));
    }
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(InputStepper.tag, InputStepper);