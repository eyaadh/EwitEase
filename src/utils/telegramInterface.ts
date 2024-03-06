import axios from "axios";

const informViaTelegram = (message = 'Order Received') => {
	return new Promise(async (resolve, reject) => {
		const botToken = import.meta.env.VITE_BOT_TOKEN
		const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const data = {
            chat_id: import.meta.env.VITE_BOT_ADMIN_CHAT_ID,
			text: message,
			parse_mode: 'HTML'
        }

        try {
            const resp = await axios.post(apiUrl, data)
            resolve (resp.data)
        } catch (e) {
            reject(e)
        }
	})
}

export {informViaTelegram}