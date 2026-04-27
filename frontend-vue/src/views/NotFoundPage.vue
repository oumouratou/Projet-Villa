<template>
  <section class="space-y-4 rounded-xl border border-amber-300 bg-amber-50 p-6">
    <h1 class="text-3xl font-semibold tracking-tight text-amber-900">Page introuvable</h1>
    <p class="text-amber-800">
      Cette route n existe pas encore dans la version Vue. Reviens a l accueil pour continuer.
    </p>
    <RouterLink
      to="/"
      class="inline-flex rounded-md bg-amber-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-800"
    >
      Retour accueil
    </RouterLink>
  </section>
</template>
