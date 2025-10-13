<script setup lang="ts">
import Header from '~/components/Header.vue'
</script>

<template>
  <div>
    <Header />
    <main class="p-6">
      <slot />
    </main>
  </div>
</template>

<style scoped>

</style>