// Importeer het npm pakket express uit de node_modules map
import express from 'express'

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// Declare de base URLs van de directus API
const tnoApiUrl = 'https://fdnd-agency.directus.app/items/DPI_TNO/1'
const chaptersApiUrl = 'https://fdnd-agency.directus.app/items/DPI_chapters'

// Maak een nieuwe express app aan
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Stel ejs in als template engine
app.set('view engine', 'ejs')

// Stel de map met ejs templates in
app.set('views', './views')

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static('public'))

// ROUTES
app.get('/', async (req, res) => {
  try {
    const [tnoData, chaptersData] = await Promise.all([
      fetchJson(tnoApiUrl),
      fetchJson(chaptersApiUrl)
    ]);
    res.render('index', { tno: tnoData.data, chapters: chaptersData.data });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Nieuwe route om specifieke sectie weer te geven
app.get('/chapter/:id', async (req, res) => {
  try {
    const chapterId = req.params.id;
    const chapterData = await fetchJson(`${chaptersApiUrl}/${chapterId}`);
    res.render('chapter', { chapter: chapterData.data });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Poort instellen waarop Express moet luisteren
app.set("port", process.env.PORT || 8089);

// Start de Express server
app.listen(app.get("port"), function () {
  console.log(`Applicatie gestart op http://localhost:${app.get("port")}`);
});
