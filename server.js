require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve everything in the project root (index.html, /images, CSS, JS, etc.)
app.use(express.static(path.join(__dirname)));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/chat', async (req, res) => {
  try {
    const messages = req.body.messages;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating response');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
