<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">

    <!-- Sidebar -->
    <aside class="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 z-40 flex flex-col">
      <div class="p-6 border-b border-gray-100 dark:border-gray-800">
        <div class="flex items-center gap-2">
          <span class="text-2xl">🇧🇯</span>
          <div>
            <p class="font-extrabold text-gray-800 dark:text-white text-sm">Plombiers Pro</p>
            <p class="text-xs text-orange-500 font-medium">Administration</p>
          </div>
        </div>
      </div>

      <nav class="flex-1 p-4 space-y-1">
        <button
          v-for="item in navItems" :key="item.id"
          @click="activeTab = item.id"
          class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition"
          :class="activeTab === item.id
            ? 'bg-orange-500 text-white'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'"
        >
          <span>{{ item.icon }}</span>
          {{ item.label }}
        </button>
      </nav>

      <div class="p-4 border-t border-gray-100 dark:border-gray-800">
        <button @click="handleLogout"
          class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Déconnexion
        </button>
      </div>
    </aside>

    <!-- Main -->
    <main class="ml-64 p-8">

      <!-- ===== DASHBOARD ===== -->
      <div v-if="activeTab === 'dashboard'">
        <h1 class="text-2xl font-extrabold text-gray-800 dark:text-white mb-2">Tableau de bord</h1>
        <p class="text-gray-500 dark:text-gray-400 mb-8">Vue d'ensemble de la plateforme</p>

        <!-- Stats cards -->
        <div v-if="stats" class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div v-for="card in statCards" :key="card.label"
            class="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
            <div class="text-3xl mb-2">{{ card.icon }}</div>
            <div class="text-2xl font-extrabold text-gray-800 dark:text-white">{{ card.value }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ card.label }}</div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Top villes -->
          <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 class="font-bold text-gray-800 dark:text-white mb-4">Top villes</h3>
            <div class="space-y-3">
              <div v-for="city in stats?.topCities" :key="city.city" class="flex items-center gap-3">
                <span class="text-sm text-gray-600 dark:text-gray-300 w-24 truncate">{{ city.city }}</span>
                <div class="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div class="h-full bg-orange-400 rounded-full"
                    :style="{ width: (city.count / (stats?.totalPlumbers || 1)) * 100 + '%' }"></div>
                </div>
                <span class="text-sm font-semibold text-gray-700 dark:text-white w-6 text-right">{{ city.count }}</span>
              </div>
            </div>
          </div>

          <!-- Derniers inscrits -->
          <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 class="font-bold text-gray-800 dark:text-white mb-4">Derniers inscrits</h3>
            <div class="space-y-3">
              <div v-for="p in stats?.recentPlumbers" :key="p.id"
                class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-xs font-bold text-orange-500">
                    {{ p.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() }}
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-800 dark:text-white">{{ p.name }}</p>
                    <p class="text-xs text-gray-400">{{ p.city }}</p>
                  </div>
                </div>
                <span class="text-xs px-2 py-1 rounded-full"
                  :class="p.verified ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'">
                  {{ p.verified ? 'Certifié' : 'En attente' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== PLOMBIERS ===== -->
      <div v-if="activeTab === 'plumbers'">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-2xl font-extrabold text-gray-800 dark:text-white mb-1">Gestion des plombiers</h1>
            <p class="text-gray-500 dark:text-gray-400">{{ plumbers.length }} plombiers inscrits</p>
          </div>
          <input v-model="searchPlumber" type="text" placeholder="Rechercher..."
            class="px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
        </div>

        <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-100 dark:border-gray-800">
                <th class="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plombier</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ville</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Paiements</th>
                <th class="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 dark:divide-gray-800">
              <tr v-for="p in filteredPlumbers" :key="p.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-xs font-bold text-orange-500">
                      {{ p.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() }}
                    </div>
                    <div>
                      <p class="text-sm font-semibold text-gray-800 dark:text-white">{{ p.name }}</p>
                      <p class="text-xs text-gray-400">{{ p.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{{ p.city }}</td>
                <td class="px-6 py-4">
                  <span class="text-xs px-2.5 py-1 rounded-full font-medium"
                    :class="p.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'">
                    {{ p.verified ? '✔ Certifié' : '⏳ En attente' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  {{ p._count.payments }} paiement{{ p._count.payments > 1 ? 's' : '' }}
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      @click="toggleVerify(p)"
                      :disabled="actionLoading === p.id"
                      class="text-xs px-3 py-1.5 rounded-lg font-medium transition"
                      :class="p.verified
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'"
                    >
                      {{ p.verified ? 'Révoquer' : 'Certifier' }}
                    </button>
                    <button
                      @click="openPaymentModal(p)"
                      class="text-xs px-3 py-1.5 bg-orange-100 text-orange-600 hover:bg-orange-200 rounded-lg font-medium transition"
                    >
                      + Paiement
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ===== PAIEMENTS ===== -->
      <div v-if="activeTab === 'payments'">
        <h1 class="text-2xl font-extrabold text-gray-800 dark:text-white mb-2">Paiements</h1>
        <p class="text-gray-500 dark:text-gray-400 mb-8">Historique des cotisations</p>

        <!-- Résumé -->
        <div class="grid grid-cols-2 gap-4 mb-8">
          <div class="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
            <p class="text-sm text-gray-500 mb-1">Total collecté</p>
            <p class="text-3xl font-extrabold text-gray-800 dark:text-white">{{ stats?.totalRevenue?.toLocaleString('fr-FR') }} <span class="text-lg text-gray-400">FCFA</span></p>
          </div>
          <div class="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
            <p class="text-sm text-gray-500 mb-1">Nombre de paiements</p>
            <p class="text-3xl font-extrabold text-gray-800 dark:text-white">{{ stats?.totalPayments }}</p>
          </div>
        </div>

        <!-- Tableau paiements -->
        <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-100 dark:border-gray-800">
                <th class="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plombier</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ville</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Montant</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 dark:divide-gray-800">
              <tr v-for="payment in payments" :key="payment.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                <td class="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white">{{ payment.plumber.name }}</td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ payment.plumber.city }}</td>
                <td class="px-6 py-4">
                  <span class="text-sm font-bold text-orange-500">{{ payment.amount.toLocaleString('fr-FR') }} FCFA</span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(payment.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </main>

    <!-- Modal paiement -->
    <div v-if="paymentModal.open" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <h3 class="font-bold text-gray-800 dark:text-white mb-1">Enregistrer un paiement</h3>
        <p class="text-sm text-gray-500 mb-4">{{ paymentModal.plumber?.name }}</p>

        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Montant (FCFA)</label>
        <input v-model="paymentModal.amount" type="number" placeholder="5000"
          class="w-full p-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white mb-4" />

        <div class="flex gap-3">
          <button @click="submitPayment" :disabled="paymentModal.loading"
            class="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-sm font-semibold rounded-xl transition">
            {{ paymentModal.loading ? 'Enregistrement...' : 'Confirmer' }}
          </button>
          <button @click="paymentModal.open = false"
            class="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            Annuler
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { api, logout } from '../lib/api'

const activeTab = ref<'dashboard' | 'plumbers' | 'payments'>('dashboard')
const stats = ref<any>(null)
const plumbers = ref<any[]>([])
const payments = ref<any[]>([])
const searchPlumber = ref('')
const actionLoading = ref<number | null>(null)

const paymentModal = ref({
  open: false,
  plumber: null as any,
  amount: '',
  loading: false,
})

const navItems = [
  { id: 'dashboard', icon: '📊', label: 'Tableau de bord' },
  { id: 'plumbers', icon: '👷', label: 'Plombiers' },
  { id: 'payments', icon: '💰', label: 'Paiements' },
]

const statCards = computed(() => {
  if (!stats.value) return []
  return [
    { icon: '👷', label: 'Plombiers inscrits', value: stats.value.totalPlumbers },
    { icon: '✅', label: 'Certifiés', value: stats.value.verifiedPlumbers },
    { icon: '⏳', label: 'En attente', value: stats.value.pendingPlumbers },
    { icon: '💰', label: 'Total collecté (FCFA)', value: stats.value.totalRevenue?.toLocaleString('fr-FR') },
  ]
})

const filteredPlumbers = computed(() => {
  if (!searchPlumber.value) return plumbers.value
  return plumbers.value.filter(p =>
    p.name.toLowerCase().includes(searchPlumber.value.toLowerCase()) ||
    p.city.toLowerCase().includes(searchPlumber.value.toLowerCase())
  )
})

onMounted(async () => {
  await Promise.all([loadStats(), loadPlumbers(), loadPayments()])
})

const loadStats = async () => {
  const res = await api.get('/admin/stats')
  stats.value = res.data
}

const loadPlumbers = async () => {
  const res = await api.get('/admin/plumbers')
  plumbers.value = res.data
}

const loadPayments = async () => {
  const res = await api.get('/payments')
  payments.value = res.data
}

const toggleVerify = async (plumber: any) => {
  actionLoading.value = plumber.id
  try {
    const action = plumber.verified ? 'unverify' : 'verify'
    await api.patch(`/admin/plumbers/${plumber.id}/${action}`)
    plumber.verified = !plumber.verified
    await loadStats()
  } finally {
    actionLoading.value = null
  }
}

const openPaymentModal = (plumber: any) => {
  paymentModal.value = { open: true, plumber, amount: '', loading: false }
}

const submitPayment = async () => {
  if (!paymentModal.value.amount) return
  paymentModal.value.loading = true
  try {
    await api.post('/payments', {
      plumberId: paymentModal.value.plumber.id,
      amount: Number(paymentModal.value.amount),
    })
    paymentModal.value.open = false
    await Promise.all([loadPayments(), loadStats(), loadPlumbers()])
  } finally {
    paymentModal.value.loading = false
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

const handleLogout = () => logout()
</script>