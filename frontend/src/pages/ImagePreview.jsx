
import React from 'react'

const ImagePreview = ({src,onClose}) => {
  return (
    <div className="image-preview-overlay">
      <button className="image-preview-close" onClick={onClose} >
        &times;
      </button>
      <img src={src} alt="Preview" className="image-preview-img" />
    </div>
  )
}

export default ImagePreview
