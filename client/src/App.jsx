import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './Landing'
import RegisterProperty from './RegisterProperty'
import ViewProperty from './ViewProperty'
import MyProperties from './MyProperties'
import { ThemeProvider } from './ThemeContext'
import { WalletProvider } from './WalletContext'

function App() {
  return (
    <ThemeProvider>
      <WalletProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<RegisterProperty />} />
            <Route path="/marketplace" element={<ViewProperty />} />
            <Route path="/myproperties" element={<MyProperties />} />
          </Routes>
        </BrowserRouter>
      </WalletProvider>
    </ThemeProvider>
  )
}

export default App
