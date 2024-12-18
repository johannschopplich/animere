(async () => {
  if (!('serviceWorker' in navigator))
    return

  const hasExistingSw = !!navigator.serviceWorker.controller

  if (import.meta.env.MODE === 'docs') {
    try {
      navigator.serviceWorker.register('/service-worker.js')
    }
    catch (error) {
      console.error('Failed to register service worker:', error)
    }
  }
  else if (hasExistingSw) {
    const registration = await navigator.serviceWorker.ready
    registration.unregister()
  }
})()
