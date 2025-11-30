import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Join() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [passwordCheck, setPasswordCheck] = useState('')
  const navigate = useNavigate()

  const checkEmail = async () => {
    try {
      await api.get('/user/checkId', { params: { email } })
      alert('This email is available.')
    } catch (e) {
      alert(e?.response?.data || 'Check failed')
    }
  }

  const onSubmit = async () => {
    try {
      const res = await api.post('/user/register', { email, password, passwordCheck, username: name })
      alert(`Welcome, ${res.data.username}! Your registration is complete`)
      navigate('/login')
    } catch (e) {
      alert(e?.response?.data || 'Register failed')
      console.error('register error', e)
    }
  }

  return (
    <div className="card">
      <div className="row">
        <label>Email</label>
        <div style={{display:'flex', gap:8}}>
          <input className="input" value={email} onChange={e => setEmail(e.target.value)} />
          <button className="btn danger" onClick={checkEmail}>Check</button>
        </div>
      </div>
      <div className="row">
        <label>Name</label>
        <input className="input" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div className="row">
        <label>Password</label>
        <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <label>Confirm Password</label>
        <input className="input" type="password" value={passwordCheck} onChange={e => setPasswordCheck(e.target.value)} />
      </div>
      <div className="actions" style={{marginTop:12}}>
        <button className="btn" onClick={onSubmit}>Sign Up</button>
      </div>
    </div>
  )
}
