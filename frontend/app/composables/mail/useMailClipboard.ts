export function useMailClipboard() {
  const copied = ref(false)
  let timeout: ReturnType<typeof setTimeout> | null = null

  async function copy(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        fallbackCopyText(text)
      }
      setCopied(true)
      return true
    } catch (e) {
      console.error('Copy failed:', e)
      return false
    }
  }

  function fallbackCopyText(text: string) {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.left = '0'
    textarea.style.top = '0'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()

    try {
      document.execCommand('copy')
    } catch (e) {
      console.error('Fallback copy failed:', e)
    }

    document.body.removeChild(textarea)
  }

  function setCopied(value: boolean) {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
    copied.value = value
    if (value) {
      timeout = setTimeout(() => {
        copied.value = false
      }, 2000)
    }
  }

  onUnmounted(() => {
    if (timeout) {
      clearTimeout(timeout)
    }
  })

  return {
    copied,
    copy,
  }
}
