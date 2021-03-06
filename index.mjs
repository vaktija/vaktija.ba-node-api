import express from "express";
import "moment-duration-format";
import moment from "moment-hijri";
// import "moment/locale/bs";
import rateLimit from 'express-rate-limit';

import { godisnja, mjesecna, dnevna, lokacija } from "./api/vaktija/index.mjs";

moment.updateLocale("bs", {
  iMonths: [
    "Muharrem",
    "Safer",
    "Rebi'u-l-evvel",
    "Rebi'u-l-ahir",
    "Džumade-l-ula",
    "Džumade-l-uhra",
    "Redžeb",
    "Ša'ban",
    "Ramazan",
    "Ševval",
    "Zu-l-ka'de",
    "Zu-l-hidždže"
  ]
});

const app = express();

// app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Previse pokusaja, pokusajte malo kasnije ili kontaktirajte info@vaktija.ba za vise informacija.'
});

//  apply to all requests
app.use(limiter);

app.use((req, res, next) => {
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // next();

  res.set('Access-Control-Allow-Origin', '*');
  // res.set('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, X-Requested-With, auth_token, X-CSRF-Token, Authorization');
  res.set('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, X-Requested-With');
  // res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT, PATCH');
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  // res.set('Access-Control-Allow-Credentials', 'true');

  // intercept OPTIONS method
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// app.get("/", (req, res) => res.send("vaktija.ba API"));

app.get("/", (req, res) => res.send({
  lokacija: "Sarajevo",
  datum: [
    moment().format("iD. iMMMM iYYYY").toLowerCase(),
    moment().format('dddd, D. MMMM YYYY')
  ],
  vakat: dnevna().vakat
}));

app.get("/vaktija", (req, res) => res.send(`

<!doctype html>
            <html lang="">
              <head>
                  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                  <meta charset="utf-8" />
                  
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <meta name="theme-color" content="#fff" />

                  <meta property="og:url" content="https://vaktija.ba"/>
                  <meta property="og:type" content="website"/>
                  <meta property="og:title" content="Vaktija za Bosnu i Hercegovinu"/>
                  <meta property="og:description" content="Vaktija za Bosnu i Hercegovinu"/>
                  <meta property="og:image" content="https://vaktija.ba/logo.png"/>
              
                  <meta name="twitter:card" content="summary_large_image">
                  <meta name="twitter:title" content="Vaktija za Bosnu i Hercegovinu">
                  <meta name="twitter:image" content="https://vaktija.ba/logo.png">
                  <meta name="twitter:description" content="Vaktija za Bosnu i Hercegovinu">

                  <meta http-equiv="refresh" content="21600">

                  <meta name="apple-itunes-app" content="app-id=1095343967">

                  <link rel="icon" href="/favicon.png">

                  <link rel="apple-touch-icon" href="/icon.png">
                  <link rel="apple-touch-startup-image" href="/icon.png">
                  <meta name="apple-mobile-web-app-status-bar-style" content="white">

                  <meta name="msapplication-TileColor" content="#FFFFFF"/>
                  <meta name="msapplication-TileImage" content="/icon.png"/>
                  <meta name="msapplication-config" content="none"/>
                  <meta name="application-name" content="Vaktija za Bosnu i Hercegovinu"/>

                  <meta name="keywords"
                        content="vaktija, vaktija 2019, vaktija za 2019, vaktija bih, vaktija za bih, vaktija bosna i hercegovina, vaktija za bosnu i hercegovinu, vaktija sandžak, vaktija za sandžak, vaktija za sarajevo, vaktija za zenicu, vaktija za tuzlu, vaktija za bihać, vaktija za mostar, vaktija za banja luku, vaktija za travnik, vaktija sabah, vaktija podne, vaktija ikindija, vaktija akšam, vaktija jacija, takvim, takvim 2019, takvim za 2019, takvim bih, takvim za bih, takvim bosna i hercegovina, takvim za bosnu i hercegovinu, takvim za sarajevo, takvim za zenicu, takvim za tuzlu, takvim za bihać, takvim za mostar, takvim za banja luku, takvim za travnik, takvim sabah, takvim podne, takvim ikindija, takvim akšam, takvim jacija">
              </head>
              <body style="font-family: Arial, Helvetica">
                  <div id="root"><h1>/vaktija</h1>
                  <a href="/vaktija/v1">/v1</a>
                </div>
              </body>
            </html>
`));

app.get("/vaktija/v1", (req, res) => res.send(`

<!doctype html>
            <html lang="">
              <head>
                  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                  <meta charset="utf-8" />

                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <meta name="theme-color" content="#fff" />

                  <meta property="og:url" content="https://vaktija.ba"/>
                  <meta property="og:type" content="website"/>
                  <meta property="og:title" content="Vaktija za Bosnu i Hercegovinu"/>
                  <meta property="og:description" content="Vaktija za Bosnu i Hercegovinu"/>
                  <meta property="og:image" content="https://vaktija.ba/logo.png"/>
              
                  <meta name="twitter:card" content="summary_large_image">
                  <meta name="twitter:title" content="Vaktija za Bosnu i Hercegovinu">
                  <meta name="twitter:image" content="https://vaktija.ba/logo.png">
                  <meta name="twitter:description" content="Vaktija za Bosnu i Hercegovinu">

                  <meta http-equiv="refresh" content="21600">

                  <meta name="apple-itunes-app" content="app-id=1095343967">

                  <link rel="icon" href="/favicon.png">

                  <link rel="apple-touch-icon" href="/icon.png">
                  <link rel="apple-touch-startup-image" href="/icon.png">
                  <meta name="apple-mobile-web-app-status-bar-style" content="white">

                  <meta name="msapplication-TileColor" content="#FFFFFF"/>
                  <meta name="msapplication-TileImage" content="/icon.png"/>
                  <meta name="msapplication-config" content="none"/>
                  <meta name="application-name" content="Vaktija za Bosnu i Hercegovinu"/>

                  <meta name="keywords"
                        content="vaktija, vaktija 2019, vaktija za 2019, vaktija bih, vaktija za bih, vaktija bosna i hercegovina, vaktija za bosnu i hercegovinu, vaktija sandžak, vaktija za sandžak, vaktija za sarajevo, vaktija za zenicu, vaktija za tuzlu, vaktija za bihać, vaktija za mostar, vaktija za banja luku, vaktija za travnik, vaktija sabah, vaktija podne, vaktija ikindija, vaktija akšam, vaktija jacija, takvim, takvim 2019, takvim za 2019, takvim bih, takvim za bih, takvim bosna i hercegovina, takvim za bosnu i hercegovinu, takvim za sarajevo, takvim za zenicu, takvim za tuzlu, takvim za bihać, takvim za mostar, takvim za banja luku, takvim za travnik, takvim sabah, takvim podne, takvim ikindija, takvim akšam, takvim jacija">
              </head>
              <body style="font-family: Arial, Helvetica">
                  <div id="root">
                      <h1>vaktija.ba v1 API primjeri</h1>
                        <p>Sarajevo, danas (default)</p>
                      <h2>https://api.vaktija.ba/</h2>
                        <code>
                        {
                          "lokacija": "Sarajevo",
                          "datum": [
                            "7. zu-l-hidždže 1440",
                            "četvrtak, 8. august 2019"
                          ],
                          "vakat": [
                            "3:38",
                            "5:35",
                            "12:53",
                            "16:48",
                            "20:08",
                            "21:50"
                          ]
                        }
                        </code>
                        <h3>/vaktija/v1/:lokacija</h3>
                          <p>https://api.vaktija.ba/vaktija/v1/77</p>
                        <h3>/vaktija/v1/:lokacija/:godina</h3>
                          <p>https://api.vaktija.ba/vaktija/v1/77/2019</p>
                        <h3>/vaktija/v1/:lokacija/:godina/:mjesec</h3>
                          <p>https://api.vaktija.ba/vaktija/v1/77/2019/7</p>
                        <h3>/vaktija/v1/:lokacija/:godina/:mjesec/:dan</h3>
                          <p>https://api.vaktija.ba/vaktija/v1/77/2019/7/30</p>
                      <h2>Trenutno dostupne lokacije (Number)</h2>
                        <h3>/vaktija/v1/lokacije</h3>
                        <p>https://api.vaktija.ba/vaktija/v1/lokacije</p>
                          <ol start=0">
                          ${lokacija().lokacija.map(l => `<li>${l}</li>`).join('')}
                          </ol>
                  </div>
              </body>
            </html>
`));

app.get("/vaktija/v1/lokacije", (req, res, next) => {
  // res.send("spisak lokacija")
  res.send(lokacija().lokacija)
});

app.get("/vaktija/v1/:location", (req, res, next) => {
  // res.send("vaktija/v1/location")
  let { location } = req.params;

  res.send({
    id: Number(location),
    lokacija: lokacija().lokacija[location],
    datum: [
      moment().format("iD. iMMMM iYYYY").toLowerCase(),
      moment().format('dddd, D. MMMM YYYY')
    ],
    vakat: dnevna(location).vakat
  })
});

app.get("/vaktija/v1/:location/:year", (req, res, next) => {
  // res.send("vaktija/v1/location/year")
  let { location, year } = req.params;

  res.send({
    id: Number(location),
    lokacija: lokacija().lokacija[location],
    godina: Number(year),
    mjesec: godisnja(location, year).mjesec
  }
  )
});

app.get("/vaktija/v1/:location/:year/:month", (req, res, next) => {
  // res.send("vaktija/v1/location/year/month")
  let { location, year, month } = req.params;

  res.send({
    id: Number(location),
    lokacija: lokacija().lokacija[location],
    godina: Number(year),
    mjesec: Number(month),
    dan: mjesecna(location, year, month).dan
  })
});

app.get("/vaktija/v1/:location/:year/:month/:day", (req, res, next) => {
  // res.send("vaktija/v1/location/year/month/day")
  let { location, year, month, day } = req.params;

  res.send({
    id: Number(location),
    lokacija: lokacija().lokacija[location],
    godina: Number(year),
    mjesec: Number(month),
    dan: Number(day),
    datum: [
      moment([year, month - 1, day]).format("iD. iMMMM iYYYY").toLowerCase(),
      moment([year, month - 1, day]).format('dddd, D. MMMM YYYY')
    ],
    vakat: dnevna(location, year, month, day).vakat
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Pogresan unos!')
})

app.use((req, res) => {
  res.status(404);
  res.send({ error: "404 Not Found" });
});

var port = process.env.PORT || 8080;

app.listen(port, () =>
  console.log("Vaktija.ba API app listening on port 8080!"),
);
