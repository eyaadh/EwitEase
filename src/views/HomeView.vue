<template>
  <div class="relative p-5 flex flex-col gap-2 divide-y">
    <div
      v-if="posStore.myCart.length"
      class="animate-in slide-in-from-right duration-700 sm:hidden fixed z-40 h-10 w-10 bottom-2 right-0 bg-gray-50 flex items-center pl-4 pr-1 border-r border-y rounded-l-full"
      @click="router.push({name: 'cart'})">
      <ShoppingCartIcon class="h-5 w-5"/>
    </div>

    <portal to="searchBar">
      <div class="relative isolate rounded-2xl overflow-hidden">
        <input v-if="showSearch" id="search" v-model="posStore.productFilterQueryValue" class="animate-in slide-in-from-right duration-700 block max-w-48 sm:max-w-full w-full rounded-2xl border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 placeholder:italic focus:ring-2 focus:ring-inset focus:ring-gray-300 text-xs" name="search"
               placeholder="Product name..."
               type="text"/>
        <div :class="[showSearch? 'absolute top-0 right-[0.2px]': '']">
          <CircleButton :class="[showSearch? 'p-1.5 w-9 h-[36px] rounded-2xl border border-gray-300': '']" @click="showSearch = !showSearch">
            <MagnifyingGlassIcon class="h-4"/>
          </CircleButton>
        </div>
      </div>
    </portal>

    <!--section heading-->
    <div class="animate-in slide-in-from-top duration-700 flex items-center gap-2 text-gray-500">
      <ShoppingBagIcon class="h-5 sm:h-6"/>
      <h2 class="sm:text-xl font-bold leading-6 tracking-tighter">Categories</h2>
    </div>

    <!--Categories Container-->
    <div v-infinite-scroll="[loadMoreCategories, { distance: posStore.categoriesTotalItems > 10 ? posStore.categories!.length - 5 : 1, direction: 'right' }]"
         class="sticky top-0 w-full rounded-md overflow-auto p-2.5 bg-gray-100/60 [&::-webkit-scrollbar]:hidden"
         v-bind="categoryContainerProps">
      <div class="flex gap-2" v-bind="categoryWrapperProps">
        <div v-for="{data: cat} in categoryList"
             class="group animate-in slide-in-from-bottom duration-700 relative border border-gray-200 h-20 w-20 sm:h-36 sm:w-36 flex-shrink-0 rounded-md overflow-hidden"
             @click="categorySelected(cat)">

          <div v-if="posStore.selectedCategoryId === cat.id" class="absolute z-10 top-1 right-1">
            <arrows-pointing-in-icon class="h-2 w-2"/>
          </div>

          <div aria-hidden="true" class="absolute inset-0">
            <img :alt="cat.name" :src="cat.image? cat.image.url: posStore.categoriesDefaultImage"
                 class="h-full w-full object-cover object-center group-hover:scale-110"/>
          </div>

          <div
            :class="[
              posStore.selectedCategoryId === cat.id ? 'bg-neutral-900/70': '',
              'rounded-b-md absolute bottom-0 w-full flex flex-col p-1 sm:p-2 gap-1 sm:gap-2 sm:flex-row sm:justify-between mt-auto text-center text-xs sm:text-sm font-extralight text-white bg-neutral-900/40 group-hover:bg-neutral-900/60 filter backdrop-blur-sm']">
            <span class="whitespace-nowrap truncate">{{ cat.name }}</span>
            <span class="bg-white/10 rounded-full px-2">{{ cat.product_count }}</span>
          </div>
        </div>
      </div>
    </div>

    <!--Products Container-->
    <div v-infinite-scroll="[loadMoreProducts, { distance: posStore.productsTotalItems > 10 ? posStore.products!.length - 5 : 1}]"
         class="h-[620px] rounded-lg overflow-auto [&::-webkit-scrollbar]:hidden">
      <div :class="[ posStore.productsTotalItems > 15 ? '' : 'h-full',
        'w-full rounded-md p-2.5 bg-gray-100/60 [&::-webkit-scrollbar]:hidden']" v-bind="productContainerProps">
        <div class="grid grid-cols-4 sm:grid-cols-6 grid-flow-row gap-2" v-bind="productWrapperProps">
          <div v-for="{data: product} in productList" :key="product.id"
               v-motion-roll-visible-once-right
               class="relative group h-32 sm:h-48 rounded-md overflow-hidden border "
               @click="productSelected(product)">
            <img
              :alt="product.name"
              :src="product.variants[0].images.length > 0 ? product.variants[0].images[0].url : posStore.productDefaultImage" class="h-full w-full object-cover object-center group-hover:scale-110"/>
            <div
              class="rounded-b-md flex flex-col gap-1 absolute bg-neutral-900/60 w-full bottom-0 py-1.5 px-2 h-14 sm:h-16 text-gray-100 group-hover:bg-gray-900/40 filter backdrop-blur-sm">
              <h3 class="font-extralight text-[9.5px] sm:text-xs line-clamp-2 uppercase">{{ product.name }}</h3>
              <p class="font-extralight text-[8.5px] sm:text-[11px]">MRF. {{ product.sales_price_with_tax }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <c-dialog ref="itemDialog" :title="selectedItem?.name" @closed="itemDialogClosed()">
      <template #body>
        <div class="flex items-start gap-2">
          <img :alt="selectedItem?.name"
               :src="selectedItem!.variants[0].images.length > 0 ? selectedItem?.variants[0].images[0].url : posStore.productDefaultImage"
               class="h-40 max-w-40 rounded-md object-cover object-center border border-gray-50">
          <div class="flex flex-col items-end w-full">
            <p class="block text-xs font-light leading-6 tracking-tight text-gray-900">Price: MRF
              {{ selectedItem?.default_sales_price_with_tax.toFixed(2) }} / {{ selectedItem?.units.base }}</p>
            <p class="block text-xs font-light leading-6 text-gray-900">Total: MRF
              {{ selectedTotalPrice }}
            </p>
            <div class="w-full">
              <ComboBox :disabled="isAddToCartDisabled"
                        :items="Array.from({ length: (selectedItem!.count) }, (_, index) => ({ id: index + 1, name: `${index + 1}` }))"
                        label="Select Quantity"
                        @selected="selectedQty = $event.id as number"/>
            </div>
            <n-button :disabled="isAddToCartDisabled" :label="isAddToCartDisabled? 'Out of stock' : 'Add'"
                      @click="addItemToCart()"/>
          </div>

        </div>
      </template>
    </c-dialog>

    <c-dialog ref="customerRegistrationDialog" title="New Customer">
      <template #body>
        <form>
          <div class="pb-10 border-b border-gray-900/10">
            <h2 class="text-base font-semibold leading-7 text-gray-900">Profile Details</h2>
            <p class="mt-1 text-sm leading-6 text-gray-600">This information is essential for reaching out to you and
              ensuring the successful delivery of your orders. Kindly provide the correct details.</p>

            <div class="mt-5 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
              <div class="sm:col-span-1">
                <label class="block text-sm font-medium leading-6 text-gray-900" for="email">Contact Number</label>
                <div class="mt-2">
                  <input id="phone-number" :value="userStore.userData?.phoneNumber" autocomplete="tel" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                         disabled name="phone-number"
                         type="tel"/>
                </div>
              </div>

              <div class="sm:col-span-1">
                <label class="block text-sm font-medium leading-6 text-gray-900" for="email">Full Name</label>
                <div class="mt-2">
                  <input id="name" v-model="customerRegistrationForm.name" autocomplete="name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6" name="name"
                         placeholder="Ahmed Ibrahim Mohamed"
                         type="tel"/>
                </div>
                <p v-if="validatorCustomerRegistration.name.$error"
                   id="email-error"
                   class="mt-2 text-xs text-red-600 animate-pulse">Not a valid name.</p>
              </div>
            </div>

            <div class="mt-2 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
              <div class="sm:col-span-1">
                <label class="block text-sm font-medium leading-6 text-gray-900" for="email">Email</label>
                <div class="mt-2">
                  <input id="email" v-model="customerRegistrationForm.email" autocomplete="email" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6" name="email"
                         placeholder="ahmed@ibrahim.com"
                         type="email"/>
                </div>
              </div>

              <div class="sm:col-span-1">
                <label class="block text-sm font-medium leading-6 text-gray-900" for="email">Address</label>
                <div class="mt-2">
                  <input id="address" v-model="customerRegistrationForm.address" autocomplete="address" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                         name="address"
                         placeholder="Hiya B 804, Flat Magu, Phase 2, Hulhumale"
                         type="text"/>
                </div>
                <p v-if="validatorCustomerRegistration.address.$error" id="email-error"
                   class="mt-2 text-xs text-red-600 animate-pulse">Not a valid address.</p>
              </div>
            </div>

          </div>
          <div class="mt-4">
            <n-button label="Save" @click.prevent="registerCustomer()"/>
          </div>
        </form>
      </template>
    </c-dialog>
  </div>
</template>

<script lang="ts" setup>
import {usePosStore} from "@/stores/posStore";
import {computed, onMounted, reactive, ref, watch} from "vue";
import {vInfiniteScroll} from '@vueuse/components'
import {useVirtualList} from '@vueuse/core'
import type {CategoriesStoreResponse, ProductCategory} from "@/types/ewityCategory";
import {ArrowsPointingInIcon, ShoppingBagIcon, ShoppingCartIcon} from "@heroicons/vue/24/solid";
import type {Product, ProductForCart, ProductsStoreResponse} from "@/types/ewityProducts";
import CDialog from "@/components/cDialog.vue";
import ComboBox from "@/components/ComboBox.vue";
import {useUserStore} from "@/stores/userStore";
import type {Customer, CustomerRegistration} from "@/types/ewityCustomer";
import NButton from "@/components/nButton.vue";
import {required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import CircleButton from "@/components/CircleButton.vue";
import {MagnifyingGlassIcon} from "@heroicons/vue/20/solid";
import {debounce} from "lodash";
import {useRouter} from "vue-router";

const userStore = useUserStore()
const posStore = usePosStore()
const selectedItem = ref<Product | null>(null)
const selectedQty = ref<number>(1)
const itemDialog = ref<typeof CDialog | null>(null)
const customerRegistrationDialog = ref<typeof CDialog | null>(null)
const showSearch = ref<boolean>(false)
const router = useRouter()

const customerRegistrationForm = reactive<CustomerRegistration>({
  mobile: userStore.userData?.phoneNumber,
  name: null,
  email: null,
  address: null
})

const customerRegistrationValidationRules = computed(() => {
  return {
    name: {required},
    address: {required},
  }
})

const validatorCustomerRegistration = useVuelidate(customerRegistrationValidationRules, customerRegistrationForm)

const registerCustomer = async () => {
  await validatorCustomerRegistration.value.$validate()

  if (!validatorCustomerRegistration.value.$error) {
    try {
      await userStore.createPOSCustomer(customerRegistrationForm)
      customerRegistrationDialog.value?.closeModal()
    } catch (e) {
      console.error(e)
    }
  }
}

watch(() => posStore.productFilterQueryValue, debounce(async (_: any): Promise<void> => {
  await fetchProducts()
}, 500))

watch(() => showSearch.value, async (newState: boolean): Promise<void> => {
  // if search is hidden assume that the customer wants to clear the search too
  if (!newState) {
    posStore.productFilterQueryValue = null
  }
})

const productSelected = async (product: Product): Promise<void> => {
  selectedItem.value = product
  itemDialog.value?.openModal()
}

const itemDialogClosed = async (): Promise<void> => {
  // selectedItem.value = null
  selectedQty.value = 1
}

const selectedTotalPrice = computed<number>(() => {
  if (selectedItem.value) {
    return selectedItem.value.default_sales_price_with_tax * selectedQty.value
  }
  return 0
})

const isAddToCartDisabled = computed<boolean>(() => {
  if (selectedItem.value) {
    return selectedItem.value?.count < 1;
  }
  return true
})
const addItemToCart = async (): Promise<void> => {
  // 1. get item details
  const product: Product = await posStore.fetchProductDetails(selectedItem.value!.id)
  const productForCart: ProductForCart = {
    variant_id: product.variants[0].id,
    product_id: product.id,
    product_name: product.name,
    product_image: product.variants[0].images.length > 0 ? product.variants[0].images[0].url : posStore.productDefaultImage,
    unit: product.units.base,
    unit_quantity: selectedQty.value,
    quantity: selectedQty.value,
    unit_sales_price: product.sales_price,
    total_sales_price: product.sales_price * selectedQty.value,
    base_sales_price: product.sales_price,
    total_base_sales_price: product.sales_price * selectedQty.value,
    base_tax_amount: product.sales_price_with_tax,
    total_base_tax_amount: product.sales_price_with_tax * selectedQty.value,
    taxes: product.taxes
  }

  posStore.myCart.push(productForCart)

  itemDialog.value?.closeModal()
}

const {list: categoryList, containerProps: categoryContainerProps, wrapperProps: categoryWrapperProps} = useVirtualList(
  computed(() => posStore.categories ? posStore.categories : []),
  {
    itemWidth: 144,
    overscan: 1
  },
)

const {list: productList, containerProps: productContainerProps, wrapperProps: productWrapperProps} = useVirtualList(
  computed(() => posStore.products ? posStore.products : []),
  {
    itemHeight: 36,
    overscan: 4
  },
)

const loadMoreCategories = async (): Promise<void> => {
  try {
    if (posStore.categoriesLastPage > posStore.categoriesPage) {
      posStore.categoriesPage = posStore.categoriesPage + 1
      const categories = await posStore.fetchCategories() as CategoriesStoreResponse
      posStore.categoriesPage = categories.currentPage
      posStore.categoriesLastPage = categories.categoriesLastPage
      posStore.categoriesTotalItems = categories.categoriesTotalItems

      categories.categories?.forEach(c => posStore.categories?.push(c))
    }
  } catch (e) {
    console.error(e)
  }
}

const loadMoreProducts = async (): Promise<void> => {
  try {
    if (posStore.productsLastPage > posStore.productsPage) {
      posStore.productsPage = posStore.productsPage + 1
      const products = await posStore.fetchProducts() as ProductsStoreResponse
      posStore.productsPage = products.productsPage
      posStore.productsLastPage = products.productsLastPage
      posStore.productsTotalItems = products.productsTotalItems

      products.products?.forEach(p => posStore.products?.push(p))
    }
  } catch (e) {
    console.error(e)
  }
}

const categorySelected = async (cat: ProductCategory): Promise<void> => {
  // first thing first, make sure that there is no products search filter applied
  posStore.productFilterQueryValue = null

  if (posStore.selectedCategoryId === cat.id) {
    posStore.selectedCategoryId = null
    posStore.productsPage = 1
    await fetchProducts()
    return
  }
  posStore.selectedCategoryId = cat.id
  posStore.productsPage = 1
  await fetchProducts()
}

const fetchProducts = async (): Promise<void> => {
  try {
    const products = await posStore.fetchProducts() as ProductsStoreResponse

    posStore.products = products.products
    posStore.productsPage = products.productsPage
    posStore.productsLastPage = products.productsLastPage
    posStore.productsTotalItems = products.productsTotalItems
  } catch (e) {
    console.error(e)
  }
}

onMounted(async () => {
  // check if the user is available on pos
  try {
    userStore.customer = await userStore.fetchCustomerDetails() as Customer

    if (!(userStore.customer)) {
      customerRegistrationDialog.value?.openModal()
    }
  } catch (e) {
    console.error(e)
  }

  try {
    const categories = await posStore.fetchCategories() as CategoriesStoreResponse
    posStore.categories = categories.categories
    posStore.categoriesPage = categories.currentPage
    posStore.categoriesLastPage = categories.categoriesLastPage
    posStore.categoriesTotalItems = categories.categoriesTotalItems

    await fetchProducts()
  } catch (e) {
    console.error(e)
  }

})
</script>
