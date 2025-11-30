import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function BbsWrite() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [files, setFiles] = useState([])
  const [suggestion, setSuggestion] = useState('')
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false)

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleContentChange = (event) => {
    setContent(event.target.value)
  }

  const handleFilesChange = (event) => {
    const allFiles = Array.from(event.target.files)

    const imageFiles = allFiles.filter(file => file.type.startsWith('image/'))

    if (imageFiles.length === 0) {
      alert('Only image files are allowed (jpg, png, etc).')
      setFiles([])
      return
    }

    if (imageFiles.length > 1) {
      alert('Only one image per post is allowed. Using the first image.')
    }

    setFiles([imageFiles[0]])
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

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('bbs_access_token')
      if (!token) {
        alert('Your session has expired or you are not logged in. Please login again.')
        navigate('/login')
        return
      }

      const res = await api.post('/board/write', { title, content }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const boardId = res.data.boardId
      if (files.length > 0) {
        const fd = new FormData()
        files.forEach(f => fd.append('file', f))
        await api.post(`/board/${boardId}/file/upload`, fd, { 
          headers: { 
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          } 
        })
      }
      alert('Post created')
      navigate(`/bbsdetail/${boardId}`)
    } catch (error) {
      alert('Create failed')
      console.error('create error', error)
    }
  }

  return (
    <div className="card">
      <div className="row">
        <label>Author</label>
        <input
          className="input"
          value={localStorage.getItem('id') || ''}
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

        <label>Files</label>
        <input
          className="input"
          type="file"
          onChange={handleFilesChange}
        />
      </div>

      <div className="actions mt-8-mb-8">
        <button className="btn" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  )
}
