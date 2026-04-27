<script setup lang="ts">
import { Building2, Mail, Phone, MapPin } from 'lucide-vue-next'
</script>

<template>
  <footer class="bg-slate-950 text-slate-100">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-8 md:grid-cols-4">
        <div>
          <div class="mb-4 flex items-center gap-2">
            <Building2 class="h-8 w-8 text-sky-400" />
            <span class="text-xl font-bold">ImmoGestion</span>
          </div>
          <p class="text-sm text-slate-400">
            Votre partenaire de confiance pour la gestion de locations immobilieres.
          </p>
        </div>

        <div>
          <h3 class="mb-4 font-semibold">Navigation</h3>
          <ul class="space-y-2 text-sm">
            <li><RouterLink to="/" class="text-slate-400 transition-colors hover:text-white">Accueil</RouterLink></li>
            <li><RouterLink to="/biens" class="text-slate-400 transition-colors hover:text-white">Nos Biens</RouterLink></li>
          </ul>
        </div>

        <div>
          <h3 class="mb-4 font-semibold">Services</h3>
          <ul class="space-y-2 text-sm">
            <li class="text-slate-400">Gestion locative</li>
            <li class="text-slate-400">Location courte duree</li>
            <li class="text-slate-400">Location longue duree</li>
            <li class="text-slate-400">Conseil immobilier</li>
          </ul>
        </div>

        <div>
          <h3 class="mb-4 font-semibold">Contact</h3>
          <ul class="space-y-3 text-sm">
            <li class="flex items-center gap-2 text-slate-400"><MapPin class="h-4 w-4" /><span>Cocody, Abidjan</span></li>
            <li class="flex items-center gap-2 text-slate-400"><Phone class="h-4 w-4" /><span>+225 27 22 XX XX XX</span></li>
            <li class="flex items-center gap-2 text-slate-400"><Mail class="h-4 w-4" /><span>contact@immogestion.ci</span></li>
          </ul>
        </div>
      </div>

      <div class="mt-8 border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
        <p>&copy; {{ new Date().getFullYear() }} ImmoGestion. Tous droits reserves.</p>
      </div>
    </div>
  </footer>
</template>
