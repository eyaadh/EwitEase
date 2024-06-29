<template>
  <div class="p-4">
    <div class="p-2 w-full gap-2 ">
      <div class="mx-auto max-w-md">
        <div class="flex flex-col bg-gradient-to-tl from-gray-300 to-gray-100 shadow rounded-xl">
          <div class="p-4 flex justify-between">
            <div>
              <p class="text-sm leading-6 tracking-wider font-extralight">{{ userStore.customer?.name }}</p>
              <p class="text-xs leading-6 tracking-tight font-extralight">{{ userStore.customer?.mobile }}</p>
              <p class="text-xs leading-6 tracking-tight font-extralight">{{ userStore.customer?.address }}</p>
              <div class="flex items-center gap-2 mt-4 font-extralight">
                <p class="text-xs leading-6 tracking-tight font-semibold">Credit Limit:</p>
                <p class="text-xs leading-6 tracking-tight">MRF. {{ userStore.customer?.credit_limit }}</p>
              </div>
              <div class="flex items-center gap-2 font-extralight">
                <p class="text-xs leading-6 tracking-tight font-semibold">Total Outstanding:</p>
                <p class="text-xs leading-6 tracking-tight">MRF. {{ userStore.customer?.total_outstanding }}</p>
              </div>
              <div class="flex items-center gap-2 font-extralight">
                <p class="text-xs leading-6 tracking-tight font-semibold">Total Spent:</p>
                <p class="text-xs leading-6 tracking-tight">MRF. {{ userStore.customer?.total_spent }}</p>
              </div>
              <div class="flex items-center gap-2 font-extralight">
                <p class="text-xs leading-6 tracking-tight font-semibold">Loyalty Program:</p>
                <p class="text-xs leading-6 tracking-tight">{{ userStore.customer?.loyalty_program ? userStore.customer?.loyalty_program?.name : 'None' }}</p>
              </div>
              <div class="flex items-center gap-2 font-extralight">
                <p class="text-xs leading-6 tracking-tight font-semibold">Loyalty Points:</p>
                <p class="text-xs leading-6 tracking-tight">{{ userStore.customer?.loyalty_points ? userStore.customer?.loyalty_points : 0 }}</p>
              </div>
            </div>
            <div class="flex justify-center items-center rounded-full p-2 w-12 h-12 bg-gray-950 text-white text-sm">
              <span>{{ initials }}</span>
            </div>
          </div>
          <div class="p-2 mx-auto text-[10px] font-light italic">
            <p>Member since: {{ joinedDate }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="p-2 gap-2 overflow-hidden mt-4 sm:mt-6">
      <div class="flex w-full justify-center sm:justify-start gap-2 pb-2 border-b">
        <MaterialSymbolsLightReceiptLong class="text-2xl"/>
        <h2 class="font-semibold ">My Sales</h2>
      </div>
      <div v-if="!posStore.mySales" class="w-full h-full">
        <div class="mx-auto max-w-lg">
          <div class="flex flex-col items-center text-center">
            <MaterialSymbolsLightTableLamp class="text-5xl"/>
            <h2 class="mt-2 text-base font-semibold leading-6 text-gray-900">No sales data available.</h2>
            <p class="mt-1 text-sm text-gray-500">You haven't made any sales with the store yet. Once a sale is
              completed, its details will be displayed on this page.</p>
          </div>
        </div>
      </div>
      <div v-else class="inline-block min-w-full py-2 align-middle">
        <table class="min-w-full divide-y divide-gray-300">
          <thead>
          <tr>
            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-900 sm:pl-3">Bill</th>
            <th scope="col" class="hidden sm:table-cell px-3 py-3.5 text-left text-xs font-semibold text-gray-900">Date
            </th>
            <th scope="col" class="px-3 py-3.5 text-left text-xs font-semibold text-gray-900">Total</th>
            <th scope="col" class="hidden sm:table-cell px-3 py-3.5 text-left text-xs font-semibold text-gray-900">Tax
              Total
            </th>
            <th scope="col" class="hidden sm:table-cell px-3 py-3.5 text-left text-xs font-semibold text-gray-900">Bill
              Total
            </th>
            <th scope="col" class="px-3 py-3.5 text-left text-xs font-semibold text-gray-900">Status</th>
            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-3">
              <span class="sr-only">Edit</span>
            </th>
          </tr>
          </thead>
          <tbody class="bg-white">
          <tr v-for="sale in posStore.mySales" :key="sale.id" class="even:bg-gray-50">
            <td class="py-4 pl-4 pr-3 text-xs font-medium text-gray-900 sm:pl-3">
              {{ sale.number }}
              <dl class="font-normal sm:hidden">
                <dd class="mt-1 truncate text-gray-700">{{ sale.date }}</dd>
              </dl>
            </td>
            <td class="hidden sm:table-cell whitespace-nowrap px-3 py-4 text-xs text-gray-500">{{ sale.date }}</td>
            <td class="px-3 py-4 text-xs text-gray-500">
              MRF. {{ sale.total_sales_price.toFixed(2) }}
              <dl class="font-light sm:hidden">
                <dd class="mt-1 truncate">Tax: MRF. {{ sale.total_tax.toFixed(2) }}</dd>
                <dd class="mt-1 truncate">Bill Total: MRF.
                  {{ (sale.total_sales_price + sale.total_tax).toFixed(2) }}
                </dd>
              </dl>
            </td>
            <td class="hidden sm:table-cell px-3 py-4 text-xs text-gray-500">MRF. {{ sale.total_tax.toFixed(2) }}</td>
            <td class="hidden sm:table-cell px-3 py-4 text-xs text-gray-500">
              MRF. {{ (sale.total_sales_price + sale.total_tax).toFixed(2) }}
            </td>
            <td class="px-3 py-4 text-xs text-gray-500 uppercase">
              {{ sale.payment_status }}
            </td>
            <td class="relative py-4 pl-3 pr-4 text-right text-md font-medium ">
              <div class="flex flex-col sm:flex-row gap-2">
                <MaterialSymbolsLightReceiptLong @click="openBill(sale.id)"/>
                <a :href="sale.ebill_url" target="_blank" class="text-gray-600 hover:text-gray-900">
                  <MaterialSymbolsLightDownload/>
                </a>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <c-dialog ref="posBill" :title="selectedBill?.number">
        <template #body>
          <div class="mt-4">
            <ul class="flex flex-col divide-y ">
              <li class="flex justify-between items-end text-xs font-extralight"
                  v-for="line in selectedBill?.bill_lines">
                <p class="leading-6">{{ line.text }}</p>
                <p>{{ line.sales_price.toFixed(2) }}</p>
              </li>
            </ul>

            <div class="mt-5 flex flex-col items-end leading-6 gap-1">
              <p class="text-xs font-extralight">Total: {{ selectedBill?.total_sales_price }}</p>
              <p class="text-xs font-extralight">Total Tax: {{ selectedBill?.total_tax }}</p>
              <p class="text-xs font-semibold border-b">Bill Total:
                {{ (selectedBill!.total_sales_price + selectedBill!.total_tax).toFixed(2) }}</p>
            </div>
          </div>
        </template>
      </c-dialog>
    </div>
  </div>

</template>

<script setup lang="ts">
import {usePosStore} from "@/stores/posStore";
import {computed, onMounted, ref} from "vue";
import {useUserStore} from "@/stores/userStore";
import MaterialSymbolsLightDownload from "@/components/icons/download.vue";
import MaterialSymbolsLightReceiptLong from "@/components/icons/receipt.vue";
import CDialog from "@/components/cDialog.vue";
import type {BillData} from "@/types/ewitySales";
import MaterialSymbolsLightTableLamp from "@/components/icons/tableLamp.vue";

const posStore = usePosStore()
const userStore = useUserStore()
const posBill = ref<typeof CDialog | null>(null)
const selectedBill = ref<BillData | null>(null)

const openBill = async (billId: number): Promise<void> => {
  selectedBill.value = await posStore.fetchBill(billId)
  posBill.value?.openModal()
}

const initials = computed<string>(() => {
  let name = 'EE'
  if (userStore.customer) {
    name = userStore.customer.name
  }
  const i = name.match(/(\b\S)?/g)?.join("").toUpperCase()
  return i ? i : 'EE'
})

const joinedDate = computed<string | null>(() => {
  if (userStore.customer) {
    return new Date(userStore.customer?.created_unix * 1000).toLocaleDateString('en-US')
  }
  return null
})

onMounted(async () => {
  if (userStore.customer) {
    await posStore.fetchMySales(userStore.customer)
  }
})
</script>
