const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');

if (!process.env.OPENAI_API_KEY) {
    console.error('No API key found in environment variables');
    throw new Error('OpenAI API key is required');
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const upload = multer({ storage: multer.memoryStorage() });

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

router.post('/transcribe', upload.single('audio'), async (req, res) => {
    let tempFilePath = null;
    
    try {
        if (!req.file || !req.file.buffer) {
            throw new Error('No audio file received');
        }

        // Save the buffer to a temporary file
        tempFilePath = path.join(os.tmpdir(), `audio-${Date.now()}.webm`);
        fs.writeFileSync(tempFilePath, req.file.buffer);

        // Send to OpenAI for transcription
        const response = await openai.audio.transcriptions.create({
            file: fs.createReadStream(tempFilePath),
            model: "whisper-1",
            language: "en"
        });

        res.json({ text: response.text });

    } catch (error) {
        console.error('Transcription error:', error);
        res.status(500).json({ 
            error: 'Transcription failed',
            details: error.message 
        });
    } finally {
        // Clean up temporary file
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }
    }
});

module.exports = router; 