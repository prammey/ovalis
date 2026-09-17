import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { GrainOverlay } from './components/GrainOverlay'
import { PageTransitions } from './lib/navigation'
import { ScrollReset, SmoothScrollProvider } from './lib/smoothScroll'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <SmoothScrollProvider>
        <ScrollReset />
        <GrainOverlay />
        <PageTransitions>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransitions>
      </SmoothScrollProvider>
    </BrowserRouter>
  )
}
