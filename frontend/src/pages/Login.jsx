import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../state/AuthContext'
import { useHeaders } from '../state/HeadersContext'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { setAuth } = useAuth()
  const { setToken } = useHeaders()

  const onSubmit = async () => {
    try {
      const res = await api.post('/user/login', { email, password })
      localStorage.setItem('bbs_access_token', res.data.token)
      localStorage.setItem('id', res.data.email)
      setAuth(res.data.email)
      setToken(res.data.token)
      onLogin?.(res.data.email)
      alert(`${res.data.email}, you have successfully logged in`)
      navigate('/bbslist')
    } catch (e) {
      alert(e?.response?.data || 'Login failed')
      console.error('login error', e)
    }
  }

  return (
    <div className="card">
      <div className="row">
        <label>Email</label>
        <input className="input" value={email} onChange={e => setEmail(e.target.value)} />
        <label>Password</label>
        <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <div className="actions" style={{marginTop:12}}>
        <button className="btn" onClick={onSubmit}>Login</button>
      </div>
    </div>
  )
}
