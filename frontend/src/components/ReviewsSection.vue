<template>
  <div class="space-y-6">

    <!-- Header stats -->
    <div class="flex items-center gap-6">
      <div class="text-center">
        <div class="text-4xl font-extrabold text-gray-800 dark:text-white">{{ average }}</div>
        <div class="flex justify-center gap-0.5 my-1">
          <span v-for="i in 5" :key="i" class="text-lg" :class="i <= Math.round(Number(average)) ? 'text-yellow-400' : 'text-gray-200 dark:text-gray-700'">★</span>
        </div>
        <div class="text-xs text-gray-400">{{ total }} avis</div>
      </div>

      <div class="flex-1 space-y-1.5">
        <div v-for="star in [5,4,3,2,1]" :key="star" class="flex items-center gap-2">
          <span class="text-xs text-gray-500 w-3">{{ star }}</span>
          <span class="text-yellow-400 text-xs">★</span>
          <div class="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              class="h-full bg-yellow-400 rounded-full transition-all duration-500"
              :style="{ width: getBarWidth(star) + '%' }"
            ></div>
          </div>
          <span class="text-xs text-gray-400 w-4">{{ getCount(star) }}</span>
        </div>
      </div>
    </div>

    <!-- Formulaire avis (connecté uniquement, pas le proprio) -->
    <div v-if="canReview" class="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-2xl p-5">
      <h3 class="font-semibold text-gray-800 dark:text-white mb-4 text-sm">Laisser un avis</h3>

      <!-- Étoiles interactives -->
      <div class="flex gap-1 mb-4">
        <button
          v-for="i in 5" :key="i"
          type="button"
          @click="newReview.rating = i"
          @mouseover="hoverRating = i"
          @mouseleave="hoverRating = 0"
          class="text-2xl transition-transform hover:scale-110"
          :class="i <= (hoverRating || newReview.rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'"
        >★</button>
        <span class="text-sm text-gray-500 dark:text-gray-400 ml-2 self-center">
          {{ ratingLabel }}
        </span>
      </div>

      <textarea
        v-model="newReview.comment"
        placeholder="Partagez votre expérience avec ce plombier..."
        rows="3"
        class="w-full p-3 border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
      ></textarea>

      <div class="flex items-center justify-between mt-3">
        <p v-if="reviewError" class="text-red-500 text-xs">{{ reviewError }}</p>
        <div v-else></div>
        <button
          @click="submitReview"
          :disabled="submitting || newReview.rating === 0"
          class="flex items-center gap-2 px-5 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-sm font-semibold rounded-xl transition"
        >
          <svg v-if="submitting" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 14 8.373 14 12h-4z"></path>
          </svg>
          {{ submitting ? 'Envoi...' : 'Publier l\'avis' }}
        </button>
      </div>
    </div>

    <div v-else-if="!isAuthenticated" class="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
      <router-link to="/login" class="text-orange-500 font-medium hover:underline">Connectez-vous</router-link>
      pour laisser un avis
    </div>

    <!-- Liste des avis -->
    <div v-if="reviews.length === 0" class="text-center py-8 text-gray-400 text-sm">
      Aucun avis pour l'instant. Soyez le premier !
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="review in reviews"
        :key="review.id"
        class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4"
      >
        <div class="flex items-start justify-between mb-2">
          <div class="flex gap-0.5">
            <span v-for="i in 5" :key="i" class="text-sm" :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-200 dark:text-gray-700'">★</span>
          </div>
          <span class="text-xs text-gray-400">{{ formatDate(review.createdAt) }}</span>
        </div>
        <p v-if="review.comment" class="text-sm text-gray-600 dark:text-gray-300">{{ review.comment }}</p>
        <p v-else class="text-sm text-gray-400 italic">Aucun commentaire</p>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { api, isAuthenticated as checkAuth } from '../lib/api'

const emit = defineEmits<{ (e: "statsUpdated", stats: { average: string; total: number }): void }>()

const props = defineProps<{
  plumberId: number
  ownerId?: number  // ID du plombier affiché, pour bloquer l'auto-notation
}>()

const reviews = ref<any[]>([])
const total = ref(0)
const average = ref('0.0')
const submitting = ref(false)
const reviewError = ref('')
const hoverRating = ref(0)
const isAuthenticated = ref(checkAuth())

const newReview = ref({ rating: 0, comment: '' })

// L'utilisateur connecté ne peut pas noter le plombier dont il est le propriétaire
const canReview = computed(() => {
  return isAuthenticated.value
})

const ratingLabels = ['', 'Mauvais', 'Passable', 'Bien', 'Très bien', 'Excellent']
const ratingLabel = computed(() => ratingLabels[hoverRating.value || newReview.value.rating] || '')

const getCount = (star: number) => reviews.value.filter(r => r.rating === star).length

const getBarWidth = (star: number) => {
  if (total.value === 0) return 0
  return (getCount(star) / total.value) * 100
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

onMounted(async () => {
  await loadReviews()
})

const loadReviews = async () => {
  try {
    const res = await api.get(`/plumbers/${props.plumberId}/reviews`)
    reviews.value = res.data.reviews
    total.value = res.data.total
    average.value = res.data.average.toFixed(1)
    emit("statsUpdated", { average: average.value, total: total.value })
  } catch {
    // silencieux
  }
}

const submitReview = async () => {
  if (newReview.value.rating === 0) return
  submitting.value = true
  reviewError.value = ''

  try {
    await api.post(`/plumbers/${props.plumberId}/reviews`, {
      rating: newReview.value.rating,
      comment: newReview.value.comment || undefined,
    })
    newReview.value = { rating: 0, comment: '' }
    await loadReviews()
  } catch (err: any) {
    reviewError.value = err.response?.data?.message || 'Erreur lors de l\'envoi'
  } finally {
    submitting.value = false
  }
}
</script>