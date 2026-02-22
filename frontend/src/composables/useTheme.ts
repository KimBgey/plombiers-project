// src/composables/useTheme.ts
import { ref, watch, onMounted } from 'vue'

const isDark = ref(false)

export function useTheme() {
  const applyTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light')
    isDark.value = dark
  }

  const initTheme = () => {
    const saved = localStorage.getItem('theme')
    if (saved) {
      // Priorité au choix de l'utilisateur
      applyTheme(saved === 'dark')
    } else {
      // Thème clair par défaut
      applyTheme(false)
    }

    // Écouter les changements du système si pas de préférence enregistrée
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        applyTheme(e.matches)
      }
    })
  }

  const toggleTheme = () => applyTheme(!isDark.value)

  const resetToSystem = () => {
    localStorage.removeItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    applyTheme(prefersDark)
  }

  return { isDark, initTheme, toggleTheme, resetToSystem, applyTheme }
}