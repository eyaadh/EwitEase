<template>
  <div class="flex flex-col gap-y-6 min-h-screen items-center justify-center">
    <div class="animate-in slide-in-from-top duration-700 flex items-baseline border-b border-gray-100">
      <h1 class="text-xl font-bold uppercase">Ewit</h1>
      <span class="font-medium text-sm">Ease</span>
    </div>
    <h2 class="animate-in slide-in-from-top duration-700 text-2xl font-extralight text-gray-500">Sing in to your
      account</h2>
    <div
      class="animate-in slide-in-from-bottom duration-700 mx-auto max-w-sm sm:max-w-4xl w-[480px] border-t border-gray-50 ring-inset rounded-md flex flex-col overflow-hidden">
      <div class="relative isolate h-full w-full">
        <div class="w-full flex justify-end p-10">
          <form class="flex flex-col w-full gap-y-10">
            <div class="flex flex-col gap-y-4">
              <div v-show="isError" class="animate-in slide-in-from-top duration-700 rounded-md bg-red-50 p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <XCircleIcon aria-hidden="true" class="h-5 w-5 text-red-400"/>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">An error occurred:</h3>
                    <div class="mt-2 text-sm text-red-700">
                      <p class="capitalize">{{ errorMessage }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium leading-6 text-gray-900" for="email">Phone Number</label>
                <div class="relative mt-2 rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 flex items-center">
                    <label class="sr-only" for="country">Country</label>
                    <select id="country" v-model="countryCode" autocomplete="country"
                            class="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-8 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-600"
                            name="country">
                      <option value="+960">MV(+960)</option>
                      <option value="+1">US(+1)</option>
                    </select>
                  </div>
                  <input id="phone-number" v-model="phoneNumber"
                         class="block w-full rounded-md border-0 py-1.5 pl-28 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:leading-6"
                         name="phone-number"
                         placeholder="987-6543"
                         type="text"/>
                </div>
              </div>
              <div v-show="confirmationResult" class="animate-in slide-in-from-bottom duration-700">
                <label class="block text-sm font-medium leading-6 text-gray-900" for="password">OTP</label>

                <div class="mt-2 flex">
                  <v-otp-input
                    ref="otpInput"
                    v-model:value="otpNumber"
                    :conditionalClass="['mr-2', 'mr-2' , 'mr-2', 'mr-2', 'mr-2', '']"
                    :num-inputs="6"
                    :placeholder="['0', '0', '0', '0', '0', '0']"
                    :should-auto-focus="true"
                    input-classes="appearance-none block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                    input-type="tel"
                    separator=""
                  />
                </div>
              </div>

            </div>
            <div>
              <button id="sign-in-button"
                      class="w-full px-2 py-1 border rounded bg-gray-950 hover:bg-gray-500 text-white text-sm"
                      type="submit"
                      @click.prevent="prepareSignIn">
                {{ confirmationResult !== null ? 'Sing in' : 'Get verification code' }}
              </button>
            </div>
          </form>
        </div>
        <div class="absolute bottom-0 -z-10 opacity-80 w-full text-neutral-950">
          <svg id="svg" class="transition duration-300 ease-in-out delay-150" height="100%" preserveAspectRatio="none"
               viewBox="0 0 1440 390"
               width="100%" xmlns="http://www.w3.org/2000/svg">
            <path class="transition-all duration-300 ease-in-out delay-150 path-0"
                  d="M 0,400 L 0,150 C 211,141 422,132 662,132 C 902,132 1171,141 1440,150 L 1440,400 L 0,400 Z"
                  fill="currentColor" fill-opacity="1" stroke="none"
                  stroke-width="0"></path>
          </svg>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import VOtpInput from "vue3-otp-input";
import {auth} from "@/utils/firebaseConfig";
import type {ConfirmationResult} from "firebase/auth";
import {RecaptchaVerifier, signInWithPhoneNumber} from "firebase/auth";
import {XCircleIcon} from '@heroicons/vue/20/solid'
import {useUserStore} from "@/stores/userStore";
import type {FirebaseUser} from "@/types/firebaseUser";
import {useRouter} from "vue-router";

const otpInput = ref<InstanceType<typeof VOtpInput> | null>(null);
const phoneNumber = ref<string>('')
const countryCode = ref<string>('+960')
const otpNumber = ref<string>('')
const confirmationResult = ref<ConfirmationResult | null>(null)
const errorMessage = ref<string>('')
const isError = ref<boolean>(false)
const userStore = useUserStore()
const router = useRouter()

const prepareSignIn = (): void => {
  if (confirmationResult.value) { // Check if confirmationResult is available
    confirmationResult.value.confirm(otpNumber.value)
      .then((result) => {
        userStore.userData = result.user as FirebaseUser
        router.push({name: 'home'});
      }).catch((error) => {
      console.error(error)
      errorMessage.value = error.code.split('/')[1].trim()
      isError.value = true
    });
  } else {
    signInWithPhoneNumber(auth, `${countryCode.value}${phoneNumber.value}`, (window as any).recaptchaVerifier)
      .then((result) => {
        isError.value = false
        confirmationResult.value = result // Update confirmationResult
      }).catch((error) => {
      console.log(error.code)
      confirmationResult.value = null
      errorMessage.value = error.code.split('/')[1].trim()
      isError.value = true
    });
  }

}

onMounted(() => {
  (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
    'size': 'invisible',
    'callback': (_: any) => {
      //
    },
    'error-callback': (error: any) => {
      console.log(error);
    }
  })
})
</script>

<style scoped>
.path-0 {
  animation: pathAnim-0 4s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes pathAnim-0 {
  0% {
    d: path("M 0,400 L 0,150 C 211,141 422,132 662,132 C 902,132 1171,141 1440,150 L 1440,400 L 0,400 Z");
  }
  25% {
    d: path("M 0,400 L 0,150 C 270,174 540,198 780,198 C 1020,198 1230,174 1440,150 L 1440,400 L 0,400 Z");
  }
  50% {
    d: path("M 0,400 L 0,150 C 205.5,183 411,216 651,216 C 891,216 1165.5,183 1440,150 L 1440,400 L 0,400 Z");
  }
  75% {
    d: path("M 0,400 L 0,150 C 276,129.5 552,109 792,109 C 1032,109 1236,129.5 1440,150 L 1440,400 L 0,400 Z");
  }
  100% {
    d: path("M 0,400 L 0,150 C 211,141 422,132 662,132 C 902,132 1171,141 1440,150 L 1440,400 L 0,400 Z");
  }
}
</style>
