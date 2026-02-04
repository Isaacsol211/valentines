# 💕 Be My Valentine?

A fun, interactive Valentine's Day website built with Svelte 5 and Tailwind CSS.

## ✨ Features

- **Interactive "No" Button**: On desktop, the "No" button moves away from your mouse when you get close to it
- **Mobile Support**: On mobile devices, tapping "No" makes it disappear and reappear in a random location
- **Confetti Celebration**: Clicking "Yes" triggers a beautiful confetti animation
- **Responsive Design**: Works perfectly on both desktop and mobile devices
- **Beautiful Gradient Background**: Eye-catching pink and red gradient theme

## 🚀 Getting Started

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 🛠️ Technologies Used

- **Svelte 5**: Modern reactive framework with runes ($state, $effect)
- **Vite**: Lightning-fast build tool
- **Tailwind CSS v4**: Utility-first CSS framework
- **Canvas Confetti**: Delightful confetti animations

## 💡 How It Works

The website asks "Will you be my Valentine?" with two buttons:

- **Yes Button**: Triggers a confetti celebration and shows a thank you message
- **No Button**: 
  - On desktop: Moves away from the mouse cursor when you hover near it
  - On mobile: Jumps to a random position when tapped

## 📱 Mobile Experience

The app automatically detects mobile devices and adjusts the interaction pattern. Instead of mouse-based movement, the "No" button teleports to random positions on the screen when tapped.

## 🎨 Customization

Feel free to customize:
- Colors in the gradient background (in `App.svelte`)
- Button styles and sizes (Tailwind classes)
- Confetti colors and patterns (in the `handleYes` function)
- Text messages and emojis

## 📝 License

Feel free to use this for your own Valentine's Day surprises! ❤️
