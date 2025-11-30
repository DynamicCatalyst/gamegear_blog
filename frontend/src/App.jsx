import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { AuthProvider } from './state/AuthContext'
import { HeadersProvider } from './state/HeadersContext'

import Home from './pages/Home'
import BbsList from './pages/BbsList'
import BbsDetail from './pages/BbsDetail'
import BbsWrite from './pages/BbsWrite'
import BbsUpdate from './pages/BbsUpdate'
import Login from './pages/Login'
import Join from './pages/Join'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const id = localStorage.getItem('id')
    setUser(id)
  }, [])

  return (
    <AuthProvider>
      <HeadersProvider>
        <div className="app-shell">
          <Header user={user} />
          <main className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/bbslist" element={<BbsList />} />
              <Route path="/bbswrite" element={user ? <BbsWrite /> : <Navigate to="/login" replace />} />
              <Route path="/bbsdetail/:boardId" element={<BbsDetail />} />
              <Route path="/bbsupdate" element={user ? <BbsUpdate /> : <Navigate to="/login" replace />} />
              <Route path="/login" element={<Login onLogin={setUser} />} />
              <Route path="/join" element={<Join />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HeadersProvider>
    </AuthProvider>
  )
}

function Header({ user }) {
  const onLogout = () => {
    localStorage.removeItem('bbs_access_token')
    localStorage.removeItem('id')
    window.location.href = '/'
  }
  return (
    <header className="app-header">
      <div className="container header-inner">
        <Link to="/" className="brand">GG Blog</Link>
        <nav className="nav">
          <Link to="/bbslist">Posts</Link>
          {user && <Link to="/bbswrite">Write</Link>}
          {!user && <Link to="/login">Login</Link>}
          {!user && <Link to="/join">Sign Up</Link>}
          {user && <button className="linklike" onClick={onLogout}>Logout</button>}
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="app-footer">
      <div className="container">© {new Date().getFullYear()} GG Blog | DynamicCatalyst</div>
    </footer>
  )
}

export default App
