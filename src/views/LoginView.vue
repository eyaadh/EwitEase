<template>
  <div class="flex flex-col gap-y-6 min-h-screen items-center justify-center">
    <div class="animate-pulse  flex items-baseline">
      <svg viewBox="0 0 1186 1356" class="w-20">
        <path
          d="m135 0 19 9 243 126 23 12 33 17 79 41 15 8v233l5 2 24 12 7 4 5-1 33-17 1-233 24-12 19-10 33-17 23-12L1020 7l13-7h2v144l-22 12-20 10-19 10-33 17-23 12-137 71-9 5h-2l1 87 24-12 19-10 33-17 23-12 162-84h3v622l-8 5-41 21-19 10-33 17-46 24h-1l-1-478-41 21-19 10-33 17-23 12-166 86-17 9h-5l-19-10-33-17-241-125-5-3-1 477-2 1-133-69-13-7V232l36 18 19 10 33 17 160 83 15 8v-87l-45-23-19-10-33-17-160-83-6-4z"
          fill="currentColor"/>
        <path
          d="M768 552h2v481l-22 12-22 11-19 10-35 18-23 12-25 13h-2V628l37-19 19-10 29-15 19-10 29-15zM401 552l6 2 19 10 27 14 19 10 29 15 19 10 27 14 2 2v480l-4-1-26-13-19-10-33-17-52-27-14-8z"
          fill="currentColor"/>
        <path
          d="m552 1168 3 3 17 36 28 60 10 23 3 8 2-3 13-29 32-70 12-26 2-2 4 15 27 116 11 48v2h-27l-20-89-2-16-7 19-18 36-11 23-17 34-3-4-23-47-11-23-14-30-3-9-3 19-18 83-1 4h-27l8-37 28-123zM810 1171h28l16 4 15 6 12 8 10 9 9 10 8 13 6 15 3 14v25l-4 17-8 17-9 12-13 13-14 9-14 6-15 4-8 1h-16l-17-3-16-6-11-6-9-7-9-8-10-13-8-16-4-14-1-6v-26l4-17 8-17 9-12 13-13 14-9 14-6zm7 26-14 3-14 7-10 9-8 9-7 14-3 12v23l4 14 6 11 10 12 13 9 12 5 9 2h18l15-4 11-6 10-9 8-9 7-14 3-12v-22l-3-11-8-16-9-10-8-7-14-7-14-3z"
          fill="currentColor"/>
        <path
          d="M143 1174h28v65h85v-64l1-1h28v175h-29v-84h-85v84h-29v-174zM325 1174h97v25h-69v43h69v26h-69v55h69v26h-97z"
          fill="currentColor"/>
        <path
          d="M985 1171h24l12 3 12 6 7 6 6 9 1 5-19 10-4 1-7-9-10-5-10-1-10 2-6 4-4 5-2 11 3 9 6 7 14 9 23 11 15 10 9 9 6 12 2 11-1 16-4 13-6 9-5 6-10 7-13 5-12 2h-15l-15-3-14-7-8-7-7-11-4-12 16-8 5-2h3l6 12 7 6 11 4h17l9-4 5-5 3-5 1-4v-11l-4-8-9-8-15-8-16-8-14-9-10-9-6-9-3-8-1-6v-11l3-13 5-9 8-9 9-6 11-4z"
         fill="currentColor"/>
        <path d="M0 1174h121v25H75v150H46v-150H0z" fill="currentColor"/>
        <path d="M1065 1174h120l1 1v24h-46v150h-29v-150h-46z" fill="currentColor"/>
      </svg>
    </div>
    <h2 class="animate-in slide-in-from-top duration-700 text-2xl font-extralight text-gray-500">Sign in to your
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
                      <option value="960">MV(+960)</option>
                      <option value="1">US(+1)</option>
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
                {{ confirmationResult !== null ? 'Sign in' : 'Get verification code' }}
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
import {XCircleIcon} from '@heroicons/vue/20/solid'
import {useUserStore} from "@/stores/userStore";
import {useRouter} from "vue-router";

const otpInput = ref<InstanceType<typeof VOtpInput> | null>(null);
const phoneNumber = ref<string>('')
const countryCode = ref<string>('960')
const otpNumber = ref<string>('')
const confirmationResult = ref<boolean>(false)
const errorMessage = ref<string>('')
const isError = ref<boolean>(false)
const userStore = useUserStore()
const router = useRouter()

const prepareSignIn = (): void => {
  if (phoneNumber.value) {
    if (confirmationResult.value) { // Check if confirmationResult is available
      // validate and the push towards home
      // userStore.userData = result.user as FirebaseUser
      // router.push({name: 'home'});
      userStore.verifyMsgOwlOtp(`${countryCode.value}${phoneNumber.value}`, otpNumber.value)
        .then(resp => router.push({name: 'home'}))
        .catch(err => {
          console.error(err)
          errorMessage.value = err.detail
          isError.value = true
        })
    } else {
      userStore.sendMsgOwlOtp(`${countryCode.value}${phoneNumber.value}`)
        .then(resp => {
          confirmationResult.value = true
        })
        .catch(err => {
          console.error(err)
          errorMessage.value = err.detail
          isError.value = true
        })
    }
  }

}

onMounted(() => {

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
