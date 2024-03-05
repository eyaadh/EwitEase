<template>
  <button
          class="mt-2 block w-full p-2.5 rounded-md text-sm bg-gray-950 disabled:bg-gray-300 text-gray-50 hover:bg-gray-950/90 focus:outline-none focus:ring-1 focus:ring-gray-100">
    {{ props.label }}
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  label: string
}>(), {
  label: 'Default'
})
</script>