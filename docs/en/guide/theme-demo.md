# Theme Demo

This page demonstrates the dark theme capabilities of our documentation.

## Features

### 🌙 Dark Theme Support
- **Automatic detection** - Respects your system preferences
- **Manual toggle** - Click the theme button in the navigation
- **Persistent settings** - Your choice is saved in localStorage
- **Smooth transitions** - All elements transition smoothly between themes

### 🎨 Visual Elements

#### Code Blocks
```javascript
// Dark theme optimized syntax highlighting
const gateway = new Gateway({
  apiKey: process.env.GATEWAY_API_KEY,
  environment: 'production',
  timeout: 30000
});

async function createAddress() {
  const address = await gateway.addresses.create({
    network: 'ethereum',
    coin: 'usdt',
    type: 'user'
  });
  return address.data;
}
```

#### Tables
| Feature | Light Theme | Dark Theme |
|---------|-------------|------------|
| Background | White | Dark Slate |
| Text | Dark | Light |
| Borders | Light Gray | Dark Gray |
| Code | Light Background | Dark Background |

#### Alerts

::: tip Success
This is a success message that looks great in both themes!
:::

::: warning Attention
Warning messages are clearly visible in dark mode.
:::

::: danger Error
Error messages maintain their urgency in dark theme.
:::

### 🔧 Technical Implementation

The dark theme is implemented using:

1. **CSS Custom Properties** - For consistent theming
2. **System Preference Detection** - `prefers-color-scheme: dark`
3. **Local Storage** - For persistent user preferences
4. **Smooth Transitions** - CSS transitions for all color changes

### 🎯 Usage

To toggle between themes:
1. Look for the theme toggle button in the navigation bar
2. Click the sun/moon icon to switch themes
3. Your preference will be automatically saved

The theme will also automatically match your system preferences if you haven't manually selected one.

## Color Palette

### Light Theme
- **Background**: White (#ffffff)
- **Text**: Dark Gray (#1f2937)
- **Brand**: Blue (#3b82f6)
- **Border**: Light Gray (#e5e7eb)

### Dark Theme
- **Background**: Dark Slate (#0f172a)
- **Text**: Light Gray (#f1f5f9)
- **Brand**: Light Blue (#60a5fa)
- **Border**: Dark Gray (#334155)

## Browser Support

The dark theme works in all modern browsers that support:
- CSS Custom Properties
- `prefers-color-scheme` media query
- Local Storage API

This includes Chrome 49+, Firefox 31+, Safari 9.1+, and Edge 16+. 