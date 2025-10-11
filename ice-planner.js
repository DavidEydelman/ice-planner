/**
 * Copyright 2025 DavidEydelman
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { ref } from "lit/directives/ref.js";

/**
 * `ice-planner`
 * 
 * @demo index.html
 * @element ice-planner
 */
export class IcePlanner extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "ice-planner";
  }

  constructor() {
    super();
    this.teamName = "My Hockey Team";
    this.logo = "";
    this.iceCost = 300;
    this.hours = 50;
    this.coachCost = 3000;
    this.jerseyCost = 88;
    this.feePercent = 2;
    this.fixedFee = 0.99;
    this.numPlayers = 1;
    
    // Calculated values
    this.totalCost = 0;
    this.costPerPlayer = 0;
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      teamName: { type: String, reflect: true },
      logo: { type: String, reflect: true },
      iceCost: { type: Number, reflect: true },
      hours: { type: Number, reflect: true },
      coachCost: { type: Number, reflect: true },
      jerseyCost: { type: Number, reflect: true },
      feePercent: { type: Number, reflect: true },
      fixedFee: { type: Number, reflect: true },
      numPlayers: { type: Number, reflect: true },
      totalCost: { type: Number},
      costPerPlayer: { type: Number},
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
        padding: var(--ddd-spacing-4);
      }
      .header {
        text-align: center;
        margin-bottom: var(--ddd-spacing-4);
      }
      .logo {
        max-width: 200px;
        height: auto;
        margin-bottom: var(--ddd-spacing-2);
      }
      h2 {
        font-size: var(--ddd-font-size-xl);
        margin: var(--ddd-spacing-2) 0;
      }
      .inputs-section {
        display: grid;
        gap: var(--ddd-spacing-2);
        margin-bottom: var(--ddd-spacing-4);
      }
      .results {
        text-align: center;
        padding: var(--ddd-spacing-4);
        background-color: var(--ddd-theme-default-coalyGray);
        color: var(--ddd-theme-default-white);
        border-radius: var(--ddd-radius-md);
        margin-top: var(--ddd-spacing-4);
        width: 40%;
        margin-left: auto;
        margin-right: auto;
      }
      .results .total {
        font-size: var(--ddd-font-size-l);
        font-weight: bold;
        margin: var(--ddd-spacing-2) 0;
      }
      .results .per-player {
        font-size: var(--ddd-font-size-l);
        font-weight: bold;
        color: var(--ddd-theme-default-keystoneYellow);
        margin: var(--ddd-spacing-2) 0;
      }
    `];
  }

  // Lit render the HTML
  render() {
    return html`
      <div class="wrapper">
        <div class="header">
          ${this.logo ? html`<img class="logo" src="${this.logo}" alt="${this.teamName} logo">` : ''}
          <h2>${this.teamName}</h2>
        </div>
        
        <div class="inputs-section">
          <slot></slot>
        </div>

        <div class="results">
          <div class="total">Total Cost: $${this.totalCost.toFixed(2)}</div>
          <div class="per-player">Cost Per Player: $${this.costPerPlayer.toFixed(2)}</div>
        </div>
      </div>
    `;
  }
  // Runs when properties change, recalculates costs
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
      this.calculateCosts();
    }
  }

  firstUpdated() {
    this.addEventListener("value-changed", (e) => {
      const stepper = e.target;
      const label = stepper.label?.toLowerCase();

      if (label.includes("ice")) this.iceCost = e.detail.value;
      else if (label.includes("hour")) this.hours = e.detail.value;
      else if (label.includes("coach")) this.coachCost = e.detail.value;
      else if (label.includes("jersey")) this.jerseyCost = e.detail.value;
      else if (label.includes("player")) this.numPlayers = e.detail.value;
    });
  }

  // Calculate total cost and cost per player
  calculateCosts() {
    // ((iceCost * hours) + coachCost + jerseyCost) * (1 + feePercent/100) + fixedFee) / numPlayers
    const subtotal = (this.iceCost * this.hours) + this.coachCost + this.jerseyCost;
    this.totalCost = (subtotal * (1 + this.feePercent / 100)) + this.fixedFee;
    this.costPerPlayer = this.totalCost / this.numPlayers;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(IcePlanner.tag, IcePlanner);