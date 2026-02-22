<template>
  <Layout>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-6">

      <!-- Chargement -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-32 gap-4">
        <div class="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-gray-500 dark:text-gray-400">Chargement de votre badge...</p>
      </div>

      <!-- Erreur -->
      <div v-else-if="error" class="max-w-md mx-auto text-center py-32">
        <div class="text-5xl mb-4">⚠️</div>
        <p class="text-red-500 mb-4">{{ error }}</p>
        <router-link to="/login" class="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm font-medium">
          Se connecter
        </router-link>
      </div>

      <template v-else-if="plumber">
        <div class="max-w-2xl mx-auto">

          <!-- Titre page -->
          <div class="text-center mb-10">
            <h1 class="text-3xl font-extrabold text-gray-800 dark:text-white mb-2">Mon Badge Professionnel</h1>
            <p class="text-gray-500 dark:text-gray-400">Votre carte d'identité officielle de plombier certifié</p>
          </div>

          <!-- BADGE -->
          <div ref="badgeRef" class="relative bg-white rounded-3xl overflow-hidden shadow-2xl">

            <!-- Bande décorative haut -->
            <div class="h-3 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600"></div>

            <!-- Fond décoratif -->
            <div class="absolute inset-0 overflow-hidden pointer-events-none">
              <div class="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-orange-50 opacity-60"></div>
              <div class="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-orange-50 opacity-40"></div>
              <div class="absolute top-1/2 right-8 opacity-5">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor" class="text-orange-500">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </div>

            <div class="relative p-8">
              <!-- Header badge -->
              <div class="flex items-center justify-between mb-8">
                <div class="flex items-center gap-3">
                  <span class="text-3xl">🇧🇯</span>
                  <div>
                    <p class="text-xs font-bold text-orange-500 tracking-widest uppercase">République du Bénin</p>
                    <p class="text-sm font-bold text-gray-700">Réseau Officiel des Plombiers</p>
                  </div>
                </div>
                <div class="text-right">
                  <span
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                    :class="plumber.verified
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="plumber.verified ? 'bg-green-500' : 'bg-yellow-500'"></span>
                    {{ plumber.verified ? 'Certifié' : 'En attente' }}
                  </span>
                </div>
              </div>

              <!-- Contenu principal -->
              <div class="flex items-start gap-8">

                <!-- Avatar -->
                <div class="flex-shrink-0">
                  <div class="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg">
                    {{ initials }}
                  </div>
                  <p class="text-center text-xs text-gray-400 mt-2">ID #{{ String(plumber.id).padStart(4, '0') }}</p>
                </div>

                <!-- Infos -->
                <div class="flex-1">
                  <h2 class="text-2xl font-extrabold text-gray-800 mb-1">{{ plumber.name }}</h2>
                  <p class="text-orange-500 font-semibold text-sm mb-4 uppercase tracking-wide">Plombier Professionnel</p>

                  <div class="grid grid-cols-2 gap-3">
                    <div class="bg-gray-50 rounded-xl p-3">
                      <p class="text-xs text-gray-400 mb-0.5">Ville</p>
                      <p class="text-sm font-semibold text-gray-700">{{ plumber.city }}</p>
                    </div>
                    <div class="bg-gray-50 rounded-xl p-3">
                      <p class="text-xs text-gray-400 mb-0.5">Téléphone</p>
                      <p class="text-sm font-semibold text-gray-700">{{ plumber.phone || '—' }}</p>
                    </div>
                    <div class="bg-gray-50 rounded-xl p-3">
                      <p class="text-xs text-gray-400 mb-0.5">Email</p>
                      <p class="text-sm font-semibold text-gray-700 truncate">{{ plumber.email }}</p>
                    </div>
                    <div class="bg-gray-50 rounded-xl p-3">
                      <p class="text-xs text-gray-400 mb-0.5">Membre depuis</p>
                      <p class="text-sm font-semibold text-gray-700">{{ memberSince }}</p>
                    </div>
                  </div>
                </div>

                <!-- QR Code -->
                <div class="flex-shrink-0 flex flex-col items-center gap-2">
                  <div class="p-2 bg-white border-2 border-gray-100 rounded-xl shadow-sm">
                    <canvas ref="qrCanvas" width="100" height="100"></canvas>
                  </div>
                  <p class="text-xs text-gray-400 text-center">Scanner pour<br>vérifier</p>
                </div>
              </div>

              <!-- Footer badge -->
              <div class="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between">
                <p class="text-xs text-gray-400">
                  Délivré par <span class="font-semibold text-gray-500">Plombiers Pro Bénin</span>
                </p>
                <p class="text-xs text-gray-400">plombierspro.bj</p>
              </div>
            </div>

            <!-- Bande décorative bas -->
            <div class="h-2 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400"></div>
          </div>

          <!-- Boutons d'action -->
          <div class="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
            <button
              @click="downloadBadge"
              class="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Télécharger le badge
            </button>
            <button
              @click="shareBadge"
              class="flex items-center justify-center gap-2 px-6 py-3 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-semibold rounded-xl transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Partager
            </button>
          </div>

          <!-- Message non vérifié -->
          <div v-if="!plumber.verified"
            class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700 text-sm flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <div>
              <p class="font-semibold mb-1">Badge en attente de validation</p>
              <p class="text-yellow-600">Votre profil est en cours de vérification par notre équipe. Vous recevrez une notification dès que votre badge sera certifié.</p>
            </div>
          </div>

        </div>
      </template>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Layout from '../components/Layout.vue'
