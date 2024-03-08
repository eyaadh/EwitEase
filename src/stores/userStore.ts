import {defineStore} from "pinia"
import {signOut, onAuthStateChanged} from "firebase/auth";
import {auth} from "@/utils/firebaseConfig"
import axios from "axios";
import type {AxiosRequestConfig} from 'axios'
import type {FirebaseUser} from "@/types/firebaseUser";
import type {Customer} from "@/types/ewityCustomer";
import generateSignature from "@/utils/generateProxySignature";


export const useUserStore = defineStore("userStore", {
    state: () => ({
        userData: null as FirebaseUser | null,
        customer: null as Customer | null,
        loadingSession: false,
        proxyApiUrl: import.meta.env.VITE_PROXY_API_URL as string,
        axiosConfig: {
            method: 'get' as string,
            maxBodyLength: Infinity,
            url: null as string | null,
        } as AxiosRequestConfig
    }),
    actions: {
        async logoutUser() {
            return new Promise(async (resolve, reject) => {
                try {
                    await signOut(auth)
                    this.userData = null
                    resolve(true)
                } catch (error) {
                    reject(error)
                }
            })
        },
        fetchCustomerDetails() {
            return new Promise(async (resolve, reject) => {
                const config: AxiosRequestConfig = {...this.axiosConfig}
                config.url = `${this.proxyApiUrl}customers/${this.userData?.phoneNumber}`
                config.headers = {
                    'X-Signature': generateSignature(config.url)
                }

                try {
                    const response = await axios.request(config)
                    this.customer = response.data.pagination.total > 0 ? response.data.data[0] : null
                    resolve(this.customer)
                } catch (e) {
                    reject(e)
                }
            })
        },
        createPOSCustomer(data: any) {
            return new Promise(async (resolve, reject) => {
                const config = this.axiosConfig
                config.method = 'POST'
                config.url = `${this.proxyApiUrl}customers`
                config.data = data

                config.headers = {
                    'X-Signature': generateSignature(config.url)
                }

                try {
                    const response = await axios.request(config)
                    this.customer = response.data.data
                    resolve(this.customer)
                } catch (e) {
                    reject(e)
                }
            })
        },
        currentUser() {
            return new Promise((resolve, reject) => {
                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        this.userData = user as FirebaseUser
                    } else {
                        this.userData = null
                    }
                    resolve(user)
                }, (e) => reject(e))
            })
        },

    }
})