<template>
  <Layout>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-6">

      <!-- Chargement -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-32 gap-4">
        <div class="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-gray-500 dark:text-gray-400">Chargement du profil...</p>
      </div>

      <!-- Erreur -->
      <div v-else-if="error" class="max-w-md mx-auto text-center py-32">
        <div class="text-5xl mb-4">🔍</div>
        <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
        <router-link to="/annuaire" class="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm font-medium">
          ← Retour à l'annuaire
        </router-link>
      </div>

      <template v-else-if="plumber">
        <div class="max-w-4xl mx-auto space-y-6">

          <!-- Retour -->
          <router-link to="/annuaire" class="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Retour à l'annuaire
          </router-link>

          <!-- Carte profil -->
          <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-sm overflow-hidden">
            <!-- Bannière -->
            <div class="h-32 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 relative pb-6">
              <div class="absolute inset-0 opacity-10">
                <div class="absolute top-3 right-16 w-36 h-36 rounded-full bg-white"></div>
                <div class="absolute -bottom-10 left-24 w-28 h-28 rounded-full bg-white"></div>
              </div>
            </div>

            <div class="px-8 pb-8">
              <div class="flex flex-col sm:flex-row sm:items-end justify-between mt-4 mb-6 gap-4">
                <!-- Avatar -->
                <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg border-4 border-white dark:border-gray-900">
                  {{ initials }}
                </div>

                <!-- Actions -->
                <div class="flex gap-3">
                  <a v-if="plumber.phone" :href="`tel:${plumber.phone}`"
                    class="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />
                    </svg>
                    Appeler
                  </a>
                  <a v-if="plumber.phone" :href="`https://wa.me/${plumber.phone.replace(/\s/g, '')}`" target="_blank"
                    class="flex items-center gap-2 px-4 py-2 border-2 border-green-400 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 text-sm font-semibold rounded-xl transition">
                    WhatsApp
                  </a>
                </div>
              </div>

              <!-- Infos -->
              <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h1 class="text-2xl font-extrabold text-gray-800 dark:text-white">{{ plumber.name }}</h1>
                  <p class="text-orange-500 font-medium text-sm mt-0.5">Plombier Professionnel</p>

                  <div class="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                    <span class="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {{ plumber.city }}
                    </span>
                    <span v-if="plumber.phone" class="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />
                      </svg>
                      {{ plumber.phone }}
                    </span>
                    <span class="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Membre depuis {{ memberSince }}
                    </span>
                  </div>
                </div>

                <!-- Badge statut + note -->
                <div class="flex flex-col items-start sm:items-end gap-2">
                  <span
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                    :class="plumber.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="plumber.verified ? 'bg-green-500' : 'bg-yellow-500'"></span>
                    {{ plumber.verified ? 'Certifié' : 'En attente' }}
                  </span>
                  <div v-if="reviewStats.total > 0" class="flex items-center gap-1.5">
                    <span class="text-yellow-400 text-sm">★</span>
                    <span class="text-sm font-bold text-gray-700 dark:text-white">{{ reviewStats.average }}</span>
                    <span class="text-xs text-gray-400">({{ reviewStats.total }} avis)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Section avis -->
          <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-8">
            <h2 class="text-lg font-bold text-gray-800 dark:text-white mb-6">Avis clients</h2>
            <ReviewsSection
              :plumber-id="plumber.id"
              @stats-updated="updateStats"
            />
          </div>

        </div>
      </template>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Layout from '../components/Layout.vue'
import ReviewsSection from '../components/ReviewsSection.vue'
import { api } from '../lib/api'

const route = useRoute()
const loading = ref(true)
const error = ref('')
const plumber = ref<any>(null)
const reviewStats = ref({ average: '0.0', total: 0 })

const initials = computed(() => {
  if (!plumber.value?.name) return '?'
  return plumber.value.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
})

const memberSince = computed(() => {
  if (!plumber.value?.createdAt) return '—'
  return new Date(plumber.value.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
})

onMounted(async () => {
  try {
    const id = route.params.id
    const res = await api.get(`/plumbers/${id}`)
    plumber.value = res.data
  } catch {
    error.value = 'Plombier introuvable.'
  } finally {
    loading.value = false
  }
})

const updateStats = (stats: { average: string; total: number }) => {
  reviewStats.value = stats
}
</script>