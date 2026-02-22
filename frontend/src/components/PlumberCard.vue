<script setup lang="ts">
defineProps<{
  id: number
  name: string
  city: string
  phone?: string
  verified: boolean
}>()

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition duration-300 overflow-hidden flex flex-col">

    <!-- Bandeau coloré selon statut -->
    <div
      class="px-4 py-1.5 text-xs font-bold tracking-widest text-center uppercase"
      :class="verified ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'"
    >
      {{ verified ? '✔ Plombier certifié' : 'En attente de vérification' }}
    </div>

    <!-- Corps -->
    <div class="p-5 flex flex-col gap-4 flex-1">

      <!-- Avatar + Nom + Ville -->
      <div class="flex items-center gap-3">
        <div
          class="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          :class="verified ? 'bg-orange-500' : 'bg-gray-400'"
        >
          {{ getInitials(name) }}
        </div>
        <div>
          <h2 class="text-base font-semibold text-gray-800 dark:text-white leading-tight">{{ name }}</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {{ city }}
          </p>
        </div>
      </div>

      <!-- Téléphone -->
      <div
        class="flex items-center gap-2 text-sm rounded-lg px-3 py-2"
        :class="phone ? 'text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700' : 'text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />
        </svg>
        {{ phone || 'Numéro non renseigné' }}
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
        <span
          class="text-xs px-2.5 py-1 rounded-full font-medium"
          :class="verified
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'"
        >
          {{ verified ? '✔ Vérifié' : 'Non vérifié' }}
        </span>

        <div class="flex gap-2">
          <router-link
            :to="`/annuaire/${id}`"
            class="text-xs px-3 py-1.5 border border-orange-300 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition font-medium"
          >
            Voir
          </router-link>
          <a
            v-if="phone"
            :href="`tel:${phone}`"
            class="text-xs px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition font-medium"
          >
            Appeler
          </a>
        </div>
      </div>

    </div>
  </div>
</template>