import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { GrainOverlay } from './components/GrainOverlay'
import { Navbar } from './components/Navbar'
import { DEFAULT_COLORWAY_ID } from './data/colorways'
import { PageTransitions } from './lib/navigation'
import { ScrollReset, SmoothScrollProvider } from './lib/smoothScroll'
import { About } from './pages/About'
import { Collections } from './pages/Collections'
import { Contact } from './pages/Contact'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { Product } from './pages/Product'
import { OpeningTest } from './pages/test/OpeningTest'
import { Placeholder } from './pages/test/Placeholder'

export default function App() {
  return (
    <BrowserRouter>
      <SmoothScrollProvider>
        <ScrollReset />
        <GrainOverlay />
        <Navbar />
        <PageTransitions>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/shop" element={<Navigate to="/collections" replace />} />
            <Route path="/luma-one" element={<Navigate to={`/luma-one/${DEFAULT_COLORWAY_ID}`} replace />} />
            <Route path="/luma-one/:colorway" element={<Product />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/test/placeholder" element={<Placeholder />} />
            <Route path="/test/opening" element={<OpeningTest />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransitions>
      </SmoothScrollProvider>
    </BrowserRouter>
  )
}
