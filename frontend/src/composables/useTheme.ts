import { ref } from 'vue'

// Estado global para la sesión actual de la app
const isDark = ref(true)

export function useTheme() {
    const applyTheme = (dark: boolean) => {
        isDark.value = dark
        if (dark) {
            document.documentElement.setAttribute('data-theme', 'dark')
        } else {
            document.documentElement.removeAttribute('data-theme')
        }
        localStorage.setItem('theme', dark ? 'dark' : 'light')
    }

    const toggleTheme = () => applyTheme(!isDark.value)

    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme === 'light') {
            applyTheme(false)
        } else {
            applyTheme(true)
        }
    }

    return { isDark, toggleTheme, initTheme }
}
