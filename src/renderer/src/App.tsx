import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/globals.css'
import { MainLayout } from './components/layout/main-layout'
import HomePage from './pages/home'
import PackagesPage from './pages/packages'
import SettingsPage from './pages/settings'
import HostsPage from './pages/hosts'

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/hosts" element={<HostsPage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}

export default App
