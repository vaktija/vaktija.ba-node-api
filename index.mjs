import express from "express";
import "moment-duration-format";
import moment from "moment-hijri";
import "moment/locale/bs";
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
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// app.get("/", (req, res) => res.send("vaktija.ba API"));

app.get("/", (req, res) => res.send({
  datum: [
    moment().format("iD. iMMMM iYYYY").toLowerCase(),
    moment().format('dddd, D. MMMM YYYY')
  ],
  vakat: dnevna().vakat
}));

app.get("/vaktija", (req, res) => res.send(`
<h1>/vaktija</h1>
<a href="/vaktija/v1">/v1</a>
`));

app.get("/vaktija/v1", (req, res) => res.send(`
<div>
  <div>
    <h1>vaktija.ba v1 API</h1>
  </div>
  <div>/vaktija/v1/:lokacija</div>
  <div>/vaktija/v1/:lokacija/:godina</div>
  <div>/vaktija/v1/:lokacija/:godina/:mjesec</div>
  <div>/vaktija/v1/:lokacija/:godina/:mjesec/:dan</div>

  <div>
    <h2>lokacije</h2>
    <p>/vaktija/v1/lokacije</p>
  </div>
  <div>
    <ol start=0">
    ${lokacija().lokacija.map(l => `<li>${l}</li>`).join('')}
    </ol>
  </div>
</div>

`));

app.get("/vaktija/v1/lokacije", (req, res, next) => {
  // res.send("spisak lokacija")
  res.send(lokacija().lokacija)
});

app.get("/vaktija/v1/:location", (req, res, next) => {
  // res.send("vaktija/v1/location")
  let { location } = req.params;

  res.send({
    lokacija: Number(location),
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
    lokacija: Number(location),
    godina: Number(year),
    mjesec: godisnja(location, year).mjesec
  }
  )
});

app.get("/vaktija/v1/:location/:year/:month", (req, res, next) => {
  // res.send("vaktija/v1/location/year/month")
  let { location, year, month } = req.params;

  res.send({
    lokacija: Number(location),
    godina: Number(year),
    mjesec: Number(month),
    dan: mjesecna(location, year, month).dan
  })
});

app.get("/vaktija/v1/:location/:year/:month/:day", (req, res, next) => {
  // res.send("vaktija/v1/location/year/month/day")
  let { location, year, month, day } = req.params;

  res.send({
    lokacija: Number(location),
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

app.listen(8080, () =>
  console.log("Vaktija.ba API app listening on port 8080!"),
);
