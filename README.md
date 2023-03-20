# SvelteKit Carbon Offset Calculator

A simple calculator for planning an individual's journey to net zero by purchasing carbon offsets in the form of trees planted by an offset provider. 

Hosted on Netlify @ https://carbon-offset-calculator.netlify.app


## Tech Stack and Dependencies
 
[**SvelteKit**](https://kit.svelte.dev/) - Hybrid frontend / backend framework


[**Svelte Material UI**](https://sveltematerialui.com/) - Library of Material UI components for Svelte

[**Font Awesome Icon Library**](https://fontawesome.com/) & [**Svelte FA**](https://cweili.github.io/svelte-fa/) - Font awesome icon library and Svelte component

[**Svelte Frappe Charts**](https://github.com/himynameisdave/svelte-frappe-charts) - Frappe charts for Svelte

[**Lodash**](https://lodash.com/) - Utility library


## Instructions for use

```
> npm install

> npm run dev
```


## Usage

<br>

### Finding your carbon footprint

Navigate to the 'footprint' tab 

Select a country or region from the select box to view  CO<sub>2</sub> per capita, and equivalent metrics

<br>

### Planning offsets

Navigate to the 'offset' tab

Click the arrow buttons or the displayed year to select a year to plan your offsets for

Use the '+' and '-' buttons on each row to increment offset purchases for that month, or click the number displayed on the row to select a number, up to the number of available trees remaining for the selected year

The 'reset' and 'spread evenly' buttons at the top can be used to set all offsets for that year to 0, or distribute the remaining available trees evenly, respectively.

<br>

### Viewing report & chart

Navigate to the 'report' tab

Use the toggle switch to swap between 'Monthly' and 'Yearly' report mode

Click the arrow buttons or displayed Month / Year to alter the period that the report covers

<br>

## Mathematical assumptions - Adjustable by pressing the 'Gear' icon at the top right of the app, next to the dark mode toggle

The modelling done by the app uses the following assumptions

- The upfront cost of a single tree is $120, with annual maintenance costs equal to 10% of the upfront cost
- A tree takes 60 months to fully grow, and can offset 28.5kg of CO<sub>2</sub> per year when fully grown
- The amount of CO<sub>2</sub> offset by a growing tree increases linearly until it is fully grown, increasing at a rate of ~1.7% per month
- An individual is limited to 55 offset purchases per calendar year