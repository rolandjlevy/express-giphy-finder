const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

const axios = require('axios').default;
const { PORT = 3000, API_KEY } = process.env;
const url = (query) => (`https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${query}&limit=25&offset=0&rating=g&lang=en`);

app.get('/', (req, res) => {
  res.render('index.ejs', { giphys:[] });
});

app.post('/search', async (req, res) => {
  const { search } = req.body;
  const giphys = await getGiphys(search);
  res.render('index.ejs', { giphys });
});

const getGiphys = async (query) => {
  const fullUrl = url(query);
  const response = await axios.get(fullUrl); 
  return response.data.data.map(item => {
    const { url, images } = item;
    return `
    <p>
      <a href="${url}" target="_blank">
        <img src="${images.fixed_width.url}}" />
      </a>
    </p>`;
  }).join('');
}

app.listen(PORT, () => {
  console.log('Server started on port', PORT);
});