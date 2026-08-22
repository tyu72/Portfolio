import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import PixelBlast from './components/PixelBlast/PixelBlast';
import Home from './pages/Home';
import Projects from './pages/Projects';
import About from './pages/About';
import Contact from './pages/Contact';

export default function App() {
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
          // Kept in step with --color-pixel, which the cards' spotlight sheen
          // also uses so the two read as one accent.
          color="#6f74e8"
          variant="square"
          pixelSize={3}
          patternScale={5.5}
          patternDensity={0.9}
          pixelSizeJitter={1.1}
          speed={0.5}
          edgeFade={0.19}
          enableRipples
          liquid={false}
          transparent
        />
      </div>

      {/* A column at least a screen tall, with the routed page taking up the
          slack. Short pages — the contact form's success state especially —
          otherwise leave the footer partway up the screen with background
          showing beneath it. */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <Nav />
        {/* A column, so a page can opt into filling the leftover height with
            flex-1 — the contact page uses that to centre itself. */}
        <main className="flex flex-1 flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
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
