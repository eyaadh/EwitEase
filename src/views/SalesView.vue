<template>
  <div class="p-4 gap-2 overflow-hidden">
    <div v-if="!posStore.mySales" class="w-full h-full">
      <div class="mx-auto max-w-lg">
        <div class="flex flex-col items-center text-center">
          <MaterialSymbolsLightTableLamp class="text-5xl" />
          <h2 class="mt-2 text-base font-semibold leading-6 text-gray-900">No sales data available.</h2>
          <p class="mt-1 text-sm text-gray-500">You haven't made any sales with the store yet. Once a sale is completed, its details will be displayed on this page.</p>
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

</template>

<script setup lang="ts">
import {usePosStore} from "@/stores/posStore";
import {onMounted, ref} from "vue";
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

onMounted(async () => {
  if (userStore.customer) {
    await posStore.fetchMySales(userStore.customer)
  }
})
</script>
