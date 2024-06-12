// Importeer het npm pakket express uit de node_modules map
import express from 'express';

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js';

// Declare de base URLs van de Directus API
const tnoApiUrl = 'https://fdnd-agency.directus.app/items/DPI_TNO/1';
const chaptersApiUrl = 'https://fdnd-agency.directus.app/items/DPI_chapters';

// Maak een nieuwe express app aan
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Stel ejs in als template engine
app.set('view engine', 'ejs');

// Stel de map met ejs templates in
app.set('views', './views');

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static('public'));

// Functie om data op te halen en een belofte (promise) terug te geven
const fetchData = async (url) => {
  try {
    const data = await fetchJson(url);
    return data.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw error; // Door de fout door te geven, kunnen we deze later afhandelen
  }
};

// GET-route voor de homepage
app.get('/', async (req, res) => {
  try {
    // Haal de data op van beide APIs tegelijk
    const tnoData = await fetchData(tnoApiUrl);
    const chaptersData = await fetchData(chaptersApiUrl);

    // Render de 'index' template met de opgehaalde data
    res.render('index', { tno: tnoData, chapters: chaptersData });
  } catch (error) {
    console.error('Error in GET / route:', error);
    res.status(500).send('Server Error');
  }
});

// GET-route voor een specifieke hoofdstukpagina
app.get('/chapter/:id', async (req, res) => {
  try {
    const chapterId = req.params.id;
    const chapterData = await fetchData(`${chaptersApiUrl}/${chapterId}`);

    // Render de 'chapter' template met de specifieke hoofdstuk data
    res.render('chapter', { chapter: chapterData });
  } catch (error) {
    console.error('Error in GET /chapter/:id route:', error);
    res.status(500).send('Server Error');
  }
});

// Poort instellen waarop Express moet luisteren
app.set('port', process.env.PORT || 8089);

// Start de Express server
app.listen(app.get('port'), () => {
  console.log(`Applicatie gestart op http://localhost:${app.get('port')}`);
});
