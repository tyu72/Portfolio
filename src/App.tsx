import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import PixelBlast from './components/PixelBlast/PixelBlast';
import Home from './pages/Home';
import Projects from './pages/Projects';
import About from './pages/About';
import Contact from './pages/Contact';
import { useTheme } from './lib/theme';

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative min-h-screen">
      {/* Animated background. Fixed to the viewport and pinned behind the page
          (z-0) so it covers every route without scrolling away. The shader
          renders its pixels over transparency, so the page's own background
          colour still shows through underneath. Content sits at z-10, so links
          stay on top and keep receiving clicks; pointer events are left on here
          so the ripple-on-move effect still works over empty areas. */}
      <div className="fixed inset-0 z-0" aria-hidden>
        <PixelBlast
          // The light theme's deep indigo all but disappears on a dark page,
          // so the dark theme gets a lifted version of the same hue.
          color={theme === 'dark' ? '#6f74e8' : '#2b2d8f'}
          variant="square"
          pixelSize={3}
          patternScale={2}
          patternDensity={1}
          speed={0.5}
          edgeFade={0.5}
          transparent
        />
      </div>

      <div className="relative z-10">
        <Nav theme={theme} onToggleTheme={toggleTheme} />
        <main>
          <Routes>
            <Route path="/" element={<Home theme={theme} />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}
