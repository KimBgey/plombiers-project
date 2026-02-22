<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PlumberCard from '../components/PlumberCard.vue'
import { api } from '../lib/api'
import Layout from '../components/Layout.vue'

interface Plumber {
  id: number
  name: string
  city: string
  phone?: string
  verified: boolean
}

const plumbers = ref<Plumber[]>([])
const loading = ref(true)
const error = ref('')

const searchQuery = ref('')
const selectedCity = ref('')
const filterVerified = ref<'all' | 'verified' | 'unverified'>('all')

const currentPage = ref(1)
const pageSize = 6
const totalPages = ref(1)

const cities = ref<string[]>([])

onMounted(async () => {
  try {
    const res = await api.get('/plumbers')
    plumbers.value = res.data
    cities.value = Array.from(new Set(plumbers.value.map(p => p.city)))
    totalPages.value = Math.ceil(plumbers.value.length / pageSize)
  } catch (err: any) {
    console.error(err)
    error.value = 'Impossible de récupérer les plombiers.'
  } finally {
    loading.value = false
  }
})

const filteredPlumbers = computed(() => {
  let list = plumbers.value.filter(p => {
    const matchesCity = selectedCity.value ? p.city === selectedCity.value : true
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus =
      filterVerified.value === 'all' ? true
      : filterVerified.value === 'verified' ? p.verified
      : !p.verified
    return matchesCity && matchesSearch && matchesStatus
  })
  totalPages.value = Math.ceil(list.length / pageSize) || 1
  const start = (currentPage.value - 1) * pageSize
  return list.slice(start, start + pageSize)
})

const totalFiltered = computed(() => {
  return plumbers.value.filter(p => {
    const matchesCity = selectedCity.value ? p.city === selectedCity.value : true
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus =
      filterVerified.value === 'all' ? true
      : filterVerified.value === 'verified' ? p.verified
      : !p.verified
    return matchesCity && matchesSearch && matchesStatus
  }).length
})

const goToPage = (n: number) => {
  if (n < 1) n = 1
  else if (n > totalPages.value) n = totalPages.value
  currentPage.value = n
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedCity.value = ''
  filterVerified.value = 'all'
  currentPage.value = 1
}
</script>

<template>
  <Layout>
    <!-- Hero bandeau -->
    <div class="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-10">
      <div class="max-w-5xl mx-auto">
        <h1 class="text-4xl font-extrabold mb-2">Annuaire des Plombiers 🇧🇯</h1>
        <p class="text-white/85 text-lg">Trouvez un professionnel certifié près de chez vous</p>
      </div>
    </div>

    <div class="max-w-5xl mx-auto w-full px-6 py-8">

      <!-- Barre de recherche + filtres -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6">
        <div class="flex flex-col md:flex-row gap-3">
          <!-- Recherche -->
          <div class="flex-1 relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher un plombier..."
              class="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
              @input="currentPage = 1"
            />
          </div>

          <!-- Ville -->
          <select
            v-model="selectedCity"
            class="px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
            @change="currentPage = 1"
          >
            <option value="">Toutes les villes</option>
            <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
          </select>

          <!-- Statut -->
          <select
            v-model="filterVerified"
            class="px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
            @change="currentPage = 1"
          >
            <option value="all">Tous les statuts</option>
            <option value="verified">✅ Vérifiés</option>
            <option value="unverified">⏳ Non vérifiés</option>
          </select>

          <!-- Reset -->
          <button
            v-if="searchQuery || selectedCity || filterVerified !== 'all'"
            @click="resetFilters"
            class="px-4 py-2.5 text-sm text-orange-500 border border-orange-300 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      <!-- Compteur résultats -->
      <div class="flex items-center justify-between mb-4">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          <span class="font-semibold text-gray-700 dark:text-gray-200">{{ totalFiltered }}</span>
          plombier{{ totalFiltered > 1 ? 's' : '' }} trouvé{{ totalFiltered > 1 ? 's' : '' }}
        </p>
        <p v-if="totalPages > 1" class="text-sm text-gray-500 dark:text-gray-400">
          Page {{ currentPage }} / {{ totalPages }}
        </p>
      </div>

      <!-- État chargement -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="h-40 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
      </div>

      <!-- Erreur -->
      <div v-else-if="error"
        class="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ error }}
      </div>

      <!-- Aucun résultat -->
      <div v-else-if="filteredPlumbers.length === 0" class="text-center py-16">
        <div class="text-5xl mb-4">🔍</div>
        <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Aucun plombier trouvé</h3>
        <p class="text-gray-500 dark:text-gray-400 text-sm mb-4">Essayez de modifier vos filtres de recherche.</p>
        <button @click="resetFilters" class="px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm font-medium">
          Réinitialiser les filtres
        </button>
      </div>

      <!-- Grille cards -->
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PlumberCard
          v-for="plumber in filteredPlumbers"
          :key="plumber.id"
          :id="plumber.id"
          :name="plumber.name"
          :city="plumber.city"
          :phone="plumber.phone"
          :verified="plumber.verified"
          class="transform transition duration-300 hover:-translate-y-1 hover:shadow-lg"
        />
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center items-center mt-8 gap-2">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-4 py-2 border rounded-lg text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
        >
          ← Préc
        </button>

        <div class="flex gap-1">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page)"
            class="w-9 h-9 rounded-lg text-sm font-medium transition"
            :class="page === currentPage
              ? 'bg-orange-500 text-white'
              : 'border hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700'"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 border rounded-lg text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
        >
          Suiv →
        </button>
      </div>

    </div>
  </Layout>
</template>