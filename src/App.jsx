import { useState } from 'react'
import './App.css'

const features = [
  {
    title: 'Fast',
    description: 'Built on Vite for instant hot module reloads and lightning-quick builds.',
  },
  {
    title: 'Modern',
    description: 'React 18 with a clean, component-driven architecture ready to grow.',
  },
  {
    title: 'Yours',
    description: 'A blank canvas scaffolded and pushed to GitHub, ready for your ideas.',
  },
]

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="page">
      <div className="glow" aria-hidden="true" />

      <header className="hero">
        <span className="badge">Welcome</span>
        <h1>
          peiqi<span className="accent">site</span>
        </h1>
        <p className="subtitle">
          Your new site is live and ready to build on. Start editing{' '}
          <code>src/App.jsx</code> and watch it update instantly.
        </p>

        <div className="actions">
          <button className="btn primary" onClick={() => setCount((c) => c + 1)}>
            Clicked {count} {count === 1 ? 'time' : 'times'}
          </button>
          <a
            className="btn ghost"
            href="https://github.com/Kennedyleepeiqi/peiqisite"
            target="_blank"
            rel="noreferrer"
          >
            View on GitHub
          </a>
        </div>
      </header>

      <section className="features">
        {features.map((f) => (
          <article className="card" key={f.title}>
            <h3>{f.title}</h3>
            <p>{f.description}</p>
          </article>
        ))}
      </section>

      <footer className="footer">
        <p>Built with React + Vite</p>
      </footer>
    </div>
  )
}

export default App
