import { useEffect, useRef, useState } from 'react'
import api from '../services/api'

function formatDate(dt) {
  if (!dt) return ''
  try {
    const d = new Date(dt)
    if (isNaN(d.getTime())) return String(dt)
    return d.toLocaleString()
  } catch {
    return String(dt)
  }
}

export default function CommentList({ boardId, onRefreshReady }) {
  const [list, setList] = useState([])
  const getRef = useRef(null)
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editingContent, setEditingContent] = useState('')

  const currentUser = localStorage.getItem('id') || ''

  const fetchComments = async () => {
    try {
      const res = await api.get(`/board/${boardId}/comment/list`, { params: { page: 0 } })
      setList(res.data.content || [])
    } catch (e) { console.error('comment list error', e) }
  }

  const deleteComment = async (commentId) => {
    if (!confirm('Delete this comment?')) return
    try {
      await api.delete(`/board/${boardId}/comment/delete/${commentId}`)
      fetchComments()
    } catch (e) {
      console.error('comment delete error', e)
      alert('Failed to delete comment')
    }
  }

  const startEdit = (commentId, currentContent) => {
    setEditingCommentId(commentId)
    setEditingContent(currentContent)
  }

  const cancelEdit = () => {
    setEditingCommentId(null)
    setEditingContent('')
  }

  const saveEdit = async (commentId) => {
    const trimmed = editingContent.trim()
    if (!trimmed) {
      alert('Comment cannot be empty')
      return
    }
    try {
      await api.patch(`/board/${boardId}/comment/update/${commentId}`, { content: trimmed })
      setEditingCommentId(null)
      setEditingContent('')
      fetchComments()
    } catch (e) {
      console.error('comment update error', e)
      alert('Failed to update comment')
    }
  }

  useEffect(() => {
    getRef.current = fetchComments
    fetchComments()
    if (onRefreshReady) {
      onRefreshReady(() => fetchComments())
    }
  }, [boardId])

  return (
    <div>
      <div className="comment-header-row">
        <h3 className="comment-title">Comments</h3>
      </div>
      <div className="list comment-list">
        {list.map((c) => {
          const name = c.userName || c.commentWriterName || 'Unknown'
          const when = c.createdDate
          const authorEmail = c.email
          const isOwner = currentUser && authorEmail && currentUser === authorEmail
          const isEditing = editingCommentId === c.commentId
          return (
            <div className="card" key={c.commentId}>
              <div className="comment-card-header">
                <div className="comment-author-row">
                  <div className="comment-avatar">
                    {String(name).slice(0,1).toUpperCase()}
                  </div>
                  <div>
                    <div className="comment-author-name">{name}</div>
                    <div className="meta">{formatDate(when)}</div>
                  </div>
                </div>
                {isOwner && !isEditing && (
                  <div className="comment-actions">
                    <button
                      className="btn ghost btn-compact"
                      onClick={() => startEdit(c.commentId, c.content)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn ghost btn-compact"
                      onClick={() => deleteComment(c.commentId)}
                    >
                      Delete
                    </button>
                  </div>
                )}
                {isOwner && isEditing && (
                  <div className="comment-actions">
                    <button
                      className="btn ghost btn-compact"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-compact"
                      onClick={() => saveEdit(c.commentId)}
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
              {!isEditing && (
                <div className="comment-content">{c.content}</div>
              )}
              {isEditing && (
                <textarea
                  className="textarea comment-edit-textarea"
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
