/** Panel ve batarya `gameData` asset’leri için ortak küçük önizleme. */
function PanelThumbnail({ src, alt, className = '' }) {
  if (!src) return null
  return (
    <img
      src={src}
      alt={alt}
      className={`object-contain select-none pointer-events-none ${className}`}
      draggable={false}
    />
  )
}

export default PanelThumbnail
