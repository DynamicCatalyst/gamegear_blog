import { createContext, useContext, useMemo, useState } from 'react'

const HeadersContext = createContext(null)

export function HeadersProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('bbs_access_token') || '')

  const value = useMemo(() => ({
    token,
    setToken,
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  }), [token])

  return <HeadersContext.Provider value={value}>{children}</HeadersContext.Provider>
}

export function useHeaders() {
  return useContext(HeadersContext)
}
