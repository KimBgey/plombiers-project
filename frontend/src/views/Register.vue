<template>
  <div class="flex min-h-screen">

    <!-- Section gauche : formulaire -->
    <div class="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
      <div class="w-full max-w-lg">

        <!-- Logo mobile -->
        <div class="flex md:hidden justify-center mb-6 text-4xl">🇧🇯</div>

        <h1 class="text-3xl font-bold mb-1 text-gray-800 dark:text-white">Inscription Plombier</h1>
        <p class="mb-6 text-gray-600 dark:text-gray-300">
          Créez votre compte et obtenez votre badge professionnel
        </p>

        <!-- Notification erreur -->
        <div
          v-if="errorMessage"
          class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ errorMessage }}
        </div>

        <!-- Notification succès -->
        <div
          v-if="successMessage"
          class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm dark:bg-green-900/20 dark:border-green-800 dark:text-green-400 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ successMessage }}
        </div>

        <Form @submit="handleSubmit" class="space-y-4" v-slot="{ errors }">

          <!-- Nom + Email -->
          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                Nom complet <span class="text-red-500">*</span>
              </label>
              <Field
                name="name"
                type="text"
                placeholder="Jean Dupont"
                class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                :class="{ 'border-red-500': errors.name }"
              />
              <ErrorMessage name="name" class="text-red-500 text-sm mt-1" />
            </div>
            <div class="flex-1">
              <label class="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                Email <span class="text-red-500">*</span>
              </label>
              <Field
                name="email"
                type="email"
                placeholder="exemple@mail.com"
                class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                :class="{ 'border-red-500': errors.email }"
              />
              <ErrorMessage name="email" class="text-red-500 text-sm mt-1" />
            </div>
          </div>

          <!-- Téléphone + Ville -->
          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                Téléphone <span class="text-red-500">*</span>
              </label>
              <Field
                name="phone"
                type="tel"
                placeholder="+229 90 00 00 00"
                class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                :class="{ 'border-red-500': errors.phone }"
              />
              <ErrorMessage name="phone" class="text-red-500 text-sm mt-1" />
            </div>
            <div class="flex-1">
              <label class="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                Ville <span class="text-red-500">*</span>
              </label>
              <Field
                name="city"
                type="text"
                placeholder="Cotonou"
                class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                :class="{ 'border-red-500': errors.city }"
              />
              <ErrorMessage name="city" class="text-red-500 text-sm mt-1" />
            </div>
          </div>

          <!-- Mot de passe + Confirmation -->
          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                Mot de passe <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <Field
                  name="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white pr-10"
                  :class="{ 'border-red-500': errors.password }"
                />
                <button type="button" @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
              <ErrorMessage name="password" class="text-red-500 text-sm mt-1" />
            </div>
            <div class="flex-1">
              <label class="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                Confirmer <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <Field
                  name="passwordConfirm"
                  :type="showConfirm ? 'text' : 'password'"
                  placeholder="••••••••"
                  class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white pr-10"
                  :class="{ 'border-red-500': errors.passwordConfirm }"
                />
                <button type="button" @click="showConfirm = !showConfirm"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <svg v-if="!showConfirm" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
              <ErrorMessage name="passwordConfirm" class="text-red-500 text-sm mt-1" />
            </div>
          </div>

          <!-- Bouton -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full p-3 mt-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg v-if="loading" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 14 8.373 14 12h-4z"></path>
            </svg>
            {{ loading ? 'Inscription...' : "S'inscrire" }}
          </button>
        </Form>

        <!-- Lien connexion mobile -->
        <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400 md:hidden">
          Déjà un compte ?
          <router-link to="/login" class="text-orange-500 font-semibold hover:underline">Se connecter</router-link>
        </p>
      </div>
    </div>

    <!-- Section droite : bloc orange -->
    <div class="hidden md:flex flex-col justify-center items-center flex-1 bg-orange-500 dark:bg-orange-600 text-white relative p-10 rounded-tl-[80px] rounded-bl-[80px]">
      <div class="text-5xl mb-6">🇧🇯</div>
      <h2 class="text-4xl font-bold mb-4 text-center">Déjà membre ?</h2>
      <p class="mb-6 text-lg text-white/90 text-center max-w-xs">
        Connectez-vous pour accéder à votre espace professionnel et votre badge.
      </p>
      <router-link
        to="/login"
        class="px-6 py-3 bg-white text-orange-500 font-semibold rounded-lg hover:bg-gray-100 transition"
      >
        Se connecter
      </router-link>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import { Form, Field, ErrorMessage, useForm } from 'vee-validate'
import { toFormValidator } from '@vee-validate/zod'
import { createPlumber } from '../lib/api'

const router = useRouter()
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)

const schema = z
  .object({
    name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    email: z.string().email('Email invalide'),
    phone: z.string().min(8, 'Téléphone invalide'),
    city: z.string().min(2, 'Ville invalide'),
    password: z.string().min(6, 'Mot de passe trop court'),
    passwordConfirm: z.string().min(6, 'Confirmation trop courte'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Les mots de passe ne correspondent pas',
  })

useForm({
  validationSchema: toFormValidator(schema),
})

const handleSubmit = async (values: any) => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await createPlumber(values)
    successMessage.value = 'Compte créé avec succès ! Redirection vers la connexion...'
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } catch (err: any) {
    const status = err.response?.status
    const msg = err.response?.data?.message
    if (status === 409) {
      errorMessage.value = 'Un compte existe déjà avec cet email.'
    } else {
      errorMessage.value = msg || 'Une erreur est survenue. Veuillez réessayer.'
    }
  } finally {
    loading.value = false
  }
}
</script>