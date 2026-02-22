<template>
  <header class="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm sticky top-0 z-50">
    <div class="w-full px-6 flex justify-between items-center h-16">

      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-2 font-extrabold text-xl text-gray-800 dark:text-white hover:text-orange-500 transition">
        <div>
          <img src="/public/Logo/logoP.png" alt="Logo" class="h-8">
        </div>
        <span>Plombiers <span class="text-orange-500">Pro</span></span>
      </router-link>

      <!-- Nav desktop -->
      <nav class="hidden md:flex items-center gap-6">
        <router-link
          to="/"
          class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition"
          active-class="text-orange-500 dark:text-orange-400"
        >
          Accueil
        </router-link>
        <router-link
          to="/annuaire"
          class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition"
          active-class="text-orange-500 dark:text-orange-400"
        >
          Annuaire
        </router-link>

        <!-- Non connecté -->
        <template v-if="!authenticated">
          <router-link
            to="/login"
            class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-orange-500 transition"
          >
            Connexion
          </router-link>
          <router-link
            to="/register"
            class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition"
          >
            S'inscrire
          </router-link>
        </template>

        <!-- Connecté -->
        <template v-else>
          <!-- Lien Admin visible uniquement pour les admins -->
          <router-link
            v-if="userRole === 'ADMIN'"
            to="/admin"
            class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 dark:bg-gray-700 text-white text-xs font-bold rounded-lg hover:bg-gray-700 transition"
          >
            ⚙️ Dashboard
          </router-link>

          <div class="relative" ref="dropdownRef">
            <button
              @click="dropdownOpen = !dropdownOpen"
              class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-orange-500 transition"
            >
              <div
                class="w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold"
                :class="userRole === 'ADMIN' ? 'bg-gray-800 dark:bg-gray-700' : 'bg-orange-500'"
              >
                {{ initials }}
              </div>
              <span class="hidden lg:block">{{ userName }}</span>
              <svg class="h-4 w-4 text-gray-400" :class="{ 'rotate-180': dropdownOpen }" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown -->
            <div
              v-if="dropdownOpen"
              class="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-50"
            >
              <!-- Badge admin -->
              <div v-if="userRole === 'ADMIN'" class="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Administrateur</span>
              </div>

              <router-link v-if="userRole === 'ADMIN'" to="/admin" @click="dropdownOpen = false"
                class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-500 transition">
                ⚙️ Dashboard admin
              </router-link>

              <router-link to="/badge" @click="dropdownOpen = false"
                class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-500 transition">
                🪪 Mon badge
              </router-link>
              <router-link to="/profil" @click="dropdownOpen = false"
                class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-500 transition">
                👤 Mon profil
              </router-link>
              <hr class="my-1 border-gray-100 dark:border-gray-700" />
              <button
                @click="handleLogout"
                class="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Se déconnecter
              </button>
            </div>
          </div>
        </template>
      </nav>

      <!-- Burger mobile -->
      <button @click="mobileOpen = !mobileOpen" class="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
        <svg v-if="!mobileOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Menu mobile -->
    <div v-if="mobileOpen" class="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-4 flex flex-col gap-3">
      <router-link to="/" @click="mobileOpen = false" class="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-orange-500">Accueil</router-link>
      <router-link to="/annuaire" @click="mobileOpen = false" class="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-orange-500">Annuaire</router-link>

      <template v-if="!authenticated">
        <router-link to="/login" @click="mobileOpen = false" class="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-orange-500">Connexion</router-link>
        <router-link to="/register" @click="mobileOpen = false" class="text-sm font-semibold text-orange-500 hover:text-orange-600">S'inscrire</router-link>
      </template>

      <template v-else>
        <router-link v-if="userRole === 'ADMIN'" to="/admin" @click="mobileOpen = false"
          class="text-sm font-bold text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg">
          ⚙️ Dashboard admin
        </router-link>
        <router-link to="/badge" @click="mobileOpen = false" class="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-orange-500">🪪 Mon badge</router-link>
        <router-link to="/profil" @click="mobileOpen = false" class="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-orange-500">👤 Mon profil</router-link>
        <button @click="handleLogout" class="text-left text-sm font-medium text-red-500 hover:text-red-600">Se déconnecter</button>
      </template>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { isAuthenticated, logout, getMe } from '../lib/api'

const router = useRouter()
const authenticated = ref(isAuthenticated())
const dropdownOpen = ref(false)
const mobileOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const userName = ref('')
const userRole = ref('')

const initials = computed(() => {
  return userName.value
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

onMounted(async () => {
  if (authenticated.value) {
    try {
      const res = await getMe()
      userName.value = res.data.name
      userRole.value = res.data.role
    } catch {
      authenticated.value = false
    }
  }

  // Ferme le dropdown en cliquant ailleurs
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleClickOutside = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    dropdownOpen.value = false
  }
}

const handleLogout = () => {
  dropdownOpen.value = false
  mobileOpen.value = false
  logout()
}

// Mettre à jour l'état auth à chaque navigation
router.afterEach(() => {
  authenticated.value = isAuthenticated()
})
</script>