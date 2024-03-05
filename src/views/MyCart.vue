<template>
  <div class="p-4 grid grid-cols-5 gap-3">
    <c-dialog ref="notificationDialog" :title="notification.title">
      <template #body>
        <div class="flex flex-col items-center text-center">
          <MaterialSymbolsLightCheckCircle class="text-4xl" v-if="notification.type === LogLevel.SUCCESS "/>
          <MaterialSymbolsLightContactSupport class="text-4xl" v-if="notification.type === LogLevel.WARN "/>
          <MaterialSymbolsLightError class="text-4xl" v-else />
          <p class="text-xs font-extralight text-center">{{notification.body}}</p>
        </div>
      </template>
    </c-dialog>

    <div v-if="isPlaceOrderAllowed" class="col-span-full md:col-span-3 flex flex-col gap-2">
      <div v-for="(p, idx) in posStore.myCart as ProductForCart[]"
           class="relative isolate p-2.5 border-y rounded-md flex gap-2">
        <div class="absolute top-1 right-1.5">
          <button class="group border rounded-full" @click="removeFromCart(idx)">
            <XCircleIcon class="h-4 w-4 group-hover:text-gray-500"/>
          </button>
        </div>
        <div class="flex flex-shrink-0 border h-32 w-32 overflow-hidden rounded-md">
          <img
            :alt="p.product_name"
            :src="p.product_image" class="object-cover object-center"/>
        </div>
        <div class="flex flex-col items-start">
          <div class="flex-1">
            <p class="font-semibold text-sm leading-6">{{ p.product_name }}</p>
            <p class="font-light text-xs">QTY: {{ p.unit_quantity }}</p>
          </div>
          <div class="">
            <p class="font-extralight text-xs">Unit Price: MRF. {{ p.unit_sales_price.toFixed(2) }}</p>
            <p class="font-extralight text-xs">Total Sales Price: MRF. {{ p.total_sales_price.toFixed(2) }}</p>
          </div>
        </div>
      </div>
    </div>

    <div :class="[isPlaceOrderAllowed ? 'col-span-full md:col-span-2': 'col-span-full']">
      <div class="bg-gray-200 flex flex-col border rounded-md py-6 px-2">
        <h2 class="text-md font-semibold leading-6">Order summary</h2>
        <p class="mt-2 text-xs font-light leading-4 tracking-tight border-b border-gray-300">The provided summary
          includes both plastic bag and GST taxes for items
          that are subject to these specific taxation.</p>
        <ul class="mt-4 leading-6 tracking-tight text-xs flex flex-col gap-2 text-gray-500">
          <li class="text-xs italic border-b border-gray-300">Subtotal: MRF. {{ subTotal.toFixed(2) }}</li>
          <li class="text-xs italic border-b border-gray-300">Tax: MRF. {{ tax.toFixed(2) }}</li>
          <li class="text-sm text-gray-800">Order Total: <span
            class="underline underline-offset-4">MRF. {{ orderTotal.toFixed(2) }}</span></li>
        </ul>

        <n-button :disabled="!isPlaceOrderAllowed"
                  :label="isPlaceOrderAllowed ? 'Place order': 'Cart is empty'"
                  class="mt-5"
                  @click="postToEwity"/>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import {usePosStore} from "@/stores/posStore";
import type {ProductForCart} from "@/types/ewityProducts";
import {XCircleIcon} from "@heroicons/vue/20/solid";
import {computed, onMounted, reactive, ref} from "vue";
import NButton from "@/components/nButton.vue";
import CDialog from "@/components/cDialog.vue";
import {useUserStore} from "@/stores/userStore";
import MaterialSymbolsLightContactSupport from "@/components/icons/question.vue";
import MaterialSymbolsLightError from "@/components/icons/error.vue";
import {useRouter} from "vue-router";
import MaterialSymbolsLightCheckCircle from "@/components/icons/success.vue";

const posStore = usePosStore();
const userStore = useUserStore()
const router = useRouter()
const notificationDialog = ref<typeof CDialog | null>(null)

enum LogLevel {
  ERROR,
  WARN,
  INFO,
  DEBUG,
  SUCCESS
}
interface Notification {
  title: string,
  body: string,
  type: LogLevel
}

const notification: Notification = reactive({
  title: '',
  body: '',
  type: LogLevel.WARN
})
const removeFromCart = async (index: number): Promise<void> => {
  posStore.myCart.splice(index, 1)
}

const subTotal = computed<number>(() => {
  let total = 0
  if (posStore.myCart.length) {
    posStore.myCart.forEach(i => {
      total = total + i.total_base_sales_price
    })
  }
  return total
})

const tax = computed<number>(() => {
  let taxTotal = 0
  posStore.myCart.forEach(i => {
    taxTotal = taxTotal + (i.total_base_tax_amount - i.total_base_sales_price)
  })
  return taxTotal
})

const orderTotal = computed<number>(() => {
  let total = 0
  posStore.myCart.forEach(i => {
    total = total + i.total_base_tax_amount
  })
  return total
})

const isPlaceOrderAllowed = computed<boolean>(() => {
  return posStore.myCart.length > 0
})

const postToEwity = async() => {
  if (!userStore.customer) {
    await router.push({name: 'home'})
    return
  }
}

onMounted( async () => {
  if (!userStore.customer) {
    notification.title = 'You cannot place an order!'
    notification.type = LogLevel.ERROR
    notification.body = 'To finalize the onboarding process, please return to the store\'s homepage. Without completing this step, we won\'t be able to process your order.'
    notificationDialog.value?.openModal()
    setTimeout(() => {
      notificationDialog.value?.closeModal()
    }, 6000)
  }
})
</script>
