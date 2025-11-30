import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../services/api'

export default function BbsUpdate() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { bbs } = state || { bbs: null }

  const [title, setTitle] = useState(bbs?.title || '')
  const [content, setContent] = useState(bbs?.content || '')
  const [suggestion, setSuggestion] = useState('')
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false)

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleContentChange = (event) => {
    setContent(event.target.value)
  }

  const handleSuggestClick = async () => {
    if (!content.trim()) return

    setIsLoadingSuggestion(true)
    setSuggestion('')

    try {
      const res = await api.post('/ai/suggest', { text: content })
      setSuggestion(res.data)
    } catch (error) {
      console.error('loadSuggestion error', error)
    } finally {
      setIsLoadingSuggestion(false)
    }
  }

  const handleUseSuggestionClick = () => {
    if (!suggestion) return

    setContent(prev => (prev ? prev + ' ' + suggestion : suggestion))
    setSuggestion('')
  }

  useEffect(() => {
    if (!bbs) navigate('/bbslist')
  }, [bbs, navigate])

  const handleUpdate = async () => {
    try {
      const res = await api.patch(`/board/${bbs.boardId}/update`, { title, content })

      alert('Post updated')
      navigate(`/bbsdetail/${res.data.boardId}`)
    } catch (error) {
      console.error('update error', error)
    }
  }

  if (!bbs) return null

  return (
    <div className="card">
      <div className="row">
        <label>Author</label>
        <input
          className="input"
          value={bbs.writerName}
          readOnly
        />

        <label>Title</label>
        <input
          className="input"
          type="text"
          value={title}
          onChange={handleTitleChange}
        />

        <label>Content</label>
        <textarea
          className="textarea"
          value={content}
          onChange={handleContentChange}
        />

        <div className="mt-8-mb-8">
          <button
            type="button"
            className="btn btn-compact"
            onClick={handleSuggestClick}
            disabled={isLoadingSuggestion || !content.trim()}
          >
            {isLoadingSuggestion ? 'Getting suggestion...' : 'AI Suggest'}
          </button>
        </div>

        {suggestion && (
          <div className="card mt-8-mb-8">
            <div className="meta fw-bold">
              AI Suggestion
            </div>
            <div className="mb-8">{suggestion}</div>
            <button
              type="button"
              className="btn"
              onClick={handleUseSuggestionClick}
            >
              Use this suggestion
            </button>
          </div>
        )}
      </div>

      <div className="actions mt-8-mb-8">
        <button className="btn" onClick={handleUpdate}>
          Update
        </button>
      </div>
    </div>
  )
}
