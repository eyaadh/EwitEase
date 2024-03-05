<template>
  <router-view v-slot="{Component}">
    <component :is="Component" class="animate-in zoom-in duration-700"/>
  </router-view>
</template>

<script setup lang="ts">

</script>