const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('cross-fetch');
const server = express();

// set the server on port 8080
const PORT = process.env.PORT || 8080;
let response = '';
let searchQuery ;
const perPage = 30;
const accessKey = 'pJdwW7tlcHzcWCimQT-Yeu3-Z19_-7im9Rvj8o5dYVs';

server.use(express.static('public'));
server.use(bodyParser.urlencoded({ extended: false }));
server.set('view engine', 'ejs');


async function loadImage(page) {
  try {
    if (!searchQuery) {
      const response = await fetch(
        `https://api.unsplash.com/photos/?per_page=${perPage}&page=${page}&client_id=${accessKey}`
      );
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
      const data = await response.json();
      return data;
    } else {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=${perPage}&page=${page}&client_id=${accessKey}`
      );
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
      const data = await response.json();
      const images = data.results;
      return images;
    }
  } catch (error) {
    console.log('Error fetching images:', error);
    throw error;
  }
}

loadImage(1)

// server.post('/submit', async (req, res) => {
  // const query = req.body.query;
  // searchQuery = query;
  // try {
    // const images = await loadImage();
    // response = images;
    // res.redirect('/');
  // } catch (error) {
    // res.status(500).send('Error fetching images');
  // }
// });

// server.get('/:id', (req, res) =>{

// const id = req.params.id

// console.log(id)
// res.send('Hellow')
// })

server.post('/search', async (req, res) => {
  const query = req.body.query;
  searchQuery = query;
  try {
    const images = await loadImage();
    response = images;
    res.render('index', { response: response });
  } catch (error) {
    res.status(500).send('Error fetching images');
  }
});


server.get('/', (req, res) => {
  const page = req.query.page || 1; // Get the page parameter from the query string
  loadImage(page)
    .then((images) => {
      response = images;
      res.render('index', { response });
    })
    .catch((error) => {
      console.log('Error fetching images:', error);
      res.status(500).send('Error fetching images');
    });
});

  server.get('/favorites', (req, res) => {
    res.render('favorite');
  });


// launch the server
server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
