import {defineStore} from "pinia"
import type {AxiosRequestConfig} from 'axios'
import axios from "axios";
import {useStorage} from "@vueuse/core";
import defaultCategoryImage from "@/assets/images/categories.png"
import defaultProductImage from "@/assets/images/product.png"
import type {ProductCategory} from "@/types/ewityCategory";
import type {Product, ProductForCart} from "@/types/ewityProducts";
import type {BillData, SaleData} from "@/types/ewitySales";
import type {Customer} from "@/types/ewityCustomer";

export const usePosStore = defineStore("posStore", {
    state: () => ({
        axiosConfig: {
            method: 'get' as string,
            maxBodyLength: Infinity,
            url: null as string | null,
            headers: {
                'Authorization': import.meta.env.VITE_POS_API_KEY
            }
        } as AxiosRequestConfig,
        apiUrl: import.meta.env.VITE_POS_API_URL as string,
        locationId: import.meta.env.VITE_POS_LOCATION_ID as number,
        categories: null as ProductCategory[] | null,
        categoryFilter: null as string | null,
        categoriesDefaultImage: defaultCategoryImage,
        categoriesPage: 1,
        categoriesTotalItems: 1,
        categoriesLastPage: 1,
        productDefaultImage: defaultProductImage,
        selectedCategoryId: null as number | null,
        products: null as Product[] | null,
        productsPage: 1,
        productsLastPage: 1,
        productsTotalItems: 1,
        productFilterQueryValue: null as string | null,
        myCart: useStorage('myCart', [] as ProductForCart[]),
        mySales: null as SaleData[] | null
    }),
    actions: {
        fetchCategories() {
            return new Promise(async (resolve, reject) => {
                const config: AxiosRequestConfig = {...this.axiosConfig}
                config.method = 'GET'
                config.url = `${this.apiUrl}v1/products/categories?page=${this.categoriesPage}`
                try {
                    const resp = await axios.request(config)
                    if (resp.data.pagination.total > 0) {
                        resolve({
                            categories: resp.data.data,
                            currentPage: resp.data.pagination.current,
                            categoriesLastPage: resp.data.pagination.lastPage,
                            categoriesTotalItems: resp.data.pagination.total
                        })
                    }
                } catch (e) {
                    reject(e)
                }
            })
        },
        fetchProducts() {
            return new Promise(async (resolve, reject) => {
                const config: AxiosRequestConfig = {...this.axiosConfig}
                config.method = 'GET'
                config.url = `${this.apiUrl}v1/products/locations/all?q_Category=${this.selectedCategoryId}&page=${this.productsPage}`
                if (this.productFilterQueryValue) {
                    config.url = `${this.apiUrl}v1/products/locations/all?q_name=${this.productFilterQueryValue}&page=${this.productsPage}`
                }
                try {
                    const resp = await axios.request(config)
                    if (resp.data.pagination.total > 0) {
                        resolve({
                            products: resp.data.data,
                            productsPage: resp.data.pagination.current,
                            productsLastPage: resp.data.pagination.lastPage,
                            productsTotalItems: resp.data.pagination.total
                        })
                    }
                } catch (e) {
                    reject(e)
                }
            })
        },
        fetchProductDetails(itemId: number): Promise<Product> {
            return new Promise(async (resolve, reject) => {
                const config: AxiosRequestConfig = {...this.axiosConfig}
                config.method = 'GET'
                config.url = `${this.apiUrl}v1/products/${itemId}`
                try {
                    const resp = await axios.request(config)
                    resolve(resp.data.data)
                } catch (e) {
                    reject(e)
                }
            })
        },
        fetchMySales(customer: Customer): Promise<SaleData[] | null> {
            return new Promise(async (resolve, reject) => {
                const config: AxiosRequestConfig = {...this.axiosConfig}
                config.method = 'GET'
                config.url = `${this.apiUrl}v1/sales/bills/customer/${customer.id}`
                // config.url = `${this.apiUrl}v1/sales/bills/customer/924851`

                try {
                    const resp = await axios.request(config)
                    if (resp.data.data.length > 0) {
                        this.mySales = resp.data.data as SaleData[]
                    }
                    resolve(this.mySales)
                } catch (e) {
                    reject(e)
                }
            })
        },
        fetchBill(billNumber: number): Promise<BillData> {
            return new Promise(async (resolve, reject) => {
                const config: AxiosRequestConfig = {...this.axiosConfig}
                config.method = 'GET'
                config.url = `${this.apiUrl}v1/sales/bills/${billNumber}`

                try {
                    const resp = await axios.request(config)
                    const billData: BillData = resp.data.data
                    resolve(billData)
                } catch (e) {
                    reject(e)
                }
            })
        },
        createQuotation(customerId: number): Promise<string> {
            return new Promise(async (resolve, reject) => {
                //1 . create quotation
                const config: AxiosRequestConfig = {...this.axiosConfig}
                config.method = 'POST'
                config.url = `${this.apiUrl}v1/quotations`
                config.data = {
                    "location_id": this.locationId,
                    "customer_id": customerId,
                }
                try {
                    const newQuote = await axios.request(config)
                    //2. collect the quotation ID for the newly created quotation
                    const newQuoteId = newQuote.data.data.id
                    //3. update the quotation with my cart
                    config.url = `${this.apiUrl}v1/quotations/${newQuoteId}/lines`
                    config.data = {lines: this.myCart}

                    const updatedQuote = await axios.request(config)
                    resolve(updatedQuote.data.data.number)
                } catch (e) {
                    reject(e)
                }

            })
        }
    }
})