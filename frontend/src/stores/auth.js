// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/index'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')

  const setAuth = (data) => {
    token.value = data.token
    user.value = data.user
    localStorage.setItem('token', data.token)
  }

  const login = async (credentials) => {
    loading.value = true
    try {
      const { data } = await authApi.login(credentials)
      setAuth(data.data)
      router.push('/dashboard')
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    loading.value = true
    try {
      await authApi.register(userData)
    } finally {
      loading.value = false
    }
  }

  const fetchUser = async () => {
    if (!token.value) return
    try {
      const { data } = await authApi.me()
      user.value = data.data
    } catch {
      logout()
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    router.push('/login')
  }

  return { user, token, loading, isAuthenticated, isAdmin, login, register, fetchUser, logout }
})
