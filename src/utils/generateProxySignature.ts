import CryptoJS from "crypto-js";

const generateSignature = (apiUrl: string) => {
    const secretKey: string = import.meta.env.VITE_PROXY_SECRET_KEY
    const timestamp = Date.now();
    const expiration = timestamp + (60 * 1000) //signature expiration in milliseconds
    const encryptedExpiration = CryptoJS.AES.encrypt(expiration.toString(), secretKey).toString()
    const dataToSign = apiUrl + encryptedExpiration
    const hmac = CryptoJS.HmacSHA256(dataToSign, secretKey)
    return `${hmac.toString()}.${encryptedExpiration}`
}

export default generateSignature