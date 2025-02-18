const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

if (!process.env.OPENAI_API_KEY) {
    console.error('No API key found in environment variables');
    process.exit(1);
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY.trim()
});

router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        console.log('Received message:', message);

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant specializing in dream interpretation, spiritual guidance, and personal growth, drawing from Buddhism, Shamanism, and Jungian psychology."
                },
                {
                    role: "user",
                    content: message
                }
            ],
            temperature: 0.7,
        });

        console.log('OpenAI response:', completion.choices[0].message);
        
        res.json({ 
            response: completion.choices[0].message.content 
        });
    } catch (error) {
        console.error('OpenAI API Error:', error);
        res.status(500).json({ 
            error: error.message || 'An error occurred while processing your request' 
        });
    }
});

module.exports = router; 