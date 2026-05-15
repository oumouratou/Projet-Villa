<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowRight,
  Building2,
  Clock,
  MapPin,
  Search,
  Shield,
  Star,
  Users,
} from 'lucide-vue-next'
import PublicHeader from '@/components/PublicHeader.vue'
import PublicFooter from '@/components/PublicFooter.vue'
import { getProperties } from '@/lib/api'

const router = useRouter()
const properties = ref<any[]>([])
const searchCity = ref('')
const budget = ref('')
const activeHeroIndex = ref(0)
const intervalId = ref<number | null>(null)

const fallbackHeroImages = [
  '/placeholder.svg',
  '/placeholder.svg',
  '/placeholder.svg',
  '/placeholder.svg',
  '/placeholder.svg',
]

const heroImages = computed(() => {
  const images = properties.value.flatMap(property => property.images)
  return images.length > 0 ? [...new Set(images)] : fallbackHeroImages
})

const currentHeroImage = computed(() => heroImages.value[activeHeroIndex.value % heroImages.value.length] || fallbackHeroImages[0])

const spotlightProperties = computed(() => properties.value.filter(property => property.status === 'disponible').slice(0, 4))

const trustCards = [
  {
    title: 'Biens de qualité',
    description: 'Des villas et appartements sélectionnés avec soin pour un niveau d’exigence élevé.',
    icon: Building2,
  },
  {
    title: 'Sécurité garantie',
    description: 'Processus de réservation, dossiers et transactions encadrés avec transparence.',
    icon: Shield,
  },
  {
    title: 'Réactivité',
    description: 'Une réponse rapide à chaque demande pour avancer sans perte de temps.',
    icon: Clock,
  },
  {
    title: 'Accompagnement',
    description: 'Un suivi humain, avant, pendant et après la réservation.',
    icon: Users,
  },
]

const metrics = [
  { label: 'Villas sélectionnées', value: '120+' },
  { label: 'Réservations traitées', value: '2 400+' },
  { label: 'Temps moyen de réponse', value: '< 10 min' },
]

const featuredBadges = [
  'Vue mer',
  'Piscine privée',
  'Séjour premium',
  'Réservation rapide',
]

const formattedBudget = computed(() => {
  if (!budget.value) {
    return ''
  }

  return budget.value
})

onMounted(async () => {
  try {
    const backendProperties = await getProperties()
    if (backendProperties.length > 0) {
      properties.value = backendProperties
    }
  } catch {
    // Fallback mock local deja initialise
  }

  intervalId.value = window.setInterval(() => {
    activeHeroIndex.value = (activeHeroIndex.value + 1) % heroImages.value.length
  }, 4500)
})

onBeforeUnmount(() => {
  if (intervalId.value) {
    window.clearInterval(intervalId.value)
  }
})

const handleSearch = () => {
  const query: Record<string, string> = {}

  if (searchCity.value.trim()) {
    query.city = searchCity.value.trim()
  }

  if (formattedBudget.value) {
    query.budget = formattedBudget.value
  }

  router.push({ path: '/biens', query })
}

