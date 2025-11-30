import { useState } from 'react'
import api from '../services/api'

export default function CommentWrite({ boardId, onCommentAdded }) {
  const [content, setContent] = useState('')
  const username = localStorage.getItem('id')

  const submit = async () => {
    try {
      await api.post(`/board/${boardId}/comment/write`, { content })
      setContent('')
      alert('Comment posted')
      if (onCommentAdded) {
        onCommentAdded()
      }
    } catch (e) { console.error('comment write error', e) }
  }

  return (
    <div className="card comment-write-card">
      <div className="row">
        <div className="meta">{username}</div>
        <textarea
          className="textarea"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Write a comment..."
        />
      </div>
      <div className="actions comment-write-actions">
        <button className="btn ghost" onClick={submit}>Add Comment</button>
      </div>
    </div>
  )
}
