import {defineStore} from "pinia"
import {signOut, onAuthStateChanged} from "firebase/auth";
import {auth} from "@/utils/firebaseConfig"
import axios from "axios";
import type {AxiosRequestConfig} from 'axios'
import type {FirebaseUser} from "@/types/firebaseUser";
import type {Customer} from "@/types/ewityCustomer";


export const useUserStore = defineStore("userStore", {
    state: () => ({
        userData: null as FirebaseUser | null,
        customer: null as Customer | null,
        loadingSession: false,
        apiUrl: import.meta.env.VITE_POS_API_URL as string,
        axiosConfig: {
            method: 'get' as string,
            maxBodyLength: Infinity,
            url: null as string | null,
            headers: {
                'Authorization': import.meta.env.VITE_POS_API_KEY
            }
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
            return new Promise((resolve, reject) => {
                const config: AxiosRequestConfig = {...this.axiosConfig}
                config.url = `${this.apiUrl}v1/customers?q_q=${this.userData?.phoneNumber}`
                axios.request(config)
                    .then((response) => {
                        this.customer = response.data.pagination.total > 0 ? response.data.data[0] : null
                        resolve(this.customer)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
        createPOSCustomer(data: any) {
            return new Promise((resolve, reject) => {
                const config = this.axiosConfig
                config.method = 'POST'
                config.url = 'https://cros-proxy.eyaadh.workers.dev/?apiUrl=https://api.ewitypos.com/v1/customers'
                config.data = data

                axios.request(config)
                    .then((response) => {
                        this.customer = response.data.data
                        resolve(this.customer)
                    })
                    .catch((error) => {
                        reject(error)
                    });
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