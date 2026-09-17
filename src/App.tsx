import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { GrainOverlay } from './components/GrainOverlay'
import { PageTransitions } from './lib/navigation'
import { ScrollReset, SmoothScrollProvider } from './lib/smoothScroll'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { OpeningTest } from './pages/test/OpeningTest'
import { Placeholder } from './pages/test/Placeholder'

export default function App() {
  return (
    <BrowserRouter>
      <SmoothScrollProvider>
        <ScrollReset />
        <GrainOverlay />
        <PageTransitions>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/test/placeholder" element={<Placeholder />} />
            <Route path="/test/opening" element={<OpeningTest />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransitions>
      </SmoothScrollProvider>
    </BrowserRouter>
  )
}
