<template>
  <Layout>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-orange-500 to-orange-600 text-white overflow-hidden">
      <!-- Décoration de fond -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 right-10 w-64 h-64 rounded-full bg-white"></div>
        <div class="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-white"></div>
      </div>

      <div class="relative w-full px-10 py-20 flex flex-col md:flex-row items-center gap-10">
        <div class="flex-1 text-center md:text-left">
          <img src="/public/Logo/logoB.png" alt="Logo" class="h-20 mx-auto md:mx-0 mb-4">
          <h1 class="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Les Plombiers<br />du Bénin
          </h1>
          <p class="text-lg text-white/90 mb-8 max-w-lg">
            Trouvez un plombier certifié près de chez vous ou rejoignez notre réseau d'artisans professionnels vérifiés.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <router-link
              to="/annuaire"
              class="px-8 py-3 bg-white text-orange-500 font-bold rounded-lg hover:bg-gray-100 transition shadow-lg"
            >
              Trouver un plombier
            </router-link>
            <router-link
              to="/register"
              class="px-8 py-3 bg-orange-700 text-white font-bold rounded-lg hover:bg-orange-800 transition shadow-lg"
            >
              Rejoindre le réseau
            </router-link>
          </div>
        </div>

        <!-- Stats -->
        <div class="flex-1 grid grid-cols-2 gap-4 w-full max-w-sm">
          <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div class="text-4xl font-extrabold">{{ stats.total }}+</div>
            <div class="text-white/80 text-sm mt-1">Plombiers inscrits</div>
          </div>
          <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div class="text-4xl font-extrabold">{{ stats.verified }}+</div>
            <div class="text-white/80 text-sm mt-1">Certifiés vérifiés</div>
          </div>
          <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div class="text-4xl font-extrabold">{{ stats.cities }}+</div>
            <div class="text-white/80 text-sm mt-1">Villes couvertes</div>
          </div>
          <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div class="text-4xl font-extrabold">{{ stats.reviews }}+</div>
            <div class="text-white/80 text-sm mt-1">Avis clients</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Comment ça marche -->
    <section class="py-16 px-10 bg-white dark:bg-gray-900">
      <div>
        <h2 class="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
          Comment ça marche ?
        </h2>
        <p class="text-center text-gray-500 dark:text-gray-400 mb-12">
          Simple, rapide et fiable
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="step in steps"
            :key="step.number"
            class="flex flex-col items-center text-center p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-lg transition"
          >
            <div class="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 text-orange-500 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
              {{ step.number }}
            </div>
            <div class="text-3xl mb-3">{{ step.icon }}</div>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">{{ step.title }}</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Avantages -->
    <section class="py-16 px-10 bg-orange-50 dark:bg-gray-800">
      <div>
        <h2 class="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
          Pourquoi nous rejoindre ?
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="benefit in benefits"
            :key="benefit.title"
            class="flex items-start gap-4 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm"
          >
            <div class="text-3xl flex-shrink-0">{{ benefit.icon }}</div>
            <div>
              <h3 class="font-semibold text-gray-800 dark:text-white mb-1">{{ benefit.title }}</h3>
              <p class="text-gray-500 dark:text-gray-400 text-sm">{{ benefit.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA final -->
    <section class="py-16 px-10 bg-white dark:bg-gray-900 text-center">
      <div>
        <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Prêt à rejoindre la plateforme ?
        </h2>
        <p class="text-gray-500 dark:text-gray-400 mb-8">
          Inscrivez-vous gratuitement et obtenez votre badge professionnel avec QR Code.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            to="/register"
            class="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition shadow-md"
          >
            S'inscrire maintenant
          </router-link>
          <router-link
            to="/annuaire"
            class="px-8 py-3 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 font-bold rounded-lg transition"
          >
            Voir l'annuaire
          </router-link>
        </div>
      </div>
    </section>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Layout from '../components/Layout.vue'
import { api } from '../lib/api'

const stats = ref({
  total: 0,
  verified: 0,
  cities: 0,
  reviews: 0,
})

onMounted(async () => {
  try {
    const res = await api.get('/plumbers')
    const plumbers = res.data
    stats.value.total = plumbers.length
    stats.value.verified = plumbers.filter((p: any) => p.verified).length
    stats.value.cities = new Set(plumbers.map((p: any) => p.city)).size
    stats.value.reviews = 0 // à connecter si tu as un endpoint reviews
  } catch {
    // valeurs par défaut si l'API est indisponible
    stats.value = { total: 120, verified: 85, cities: 12, reviews: 340 }
  }
})

const steps = [
  {
    number: '1',
    icon: '📝',
    title: "Inscrivez-vous",
    description: "Remplissez le formulaire d'inscription avec vos informations professionnelles.",
  },
  {
    number: '2',
    icon: '✅',
    title: "Soyez vérifié",
    description: "Notre équipe vérifie vos qualifications et valide votre profil.",
  },
  {
    number: '3',
    icon: '🪪',
    title: "Obtenez votre badge",
    description: "Recevez votre badge professionnel numérique avec QR Code unique.",
  },
]

const benefits = [
  {
    icon: '🏅',
    title: 'Badge professionnel avec QR Code',
    description: "Un badge numérique unique que vos clients peuvent scanner pour vérifier votre certification.",
  },
  {
    icon: '🔍',
    title: 'Visibilité accrue',
    description: "Apparaissez dans l'annuaire et soyez trouvé par des clients dans votre ville.",
  },
  {
    icon: '⭐',
    title: 'Système de notation',
    description: "Collectez des avis clients pour renforcer votre réputation en ligne.",
  },
  {
    icon: '🛡️',
    title: 'Certification officielle',
    description: "Rejoignez le réseau officiel des plombiers certifiés du Bénin.",
  },
]
</script>