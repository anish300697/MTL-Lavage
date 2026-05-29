# MTL Lavage — Static Website

This is a simple static website for the Montreal-based car washing and detailing business `MTL Lavage`.

Quick start:

1. Open `index.html` in a browser (double-click or serve via a static server).

Local server example (Python 3):
```bash
python -m http.server 8000
# then open http://localhost:8000/index.html
```

What is included:
- `index.html` — Landing page with services, rate card and gallery
- `shop.html` — Product listings and simple cart
- `styles.css` — Site styles
- `script.js` — Shop/cart behavior

Notes:
- Images use Unsplash CDN links as placeholders. Replace with your own photos in production.
- Checkout is a demo; integrate a payment provider for real sales.
