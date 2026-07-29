# peiqisite

A modern web app built with [React](https://react.dev) and [Vite](https://vite.dev).

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # build for production into dist/
npm run preview  # preview the production build locally
```

## Project structure

```
peiqisite/
├─ public/          static assets served as-is
├─ src/
│  ├─ App.jsx       main app component
│  ├─ App.css       app styles
│  ├─ index.css     global styles
│  └─ main.jsx      app entry point
├─ index.html       HTML entry point
└─ vite.config.js   Vite configuration
```

## Deploy

The production build in `dist/` is fully static and can be hosted on any static
host (GitHub Pages, Netlify, Vercel, Cloudflare Pages, etc.).
