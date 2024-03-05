<template>
  <Combobox as="div" v-model="selectedItem" class="flex flex-col items-end">
    <ComboboxLabel class="block text-xs font-light leading-6 text-gray-900">{{ props.label }}</ComboboxLabel>
    <div class="relative mt-2 w-full">
      <ComboboxInput class="w-full rounded-md border-0 bg-white py-1 pl-3 pr-10 text-gray-900 capitalize shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-slate-600 text-sm leading-6" @change="query = $event.target.value" :display-value="(item) => item?.name" />
      <ComboboxButton class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
        <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
      </ComboboxButton>

      <ComboboxOptions v-if="filteredItems.length > 0" class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-xs shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ">
        <ComboboxOption v-for="item in filteredItems" :key="item.id" :value="item" as="template" v-slot="{ active, selected }">
          <li :class="['relative cursor-default select-none py-1 pl-3 pr-9 capitalize text-sm font-light', active ? 'bg-slate-600 text-white' : 'text-gray-900']">
            <span :class="['block truncate', selected && 'text-xs font-light']">
              {{ item.name }}
            </span>

            <span v-if="selected" :class="['absolute inset-y-0 right-0 flex items-center pr-4', active ? 'text-white' : 'text-slate-600']">
              <CheckIcon class="h-5 w-5" aria-hidden="true" />
            </span>
          </li>
        </ComboboxOption>
      </ComboboxOptions>
    </div>
  </Combobox>
</template>

<script setup lang="ts">
import {computed, ref, watch} from 'vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxLabel,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/vue'

const emits = defineEmits<{
  selected: [value: PropsItem]
}>()

interface PropsItem {
  id: number | string
  name: string
}
interface Props {
  items: PropsItem[],
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [{ id: 1, name: 'Leslie Alexander' }],
  label: 'Default'
})


const query = ref<string>('')
const selectedItem = ref<PropsItem>(props.items[0])

watch(() => selectedItem.value, (newValue: PropsItem) => {
  emits('selected', newValue)
}, {deep: true})

const filteredItems = computed<PropsItem[]>(() =>
  query.value === ''
    ? props.items
    : props.items.filter((item) => {
        return item.name.toLowerCase().includes(query.value.toLowerCase())
      })
)
</script>