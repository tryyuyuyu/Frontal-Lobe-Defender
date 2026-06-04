import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import AppLayout from './components/layout/AppLayout'
import Home from './pages/Home'
import EmotionBin from './pages/EmotionBin'
import Habits from './pages/Habits'
import Stats from './pages/Stats'
import Profile from './pages/Profile'

export default function App() {
  const location = useLocation()

  return (
    <AppLayout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/emotion-bin" element={<EmotionBin />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </AnimatePresence>
    </AppLayout>
  )
}
