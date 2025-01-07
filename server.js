const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index', { response: null });
});

app.post('/submit-prompt', async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await axios.post(
      `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=2024-08-01-preview`,
      {
        messages: [{role: "user", content: prompt}],
        temperature: 0.7,
        top_p: 0.95,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 800,
        stop: null
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.AZURE_OPENAI_KEY
        }
      }
    );
    res.render('index', { response: response.data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.render('index', { response: 'Error fetching response from OpenAI API ' + error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
