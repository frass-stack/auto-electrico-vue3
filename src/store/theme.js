import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDarkMode: false
  }),
  
  getters: {
    currentTheme: (state) => state.isDarkMode ? 'dark' : 'light'
  },
  
  actions: {
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode
      localStorage.setItem('theme', this.currentTheme)
      document.documentElement.setAttribute('data-theme', this.currentTheme)
    },
    
    initializeTheme() {
      const savedTheme = localStorage.getItem('theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      
      this.isDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDark)
      document.documentElement.setAttribute('data-theme', this.currentTheme)
    }
  }
}) 