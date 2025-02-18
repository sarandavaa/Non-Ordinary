require('dotenv').config();

const openaiConfig = {
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORGANIZATION, // optional
    defaultModel: 'gpt-4', // you can change this to gpt-4 or other models
    maxTokens: 2000,
    temperature: 0.7
};

module.exports = openaiConfig; 