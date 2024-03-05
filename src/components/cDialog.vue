<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal()" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-2xl transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <div class="flex justify-between border-b items-center">
                <DialogTitle
                  as="h3"
                  class="text-md font-extralight leading-6 text-gray-900"
                >
                  {{props.title}}
                </DialogTitle>

                <button class="rounded-full" @click="closeModal()">
                  <XCircleIcon class="h-4 w-4" />
                </button>
              </div>
              <div class="mt-2">
                <slot name="body" />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import {XCircleIcon} from "@heroicons/vue/20/solid";

const isOpen = ref<boolean>(false)
interface props {
  title?: string
}
const props = withDefaults(defineProps<props>(), {
  title: 'Default Title'
})

function closeModal(): void {
  isOpen.value = false
  emit('closed', null)
}
function openModal(): void {
  isOpen.value = true
}

defineExpose({
  closeModal, openModal
})

const emit = defineEmits<{
  closed: [null: null]
}>()
</script>
