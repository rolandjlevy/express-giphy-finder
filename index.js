const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const axios = require('axios').default;
const { PORT = 3000, API_KEY } = process.env;
const url = (query) => (`https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${query}&limit=25&offset=0&rating=g&lang=en`);

app.get('/', (req, res) => {
  res.send(`
    ${getSearchForm()}
  `);
});

app.post('/search', async (req, res) => {
  const { search } = req.body;
  const giphys = await getGiphys(search);
  res.send(`
    ${getSearchForm()}
    ${giphys}
  `);
});

const getGiphys = async (query) => {
  const fullUrl = url(query);
  const response = await axios.get(fullUrl); 
  return response.data.data.map(item => {
    const { url, images } = item;
    return `<p><img src="${images.fixed_width.url}}" /></p>`;
  }).join('');
}

const getSearchForm = () => {
  return `
    <form action="/search" method="post">
      <input name="search" placeholder="search for a giphy..." />
      <button type="submit">go</button>
    </form>
  `;
}

app.listen(PORT, () => {
  console.log('Server started on port', PORT);
});