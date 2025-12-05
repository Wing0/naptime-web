# Naptime Brand & Logo Guide

The Naptime "logo" uses a minimalist typographic approach. Here are the specifications to recreate it across other platforms.

## Typographic Logo ("Naptime.")

This is the main logo used in the website header.

*   **Text content**: `Naptime.` (Note the trailing dot)
*   **Font Family**: `Outfit`
    *   *Source*: [Google Fonts - Outfit](https://fonts.google.com/specimen/Outfit)
*   **Font Weight**: `700` (Bold)
*   **Letter Spacing**: `-0.5px` (Tight tracking)
*   **Colors**:
    *   Main Text ("Naptime"): `#ffffff` (White)
    *   Accent Dot ("."): `#8b2df2` (Purple)

### CSS Implementation
```css
.logo {
    font-family: 'Outfit', sans-serif;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: -0.5px;
}

.logo span {
    color: #8b2df2; /* Purple accent */
}
```

## Favicon / Icon

The site icon is currently a simple emoji SVG.

*   **Symbol**: 💤 (Sleep Emoji)
*   **SVG Code**:
    ```xml
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
        <text y='.9em' font-size='90'>💤</text>
    </svg>
    ```

## Color Palette

*   **Primary Purple**: `#8b2df2`
*   **Dark Background**: `#0f0518`
*   **Card Background**: `#1a0b2e`
