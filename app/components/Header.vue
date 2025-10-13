<script lang="ts" setup>
import Countdown from "./Countdown.vue";
import type { NavigationMenuItem } from '@nuxt/ui'
const route = useRoute()
const items = computed<NavigationMenuItem[]>(() => [{
  label: '小考',
  to: '/quiz',
  icon: 'i-lucide-book-open',
  active: route.path.startsWith('/docs/getting-started')
}, {
  label: '單字表',
  to: '/wordlist',
  icon: 'i-lucide-box',
  active: route.path.startsWith('/docs/components')
}])
</script>

<template>
  <UHeader>
    <template #title>
      <Countdown/>
    </template>

      <UNavigationMenu :items="items" />

    <template #right>
      <UColorModeButton />
    </template>

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
    </template>
  </UHeader>

</template>