const setHeroSlide = (index: number) => {
  activeHeroIndex.value = index
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <PublicHeader />

    <main class="flex-1">
      <section class="section-shell relative overflow-hidden bg-slate-950 text-white">
        <div class="absolute inset-0">
          <img :src="currentHeroImage" alt="Villa d'accueil" class="h-full w-full object-cover opacity-35 transition-opacity duration-700" />
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.24),transparent_30%),linear-gradient(120deg,rgba(3,7,18,0.92),rgba(15,23,42,0.86),rgba(30,41,59,0.92))]"></div>
        </div>
        <div class="hero-glow"></div>

        <div class="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
          <div class="max-w-3xl">
            <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/85 backdrop-blur">
              <Star class="h-4 w-4 text-amber-300" />
              Villas premium, appartements de standing et accompagnement complet
            </div>

            <h1 class="text-4xl font-black leading-tight text-balance sm:text-5xl lg:text-6xl">
              Trouvez une villa qui donne envie de rester.
            </h1>
            <p class="mt-6 max-w-2xl text-lg leading-8 text-white/78 sm:text-xl">
              ImmoGestion vous présente des biens sélectionnés avec une mise en avant visuelle soignée, une recherche rapide et une expérience plus fluide pour réserver plus sereinement.
            </p>

            <div class="mt-8 flex flex-wrap gap-4">
              <RouterLink
                to="/biens"
                class="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-slate-950 shadow-xl shadow-black/15 transition-transform hover:-translate-y-0.5"
              >
                Voir les biens
                <ArrowRight class="h-4 w-4" />
              </RouterLink>
              <RouterLink
                to="/inscription"
                class="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
              >
                Créer un compte
              </RouterLink>
            </div>

            <div class="mt-10 grid gap-4 sm:grid-cols-3">
              <div v-for="metric in metrics" :key="metric.label" class="rounded-3xl border border-white/10 bg-white/8 px-5 py-4 backdrop-blur">
                <p class="text-sm text-white/65">{{ metric.label }}</p>
                <p class="mt-2 text-xl font-bold text-white">{{ metric.value }}</p>
              </div>
            </div>
          </div>

          <div class="relative">
            <div class="overflow-hidden rounded-[2rem] border border-white/10 bg-white/8 p-3 shadow-[0_32px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div class="grid gap-3 sm:grid-cols-[1.6fr_0.8fr]">
                <div class="relative overflow-hidden rounded-[1.5rem]">
                  <img :src="currentHeroImage" alt="Villa en vedette" class="hero-image-float h-[23rem] w-full object-cover" />
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                  <div class="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                    <div>
                      <p class="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">Villa du moment</p>
                      <p class="mt-1 text-lg font-bold text-white">Vue immersive en rotation</p>
                    </div>
                    <span class="rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur">{{ activeHeroIndex + 1 }}/{{ heroImages.length }}</span>
                  </div>
                </div>

                <div class="grid gap-3">
                  <div v-for="(image, index) in heroImages.slice(0, 4)" :key="image" class="relative overflow-hidden rounded-[1.25rem] border border-white/10 bg-slate-900/30" @mouseenter="setHeroSlide(index)">
                    <img :src="image" alt="Aperçu villa" class="h-[5.4rem] w-full object-cover opacity-90 transition-transform duration-500 hover:scale-105" />
                  </div>
                </div>
              </div>

              <div class="mt-3 flex flex-wrap gap-2">
                <button
                  v-for="(badge, index) in featuredBadges"
                  :key="badge"
                  type="button"
                  class="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-xs font-semibold text-white/80 transition-colors hover:bg-white/15"
                  @click="setHeroSlide(index % heroImages.length)"
                >
                  {{ badge }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="relative mx-auto -mt-6 max-w-5xl px-4 sm:px-6 lg:px-8 lg:-mt-10">
          <div class="glass-card rounded-[1.5rem] p-4 shadow-2xl shadow-slate-950/20">
            <form class="grid gap-4 lg:grid-cols-[1.1fr_0.8fr_auto]" @submit.prevent="handleSearch">
              <div class="relative">
                <label for="city" class="sr-only">Ville</label>
                <MapPin class="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="city"
                  v-model="searchCity"
                  type="text"
                  placeholder="Ville, quartier ou code postal"
                  class="w-full rounded-2xl border border-slate-200 bg-white px-12 py-4 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
                />
              </div>
              <div class="relative">
                <label for="budget" class="sr-only">Budget max</label>
                <select
                  id="budget"
                  v-model="budget"
                  class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
                >
                  <option value="">Budget max</option>
                  <option value="500">500 EUR/mois</option>
                  <option value="1000">1 000 EUR/mois</option>
                  <option value="1500">1 500 EUR/mois</option>
                  <option value="2000">2 000 EUR/mois</option>
                  <option value="3000">3 000 EUR/mois</option>
                  <option value="5000">5 000+ EUR/mois</option>
                </select>
              </div>
              <button
                type="submit"
                class="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-7 py-4 font-bold text-white shadow-lg shadow-blue-600/25 transition-transform hover:-translate-y-0.5"
              >
                <Search class="h-5 w-5" />
                Rechercher
              </button>
            </form>
          </div>
        </div>
      </section>

      <section class="py-16 sm:py-20">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.22em] text-sky-600">Pourquoi nous choisir</p>
              <h2 class="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Une plateforme pensée pour rassurer et convertir.
              </h2>
            </div>
            <p class="max-w-2xl text-base leading-7 text-slate-600">
              Le style, les images et les actions clés sont organisés pour donner une impression premium dès la première interaction.
            </p>
          </div>

          <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <article
              v-for="card in trustCards"
              :key="card.title"
              class="glass-card rounded-[1.5rem] p-6 transition-transform duration-300 hover:-translate-y-1"
            >
              <div class="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/10">
                <component :is="card.icon" class="h-6 w-6" />
              </div>
              <h3 class="mt-5 text-xl font-bold text-slate-950">{{ card.title }}</h3>
              <p class="mt-3 text-sm leading-6 text-slate-600">{{ card.description }}</p>
            </article>
          </div>
        </div>
      </section>

      <section class="pb-20">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div class="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-[0_32px_80px_rgba(15,23,42,0.22)]">
              <img :src="heroImages[(activeHeroIndex + 1) % heroImages.length] || heroImages[0]" alt="Villa de luxe" class="h-full min-h-[26rem] w-full object-cover opacity-85" />
            </div>
            <div class="grid gap-6">
              <article class="glass-card rounded-[2rem] p-8">
                <p class="text-sm font-semibold uppercase tracking-[0.22em] text-sky-600">Découverte</p>
                <h2 class="mt-3 text-3xl font-black tracking-tight text-slate-950">Des images qui racontent vraiment la villa</h2>
                <p class="mt-4 text-slate-600 leading-7">
                  Le carrousel principal tourne automatiquement pour donner une vue vivante des biens, tandis que les aperçus secondaires offrent un rendu plus riche et plus professionnel.
                </p>
                <div class="mt-6 flex flex-wrap gap-3">
                  <RouterLink
                    to="/biens"
                    class="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                  >
                    Explorer les villas
                    <ArrowRight class="h-4 w-4" />
                  </RouterLink>
                </div>
              </article>
              <div class="grid grid-cols-3 gap-4">
                <div v-for="image in heroImages.slice(0, 3)" :key="image" class="overflow-hidden rounded-[1.5rem] shadow-lg shadow-slate-950/10">
                  <img :src="image" alt="Aperçu villa" class="h-40 w-full object-cover transition-transform duration-500 hover:scale-105" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="py-16 bg-slate-950 text-white">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">Confiance</p>
              <h2 class="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Une expérience pensée pour donner envie de réserver.</h2>
              <p class="mt-4 max-w-xl text-white/75 leading-7">
                Le parcours utilisateur reste simple, mais l’identité visuelle est plus forte, plus chaude et plus moderne, afin de mieux valoriser les villas et la marque.
              </p>
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              <div v-for="property in spotlightProperties" :key="property.id" class="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/8 backdrop-blur">
                <img :src="property.images?.[0] || '/placeholder.svg'" :alt="property.title" class="h-44 w-full object-cover" />
                <div class="p-4">
                  <p class="text-sm font-semibold text-white">{{ property.title }}</p>
                  <p class="mt-1 text-xs text-white/65">{{ property.city }} · {{ property.images.length }} visuels disponibles</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <PublicFooter />
  </div>
</template>
