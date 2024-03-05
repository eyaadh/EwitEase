<template>
  <div class="flex w-full min-h-screen bg-gray-100">
    <!--static navbar for desktop-->
    <div class="hidden sm:flex flex-col min-h-full items-center gap-5 w-16 py-4 px-1">
      <div class="h-10 w-10">
        <div class="flex items-center justify-center h-full w-full rounded-full bg-gray-950">
          <p class="text-white">TM</p>
        </div>
      </div>
      <div class="h-2/4 flex-1 flex flex-col gap-4">
        <template v-for="nav in navs" :key="nav.id">
          <router-link :to="nav.location"
                       :class="[nav.active ? 'bg-gray-950/40': '',
                         'p-2.5 rounded-full border text-2xl text-gray-950 hover:bg-gray-950/40 hover:text-white focus:outline-none focus:ring-1 focus:ring-gray-100']">
            <component :is="nav.icon"/>
          </router-link>
        </template>
        <div @click="logoutUser()"
             class="p-2.5 rounded-full border text-2xl text-gray-950 hover:bg-gray-950/40 hover:text-white focus:outline-none focus:ring-1 focus:ring-gray-100">
          <MaterialSymbolsLightLock class="h-4"/>
        </div>
      </div>
    </div>

    <div class="flex flex-col w-full overflow-hidden">
      <!-- top navigation -->
      <nav class="w-full flex items-center justify-between px-5 pt-4 pb-2">
        <!--mobile navigation pop over-->
        <Popover class="sm:hidden relative">
          <PopoverButton
            class="p-2.5 rounded-full text-sm bg-gray-50 text-gray-950 hover:bg-gray-950/40 hover:text-white focus:outline-none focus:ring-1 focus:ring-gray-100">
            <Bars3Icon class="h-4"/>
          </PopoverButton>

          <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 translate-y-1"
                      enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150"
                      leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
            <PopoverPanel class="absolute left-16 z-10 mt-2 flex w-screen max-w-max -translate-x-1/2 px-4">
              <div
                class="max-w-md flex-auto overflow-hidden rounded-md bg-gray-100 text-sm leading-6 shadow-md ring-1 ring-gray-900/5">
                <div class="p-0.5 divide-y">
                  <router-link :to="nav.location" v-for="nav in navs" :key="nav.id"
                               class="group flex items-center gap-x-2 rounded-md p-2 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-100">
                    <div
                      class="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-gray-50 group-hover:bg-white">
                      <component :is="nav.icon"
                                 :class="[nav.active ? 'bg-gray-950/40': '', 'p-1 rounded-full border text-3xl text-gray-950 hover:bg-gray-950/40 hover:text-white']"/>
                    </div>
                    <div>
                        <span class="font-semibold leading-5 tracking-tighter text-xs text-gray-600">
                          {{ nav.name }}
                        </span>
                    </div>
                  </router-link>
                  <div
                    @click="logoutUser()"
                    class="group relative flex items-center gap-x-2 rounded-md p-2 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-100">
                    <div
                      class="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-gray-50 group-hover:bg-white">
                      <MaterialSymbolsLightLock/>
                    </div>
                    <div>
                        <span class="font-semibold leading-5 tracking-tighter text-xs text-gray-600">
                          Sign out
                        </span>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverPanel>
          </transition>
        </Popover>

        <h3 class="text-xl sm:text-2xl font-bold leading-6 tracking-tighter text-gray-600">{{ activeNav.name }}</h3>
        <div class="flex gap-2">
          <portal-target name="searchBar"></portal-target>
        </div>
      </nav>

      <div class="h-full p-2.5">
        <div class="h-full rounded-2xl bg-gray-50">
          <router-view v-slot="{Component}">
            <component :is="Component" class="animate-in slide-in-from-right duration-700"/>
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Bars3Icon} from "@heroicons/vue/20/solid";
import {Popover, PopoverButton, PopoverPanel} from '@headlessui/vue'
import {computed, onMounted, reactive, shallowRef, watch} from "vue";
import type {navigation} from "@/types/navigation";
import {useUserStore} from "@/stores/userStore";
import {useRoute, useRouter} from "vue-router";
import {PortalTarget} from "portal-vue";
import MaterialSymbolsLightLock from "@/components/icons/lock.vue";
import MaterialSymbolsLightStore from "@/components/icons/home.vue"
import MaterialSymbolsLightShoppingCart from "@/components/icons/cart.vue"
import MaterialSymbolsLightListAltRounded from "@/components/icons/list.vue"

const route = useRoute()
const navs = reactive<navigation[]>([
  {id: 1, location: '/', icon: shallowRef(MaterialSymbolsLightStore), name: 'Store Home', active: true},
  {id: 2, location: '/cart', icon: shallowRef(MaterialSymbolsLightShoppingCart), name: 'My Cart', active: false},
  {id: 3, location: '/sales', icon: shallowRef(MaterialSymbolsLightListAltRounded), name: 'My Sales', active: false},
])

const activeNav = computed<navigation>(() => {
  const i: number = navs.findIndex(nav => nav.active)
  return navs[i]
})

const userStore = useUserStore()
const router = useRouter()
const logoutUser = async () => {
  try {
    const logOutState = await userStore.logoutUser()
    if (logOutState) {
      await router.push({name: 'login'})
    }
  } catch (e) {
    console.error(e)
  }
}

const updateNavActive = async (): Promise<void> => {
  let index: number = navs.findIndex(item => item.location === route.path)
  navs.forEach((item): void => {
    item.active = false
  })
  if (index !== -1) {
    navs[index].active = true
  }
}

watch(() => route.path, async (): Promise<void> => {
  await updateNavActive()
})

onMounted(async () => {
  await updateNavActive()
})
</script>