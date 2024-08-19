const express = require('express')
const i18next = require('i18next')
const i18nextMiddleware = require('i18next-http-middleware')
const Backend = require('i18next-fs-backend')

const app = express()
const port = process.env.PORT || 3000

const languageDetector = new i18nextMiddleware.LanguageDetector()

i18next
  .use(Backend)
  .use(languageDetector)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    // debug: true,
    // detection: {
    //   order: ['customDetector']
    // },
    backend: {
      loadPath: __dirname + '/locales/{{lng}}/{{ns}}.json',
      addPath: __dirname + '/locales/{{lng}}/{{ns}}.missing.json'
    },
    fallbackLng: 'en',
    load: 'languageOnly',
    saveMissing: true
  })

app.use(i18nextMiddleware.handle(i18next))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('index', {
    title: req.t('home.title'),
    welcome: req.t('home.welcome'),
    info: JSON.stringify({
      'req.language': req.language,
      'req.i18n.language': req.i18n.language,
      'req.i18n.languages': req.i18n.languages,
      'req.i18n.languages[0]': req.i18n.languages[0],
      'req.t("home.title")': req.t('home.title')
    }, null, 2)
  })
})

app.get('/missingtest', (req, res) => {
  req.t('nonExisting', 'some default value')
  res.send('check the locales files...')
})

app.use('/locales', express.static('locales'))

// or instead of static
// app.get('/locales/:lng/:ns', i18nextMiddleware.getResourcesHandler(i18next))
// app.get('/locales/:lng/:ns', i18nextMiddleware.getResourcesHandler(i18next, { cache: false }))
// loadPath for client: http://localhost:8080/locales/{{lng}}/{{ns}}

// missing keys make sure the body is parsed (i.e. with [body-parser](https://github.com/expressjs/body-parser#bodyparserjsonoptions))
app.post('/locales/add/:lng/:ns', i18nextMiddleware.missingKeyHandler(i18next))


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})

// curl localhost:8080 -H 'Accept-Language: de-de'
