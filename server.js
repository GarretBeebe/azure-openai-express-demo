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
      `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}/completions?api-version=2022-12-01`,
      {
        prompt: prompt,
        max_tokens: 50
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.AZURE_OPENAI_API_KEY
        }
      }
    );

    res.render('index', { response: response.data.choices[0].text });
  } catch (error) {
    console.error(error);
    res.render('index', { response: 'Error fetching response from OpenAI API' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});