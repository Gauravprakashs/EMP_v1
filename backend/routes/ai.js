const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
require('dotenv').config();

// POST /ai/generate
router.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });
  try {
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt,
        max_tokens: 120,
        temperature: 0.7
      })
    });
    const data = await response.json();
    if (data.choices && data.choices[0] && data.choices[0].text) {
      res.json({ text: data.choices[0].text.trim() });
    } else {
      res.status(500).json({ error: 'No text generated' });
    }
  } catch (err) {
    res.status(500).json({ error: 'AI generation failed', details: err.message });
  }
});

module.exports = router;
