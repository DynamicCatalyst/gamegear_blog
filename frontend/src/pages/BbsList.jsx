import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function BbsList() {
  const [list, setList] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)

  const [choice, setChoice] = useState('title')
  const [q, setQ] = useState('')

  const fetchList = async (p = 1) => {
    try {
      const res = await api.get('/board/list', { params: { page: p - 1 } })
      setList(res.data.content || [])
      setPageSize(res.data.pageSize || 10)
      setTotal(res.data.totalElements || 0)
    } catch (e) {
      console.error('list error', e)
    }
  }

  const search = async () => {
    try {
      const params = { page: page - 1, title: '', content: '', writerName: '' }
      if (choice === 'title') params.title = q
      if (choice === 'content') params.content = q
      if (choice === 'writer') params.writerName = q
      const res = await api.get('/board/search', { params })
      setList(res.data.content || [])
      setTotal(res.data.totalElements || 0)
    } catch (e) {
      console.error('search error', e)
    }
  }

  useEffect(() => { fetchList(1) }, [])

  const showAllPosts = () => {
    window.location.reload()
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const prev = () => { const p = Math.max(1, page - 1); setPage(p); fetchList(p) }
  const next = () => { const p = Math.min(totalPages, page + 1); setPage(p); fetchList(p) }

  return (
    <div className="card">
      <div className="row cols-2">
        <select className="select" value={choice} onChange={e => setChoice(e.target.value)}>
          <option value="title">Title</option>
          <option value="content">Content</option>
          <option value="writer">Author</option>
        </select>
        <div style={{display:'flex', gap:8}}>
          <input className="input" placeholder="Search keyword" value={q} onChange={e => setQ(e.target.value)} />
          <button className="btn ghost" onClick={search}>Search</button>
          <button className="btn ghost" onClick={showAllPosts} style={{width:100}}>Show All</button>
        </div>
      </div>

      <hr className="sep" />
      <div className="list">
        <div className="list-item" style={{fontWeight:600, opacity:0.8}}>
          <div>No.</div>
          <div>Title</div>
          <div>Author</div>
          <div style={{textAlign:'right'}}>Views</div>
        </div>
        {list.map((b, idx) => (
          <div className="list-item" key={b.boardId}>
            <div>{(page - 1) * pageSize + idx + 1}</div>
            <div>
              <Link to={`/bbsdetail/${b.boardId}`}>{b.title}</Link>
            </div>
            <div>{b.writerName}</div>
            <div style={{textAlign:'right'}}>{b.viewCount}</div>
          </div>
        ))}
      </div>

      <div style={{display:'flex', justifyContent:'space-between', marginTop:16}}>
        <div className="meta">Page {page} / {totalPages} • {total} items</div>
        <div style={{display:'flex', gap:8}}>
          <button className="btn ghost" onClick={prev} disabled={page===1}>‹ Prev</button>
          <button className="btn ghost" onClick={next} disabled={page===totalPages}>Next ›</button>
          <Link to="/bbswrite" className="btn">Write Post</Link>
        </div>
      </div>
    </div>
  )
}
