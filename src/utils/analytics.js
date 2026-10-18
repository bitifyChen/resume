const measurementIdPattern = /^G-[A-Z\d]+$/i

let activeMeasurementId = ''

export function initializeAnalytics(measurementId, isProduction = false) {
  if (
    !isProduction ||
    typeof window === 'undefined' ||
    !measurementIdPattern.test(measurementId || '')
  ) {
    return false
  }

  if (activeMeasurementId === measurementId) return true

  activeMeasurementId = measurementId
  window.dataLayer = window.dataLayer || []
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments)
    }

  window.gtag('js', new Date())
  window.gtag('config', measurementId, { send_page_view: false })

  if (!document.getElementById('google-analytics-script')) {
    const script = document.createElement('script')
    script.id = 'google-analytics-script'
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    document.head.appendChild(script)
  }

  return true
}

export function trackPageView(path, title) {
  if (!activeMeasurementId || typeof window === 'undefined' || !window.gtag) return

  const pagePath = path?.split(/[?#]/, 1)[0] || '/'
  window.gtag('event', 'page_view', {
    page_title: title,
    page_location: `${window.location.origin}${pagePath}`,
    page_path: pagePath
  })
}
