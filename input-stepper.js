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
      }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-0);
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
            .value="${String(this.value)}" 
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

  handleInput(e) {
    const newValue = Number(e.target.value);
    if (!isNaN(newValue)) {
      const clamped = Math.min(this.max, Math.max(this.min, newValue));
      this.value = clamped;
    } else {
      e.target.value = String(this.value);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadFromURL();
  }

  loadFromURL() {
    const params = new URLSearchParams(window.location.search);
    const label = this.label?.toLowerCase();

    if (label.includes("ice cost") && params.has('iceCost')) {
      this.value = Number(params.get('iceCost'));
    } else if (label.includes("hours of ice") && params.has('hours')) {
      this.value = Number(params.get('hours'));
    } else if (label.includes("coach") && params.has('coachCost')) {
      this.value = Number(params.get('coachCost'));
    } else if (label.includes("jersey") && params.has('jerseyCost')) {
      this.value = Number(params.get('jerseyCost'));
    } else if (label.includes("player") && params.has('numPlayers')) {
      this.value = Number(params.get('numPlayers'));
    }
  }

  updated(changedProperties) {
    if (changedProperties.has("value")) {
      this.dispatchEvent(new CustomEvent("value-changed", {
        detail: { value: this.value, label: this.label },
        bubbles: true,
        composed: true,
      }));
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