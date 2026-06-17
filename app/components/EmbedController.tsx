'use client'
import { useEffect } from 'react'

export default function EmbedController() {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('embed') === '1') {
      document.body.classList.add('embed-mode')
    }
  }, [])
  return null
}
