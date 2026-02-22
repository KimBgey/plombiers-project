<template>
  <Layout>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-6">

      <!-- Chargement -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-32 gap-4">
        <div class="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-gray-500 dark:text-gray-400">Chargement du profil...</p>
      </div>

      <template v-else-if="plumber">
        <div class="max-w-3xl mx-auto space-y-6">

          <!-- Header profil -->
          <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-sm overflow-hidden">
            <div class="h-28 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 relative">
              <div class="absolute inset-0 opacity-10">
                <div class="absolute top-2 right-10 w-32 h-32 rounded-full bg-white"></div>
                <div class="absolute -bottom-8 left-20 w-24 h-24 rounded-full bg-white"></div>
              </div>
            </div>
            <div class="px-8 pb-8">
              <div class="flex items-end justify-between  mb-4">
                <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg border-4 border-white dark:border-gray-900">
                  {{ initials }}
                </div>
                <span
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold mb-1"
                  :class="plumber.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="plumber.verified ? 'bg-green-500' : 'bg-yellow-500'"></span>
                  {{ plumber.verified ? 'Certifié' : 'En attente de vérification' }}
                </span>
              </div>
              <h1 class="text-2xl font-extrabold text-gray-800 dark:text-white">{{ plumber.name }}</h1>
              <p class="text-orange-500 font-medium text-sm">Plombier Professionnel · {{ plumber.city }}</p>
            </div>
          </div>

          <!-- Notifications -->
          <div v-if="successMessage"
            class="p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-sm flex items-center gap-2 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ successMessage }}
          </div>
          <div v-if="errorMessage"
            class="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm flex items-center gap-2 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ errorMessage }}
          </div>

          <!-- Formulaire infos -->
          <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-bold text-gray-800 dark:text-white">Informations personnelles</h2>
              <button
                v-if="!editing"
                @click="editing = true"
                class="flex items-center gap-2 text-sm text-orange-500 hover:text-orange-600 font-medium transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Modifier
              </button>
            </div>

            <form @submit.prevent="saveProfile" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Nom complet</label>
                  <input
                    v-model="form.name"
                    :disabled="!editing"
                    type="text"
                    class="w-full p-3 border rounded-xl text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white disabled:bg-gray-50 disabled:text-gray-500 dark:disabled:bg-gray-800/50"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Email</label>
                  <input
                    v-model="form.email"
                    disabled
                    type="email"
                    class="w-full p-3 border rounded-xl text-sm bg-gray-50 text-gray-400 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-500 cursor-not-allowed"
                  />
                  <p class="text-xs text-gray-400 mt-1">L'email ne peut pas être modifié</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Téléphone</label>
                  <input
                    v-model="form.phone"
                    :disabled="!editing"
                    type="tel"
                    class="w-full p-3 border rounded-xl text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white disabled:bg-gray-50 disabled:text-gray-500 dark:disabled:bg-gray-800/50"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Ville</label>
                  <input
                    v-model="form.city"
                    :disabled="!editing"
                    type="text"
                    class="w-full p-3 border rounded-xl text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white disabled:bg-gray-50 disabled:text-gray-500 dark:disabled:bg-gray-800/50"
                  />
                </div>
              </div>

              <div v-if="editing" class="flex gap-3 pt-2">
                <button
                  type="submit"
                  :disabled="saving"
                  class="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-sm font-semibold rounded-xl transition"
                >
                  <svg v-if="saving" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 14 8.373 14 12h-4z"></path>
                  </svg>
                  {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
                </button>
                <button
                  type="button"
                  @click="cancelEdit"
                  class="px-6 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>

          <!-- Changer mot de passe -->
          <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-bold text-gray-800 dark:text-white">Sécurité</h2>
              <button
                @click="showPasswordForm = !showPasswordForm"
                class="text-sm text-orange-500 hover:text-orange-600 font-medium transition"
              >
                {{ showPasswordForm ? 'Annuler' : 'Changer le mot de passe' }}
              </button>
            </div>

            <div v-if="!showPasswordForm" class="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Mot de passe défini · Dernière modification inconnue
            </div>

            <form v-else @submit.prevent="changePassword" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Mot de passe actuel</label>
                <div class="relative">
                  <input
                    v-model="passwordForm.current"
                    :type="showCurrent ? 'text' : 'password'"
                    placeholder="••••••••"
                    class="w-full p-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white pr-10"
                  />
                  <button type="button" @click="showCurrent = !showCurrent" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path v-if="!showCurrent" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Nouveau mot de passe</label>
                  <input
                    v-model="passwordForm.newPassword"
                    type="password"
                    placeholder="••••••••"
                    class="w-full p-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Confirmer</label>
                  <input
                    v-model="passwordForm.confirm"
                    type="password"
                    placeholder="••••••••"
                    class="w-full p-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <button
                type="submit"
                :disabled="savingPassword"
                class="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-sm font-semibold rounded-xl transition"
              >
                <svg v-if="savingPassword" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 14 8.373 14 12h-4z"></path>
                </svg>
                {{ savingPassword ? 'Enregistrement...' : 'Mettre à jour le mot de passe' }}
              </button>
            </form>
          </div>

          <!-- Liens rapides -->
          <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-8">
            <h2 class="text-lg font-bold text-gray-800 dark:text-white mb-4">Accès rapide</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <router-link to="/badge"
                class="flex items-center gap-3 p-4 border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition group">
                <span class="text-2xl">🪪</span>
                <div>
                  <p class="text-sm font-semibold text-gray-800 dark:text-white group-hover:text-orange-500 transition">Mon badge</p>
                  <p class="text-xs text-gray-400">Voir et télécharger</p>
                </div>
              </router-link>
              <router-link to="/annuaire"
                class="flex items-center gap-3 p-4 border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition group">
                <span class="text-2xl">📋</span>
                <div>
                  <p class="text-sm font-semibold text-gray-800 dark:text-white group-hover:text-orange-500 transition">Annuaire</p>
                  <p class="text-xs text-gray-400">Voir tous les plombiers</p>
                </div>
              </router-link>
            </div>
          </div>

          <!-- Danger zone -->
          <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-8 border border-red-100 dark:border-red-900/30">
            <h2 class="text-lg font-bold text-red-500 mb-2">Voulez-vous vraiment vous déconnecter ?</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">La déconnexion vous redirigera vers la page d'accueil.</p>
            <button
              @click="handleLogout"
              class="flex items-center gap-2 px-5 py-2.5 border-2 border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-semibold rounded-xl transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Se déconnecter
            </button>
          </div>

        </div>
      </template>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Layout from '../components/Layout.vue'
import { getMe, api, logout } from '../lib/api'

const loading = ref(true)
const saving = ref(false)
const savingPassword = ref(false)
const editing = ref(false)
const showPasswordForm = ref(false)
const showCurrent = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const plumber = ref<any>(null)

const form = ref({ name: '', email: '', phone: '', city: '' })
const passwordForm = ref({ current: '', newPassword: '', confirm: '' })

const initials = computed(() => {
  if (!plumber.value?.name) return '?'
  return plumber.value.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
})

onMounted(async () => {
  try {
    const res = await getMe()
    plumber.value = res.data
    form.value = {
      name: res.data.name,
      email: res.data.email,
      phone: res.data.phone || '',
      city: res.data.city,
    }
  } catch {
    errorMessage.value = 'Impossible de charger votre profil.'
  } finally {
    loading.value = false
  }
})

const showSuccess = (msg: string) => {
  successMessage.value = msg
  errorMessage.value = ''
  setTimeout(() => successMessage.value = '', 4000)
}

const showError = (msg: string) => {
  errorMessage.value = msg
  successMessage.value = ''
}

const saveProfile = async () => {
  saving.value = true
  try {
    const res = await api.patch(`/plumbers/${plumber.value.id}`, {
      name: form.value.name,
      phone: form.value.phone,
      city: form.value.city,
    })
    plumber.value = { ...plumber.value, ...res.data }
    editing.value = false
    showSuccess('Profil mis à jour avec succès !')
  } catch (err: any) {
    showError(err.response?.data?.message || 'Erreur lors de la mise à jour.')
  } finally {
    saving.value = false
  }
}

const cancelEdit = () => {
  editing.value = false
  form.value = {
    name: plumber.value.name,
    email: plumber.value.email,
    phone: plumber.value.phone || '',
    city: plumber.value.city,
  }
}

const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirm) {
    return showError('Les mots de passe ne correspondent pas.')
  }
  if (passwordForm.value.newPassword.length < 6) {
    return showError('Le mot de passe doit contenir au moins 6 caractères.')
  }
  savingPassword.value = true
  try {
    await api.patch(`/plumbers/${plumber.value.id}/password`, {
      currentPassword: passwordForm.value.current,
      newPassword: passwordForm.value.newPassword,
    })
    showPasswordForm.value = false
    passwordForm.value = { current: '', newPassword: '', confirm: '' }
    showSuccess('Mot de passe mis à jour avec succès !')
  } catch (err: any) {
    showError(err.response?.data?.message || 'Mot de passe actuel incorrect.')
  } finally {
    savingPassword.value = false
  }
}

const handleLogout = () => logout()
</script>