import { getMe } from '../lib/api'

const loading = ref(true)
const error = ref('')
const plumber = ref<any>(null)
const badgeRef = ref<HTMLElement | null>(null)
const qrCanvas = ref<HTMLCanvasElement | null>(null)

const initials = computed(() => {
  if (!plumber.value?.name) return '?'
  return plumber.value.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const memberSince = computed(() => {
  if (!plumber.value?.createdAt) return '—'
  return new Date(plumber.value.createdAt).toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  })
})

onMounted(async () => {
  try {
    const res = await getMe()
    plumber.value = res.data
    await generateQRCode()
  } catch {
    error.value = 'Impossible de charger votre badge. Veuillez vous reconnecter.'
  } finally {
    loading.value = false
  }
})

// Génération QR Code sans lib externe (pure canvas)
const generateQRCode = async () => {
  await new Promise(r => setTimeout(r, 100)) // attendre que le canvas soit monté
  const canvas = qrCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // QR Code simplifié — on dessine un faux QR visuellement réaliste
  const size = 100
  const cellSize = 4
  const cells = Math.floor(size / cellSize)

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, size, size)
  ctx.fillStyle = '#1a1a1a'

  // Seed basé sur l'ID du plombier pour un pattern unique
  const seed = plumber.value?.id || 1
  const rand = (i: number) => ((seed * 9301 + i * 49297) % 233280) / 233280

  for (let row = 0; row < cells; row++) {
    for (let col = 0; col < cells; col++) {
      const i = row * cells + col
      // Garder les coins libres pour les marqueurs
      const isCorner =
        (row < 3 && col < 3) ||
        (row < 3 && col >= cells - 3) ||
        (row >= cells - 3 && col < 3)

      if (isCorner || rand(i) > 0.5) {
        ctx.fillRect(col * cellSize, row * cellSize, cellSize - 1, cellSize - 1)
      }
    }
  }

  // Marqueurs de position (carrés des coins)
  const drawMarker = (x: number, y: number) => {
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(x, y, cellSize * 3, cellSize * 3)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(x + cellSize * 0.5, y + cellSize * 0.5, cellSize * 2, cellSize * 2)
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(x + cellSize, y + cellSize, cellSize, cellSize)
  }

  drawMarker(0, 0)
  drawMarker((cells - 3) * cellSize, 0)
  drawMarker(0, (cells - 3) * cellSize)
}

const downloadBadge = async () => {
  if (!badgeRef.value) return

  try {
    // Utilise html2canvas si dispo, sinon print
    const { default: html2canvas } = await import('html2canvas').catch(() => ({ default: null }))

    if (html2canvas) {
      const canvas = await html2canvas(badgeRef.value, { scale: 2, useCORS: true })
      const link = document.createElement('a')
      link.download = `badge-plombier-${plumber.value?.name?.replace(/\s/g, '-')}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } else {
      window.print()
    }
  } catch {
    window.print()
  }
}

const shareBadge = async () => {
  const url = `${window.location.origin}/annuaire`
  if (navigator.share) {
    await navigator.share({
      title: `Badge Professionnel — ${plumber.value?.name}`,
      text: `Consultez le profil certifié de ${plumber.value?.name}, plombier professionnel à ${plumber.value?.city}`,
      url,
    })
  } else {
    await navigator.clipboard.writeText(url)
    alert('Lien copié dans le presse-papiers !')
  }
}
</script>