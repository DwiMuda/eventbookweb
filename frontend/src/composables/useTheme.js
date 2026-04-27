import { ref, onMounted, watch } from 'vue'

export function useTheme() {
  const theme = ref(localStorage.getItem('theme') || 'light')

  const applyTheme = (val) => {
    const html = document.documentElement
    const body = document.body

    if (val === 'dark') {
      html.classList.add('dark')
      body.classList.add('dark')
      html.setAttribute('data-theme', 'dark')
    } else {
      html.classList.remove('dark')
      body.classList.remove('dark')
      html.setAttribute('data-theme', 'light')
    }
    
    localStorage.setItem('theme', val)
    console.log('Theme changed to:', val)
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  onMounted(() => {
    // Jalankan applyTheme saat pertama kali mount
    applyTheme(theme.value)
  })

  // Pastikan watcher selalu aktif
  watch(theme, (newVal) => {
    applyTheme(newVal)
  }, { immediate: true })

  return {
    theme,
    toggleTheme
  }
}
