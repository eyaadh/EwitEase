<template>
  <div>
    <div v-if="route.meta.authenticatedLayout">
      <AuthenticatedLayout class="animate-in slide-in-from-right duration-700"/>
    </div>
    <div v-if="route.meta.loginLayout">
      <PublicLayout />
    </div>
  </div>
</template>

<script setup lang="ts">
import PublicLayout from "@/layouts/PublicLayout.vue";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout.vue";
import {useRoute} from "vue-router";

const route = useRoute()
</script>