function ScreenViewApp() {
  const screenBody = document.querySelector('body')
  const screenParent = document.querySelector('.screen-parent')
  const screenContainer = document.querySelector('.screen-container')
  let isDragging = false
  let startX, startY, initialLeft, initialTop, scale;
  // Handling for touchscreens (Android responsiveness)
  let touchStartX, touchStartY;
  scale = 1;

  const applyZoom = (delta) => {
    if (delta > 0) {
      scale -= 0.05
    } else {
      scale += 0.05
    }
    scale = Math.min(Math.max(0.2, scale), 5)
    screenContainer.style.transform = `scale(${scale})`
  }

  document.addEventListener('mousedown', (e) => {
    isDragging = true
    startX = e.clientX
    startY = e.clientY
    const rect = screenParent.getBoundingClientRect()
    initialLeft = rect.left
    initialTop = rect.top
    screenBody.style.cursor = 'grabbing'
  })
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    screenParent.style.left = `${initialLeft + dx}px`
    screenParent.style.top = `${initialTop + dy}px`
  })
  document.addEventListener('mouseup', () => {
    isDragging = false
    screenBody.style.cursor = 'grab'
  })

  document.addEventListener('wheel', (e) => {
    if (e.altKey || e.ctrlKey) {
      e.preventDefault()
      applyZoom(e.deltaY)
    }
  }, { passive: false })
  screenParent.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
      
      const rect = screenParent.getBoundingClientRect()
      initialLeft = rect.left
      initialTop = rect.top
    } else if (e.touches.length === 2) {
      isDragging = false
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
      screenContainer.dataset.initialDistance = distance
      screenContainer.dataset.initialScale = scale
    }
  })
  screenParent.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length === 1) {
      const dx = e.touches[0].clientX - touchStartX
      const dy = e.touches[0].clientY - touchStartY
      screenParent.style.left = `${initialLeft + dx}px`
      screenParent.style.top = `${initialTop + dy}px`
    } else if (e.touches.length === 2) {
      // Handle pinch to zoom
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
      const initialDistance = screenContainer.dataset.initialDistance
      const newScale = (distance / initialDistance) * screenContainer.dataset.initialScale
      scale = Math.min(Math.max(0.2, newScale), 5)
      screenContainer.style.transform = `scale(${scale})`
    }
  })
  screenParent.addEventListener('touchend', () => {
    isDragging = false
  })
}
ScreenViewApp()