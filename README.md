# Best Sellers – Platter Technical Challenge

A responsive "Best Sellers" product section built from the Figma design.

**Live preview:** https://dhruvlearner.github.io/platter-demo/

## Tech stack

- HTML
- Tailwind CSS (via CDN)
- Vanilla JavaScript

## Features

- 10 product cards loaded from a mock API
- Hover over a product image to see a second image
- Desktop: products in one row with a custom scrollbar (thumb grows to 6px on hover / touch)
- Mobile: first 4 products shown, "Show More" smoothly reveals the rest
- Sale badge with discount calculated from the price
- Half-star ratings
- Loading spinner while products load
- Placeholder if an image fails to load
- Falls back to `products.json` if the API is unavailable => https://api.npoint.io/34e31e1ba446f2e67982

## Project structure

```
index.html      Page markup
style.css       Design tokens (colors, fonts) and custom styles
script.js       <product-list> custom element: loads and renders products
products.json   Fallback product data
```
