import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../state/AuthContext'
import ImagePreview from '../pages/ImagePreview'

import CommentList from '../sections/CommentList'
import CommentWrite from '../sections/CommentWrite'

export default function BbsDetail() {
  const { boardId } = useParams()
  const { auth } = useAuth()
  const navigate = useNavigate()
  const [bbs, setBbs] = useState(null)
  const refreshComments = useRef(null)
  const [showPreview, setShowPreview] = useState(false);
  const [previewSrc, setPreviewSrc] = useState('');

  const fetchDetail = async () => {
    try {
      const res = await api.get(`/board/${boardId}`)
      setBbs(res.data)
    } catch (e) { console.error('detail error', e) }
  }

  const onDelete = async () => {
    if (!confirm('Delete this post?')) return
    try {
      await api.delete(`/board/${boardId}/delete`)
      alert('Post deleted')
      navigate('/bbslist')
    } catch (e) { console.error('delete error', e) }
  }
  
  const handleImageClick = (src) => {
  setPreviewSrc(src);
  setShowPreview(true);
  };

  useEffect(() => { fetchDetail() }, [boardId])

  if (!bbs) return <div className="card">Loading...</div>

  const canEdit = auth && (auth === bbs.writerEmail || auth === bbs.writerName)
  const mainFile = bbs.files && bbs.files.length > 0 ? bbs.files[0] : null

  const handleDeleteImage = async () => {
    if (!mainFile) return
    if (!confirm('Delete this image?')) return
    try {
      await api.delete(`/board/${boardId}/file/delete`, { params: { fileId: mainFile.fileId } })
      alert('Image deleted')
      fetchDetail()
    } catch (e) {
      console.error('image delete error', e)
      alert('Failed to delete image')
    }
  }
  const updateState = {
    boardId: bbs.boardId,
    writerName: bbs.writerName,
    title: bbs.title,
    content: bbs.content,
  }

  return (
    <div className="card">
      <div className="bbs-detail-header-actions">
        <Link className="btn ghost" to="/bbslist">Post List</Link>
        {canEdit && (
          <>
            <Link className="btn ghost" to="/bbsupdate" state={{ bbs: updateState }}>Edit</Link>
            <button className="btn danger" onClick={onDelete}>Delete</button>
          </>
        )}
      </div>

      <table className="table bbs-detail-table">
        <tbody>
          <tr>
            <th className="col-3">Author</th>
            <td>{bbs.writerName}</td>
          </tr>
          <tr>
            <th>Title</th>
            <td>{bbs.title}</td>
          </tr>
          <tr>
            <th>Created Date</th>
            <td>{bbs.createdDate}</td>
          </tr>
          <tr>
            <th>Views</th>
            <td>{bbs.viewCount}</td>
          </tr>
        </tbody>
      </table>

      <div className="content-box">{bbs.content}</div>

      {mainFile && (
        <div className="mt-8-mb-8">
          <div className="meta fw-bold mb-8">Image</div>
          <div>
            <div className="bbs-detail-image-header">
              <div>
                <div>{mainFile.originFileName}</div>
                <div className="meta">{mainFile.fileType}</div>
              </div>
            </div>

            {mainFile.fileType && mainFile.fileType.startsWith('image/') && (
              <div className="mt-8-mb-8">
                <div className="bbs-detail-image-wrapper">
                  <img
                    className="bbs-detail-image"
                    src={`${api.defaults.baseURL}/board/${boardId}/file/download?fileId=${mainFile.fileId}`}
                    alt={mainFile.originFileName}
                    onClick={() => handleImageClick(`${api.defaults.baseURL}/board/${boardId}/file/download?fileId=${mainFile.fileId}`)}
                  />
                  {canEdit && (
                    <button
                      type="button"
                      className="bbs-detail-image-delete-btn"
                      onClick={handleDeleteImage}
                    >
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png"
                        alt="Delete"
                      />
                    </button>
                  )}
                </div>
              </div>
            )}

            {showPreview && (
              <ImagePreview src={previewSrc} onClose={() => setShowPreview(false)} />
            )}


            <a
              className="btn ghost"
              href={`${api.defaults.baseURL}/board/${boardId}/file/download?fileId=${mainFile.fileId}`}
            >
              Download
            </a>
          </div>
        </div>
      )}

      <hr className="sep" />
      <CommentList boardId={boardId} onRefreshReady={(fn) => refreshComments.current = fn} />
      {auth ? (
        <CommentWrite boardId={boardId} onCommentAdded={() => refreshComments.current?.()} />
      ) : (
        <div className="card bbs-detail-login-card">
          <div className="meta">Login to add a comment</div>
          <div className="actions bbs-detail-login-actions">
            <Link className="btn ghost" to="/login">Login</Link>
          </div>
        </div>
      )}


      
      
    </div>
  )
}
