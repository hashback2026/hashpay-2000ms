const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function normalizePhone(phone) {
    phone = phone.trim();

    if (phone.startsWith('0')) {
        return '254' + phone.substring(1);
    }

    if (phone.startsWith('+254')) {
        return phone.replace('+', '');
    }

    return phone;
}

app.post('/send-bulk-stk', async (req, res) => {
    try {
        const { numbers, amount, reference } = req.body;

        if (!numbers || numbers.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No phone numbers provided'
            });
        }

        const results = [];

        for (const number of numbers) {
            const phone = normalizePhone(number);

            try {
                const response = await axios.post(
                    'https://api.hashback.co.ke/initiatestk',
                    {
                        api_key: process.env.API_KEY,
                        account_id: process.env.ACCOUNT_ID,
                        amount: amount,
                        msisdn: phone,
                        reference: reference
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );

                results.push({
                    phone,
                    success: true,
                    response: response.data
                });

            } catch (error) {
                results.push({
                    phone,
                    success: false,
                    error: error.response?.data || error.message
                });
            }

            await delay(2000);
        }

        res.json({
            success: true,
            total: results.length,
            results
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
