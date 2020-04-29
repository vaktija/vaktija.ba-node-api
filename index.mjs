import express from "express";
import "moment-duration-format";
import moment from "moment-hijri";
import "moment-timezone";
import rateLimit from "express-rate-limit";

import { mjesecna, lokacija } from "./api/vaktija/index.mjs";

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
  ],
  weekdaysShort: ["ned", "pon", "uto", "sri", "čet", "pet", "sub"]
});

// console.log();

const app = express();

// app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message:
    "Previse pokusaja, pokusajte malo kasnije ili kontaktirajte info@vaktija.ba za vise informacija."
});

app.use(express.static("public"));

//  apply to all requests
app.use(limiter);

app.use((req, res, next) => {
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // next();

  res.set("Access-Control-Allow-Origin", "*");
  // res.set('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, X-Requested-With, auth_token, X-CSRF-Token, Authorization');
  res.set(
    "Access-Control-Allow-Headers",
    "Origin, Accept, Content-Type, X-Requested-With"
  );
  // res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT, PATCH');
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  // res.set('Access-Control-Allow-Credentials', 'true');

  // intercept OPTIONS method
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// app.get("/", (req, res) => res.send("vaktija.ba API"));

app.get("/", (req, res) =>
  res.send({
    lokacija: "Sarajevo",
    datum: [
      moment().format("iD. iMMMM iYYYY").toLowerCase(),
      moment().format("dddd, D. MMMM YYYY")
    ],
    vakat: dnevna().vakat
  })
);

app.get("/:location/:year/:month", (req, res, next) => {
  let { location, year, month } = req.params;

  const monthlyVaktija = mjesecna(location, year, month);

  // {
  //   id: Number(location),
  //   lokacija: lokacija().lokacija[location],
  //   godina: Number(year),
  //   mjesec: Number(month),
  //   dan: mjesecna(location, year, month).dan
  // }

  res.send(`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
      <title>${location} Vaktija</title>
  
      <!-- Bootstrap -->
      <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
        integrity="sha384-HSMxcRTRxnN+Bdg0JdbxYKrThecOKuH5zCYotlSAcp1+c8xmyTe9GYg1l9a69psu"
        crossorigin="anonymous"
      />

      <link
      rel="stylesheet"
      href="/custom.css"
    />
  
      <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
      <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
      <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
        <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
      <![endif]-->
    </head>
    <body>
    <div class="container">
        <div class="row">
            <div class="col-lg-6 col-lg-offset-3">
                <img class="img-responsive center-block" alt="logo" src="/logo.svg" /></a>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="row">

        <br />

            <div class="col-lg-10 col-lg-offset-1">
                <div class="col-lg-6 print">
                    <blockquote class="col-lg-10">
                        <p>i koji molitve svoje na vrijeme obavljaju</p>
                        <footer>23:9 (El-Mu’minūn – Vjernici)</footer>
                    </blockquote>
                </div>
                <div class="col-lg-6 print">
                    <h1 style="color:#cacaca; font-weight:400; text-transform: lowercase; font-size: 4.5em" class="col-lg-12 text-right location print">${
                      lokacija().lokacija[location]
                    }</h1>
                </div>
            </div>
        </div>
    </div>
<br />
    <div class="container">
      <div class="row">
          <h1 style="color:#cacaca; font-weight:400; font-size: 4em" class="text-center text-lowercase jacija">${moment(
            [year, month - 1]
          ).format("MMMM YYYY")}</h1>
      </div>
      <br />

      <div class="row">
          <t class="col-lg-10 col-lg-offset-1">
              <table class="table table-hover table-condensed table-responsive">
                  <thead>
                      <tr>
                          <th style="width:30%;" colSpan=3>dan</th>
                          <th>zora</th>
                          <th>izlazak sunca</th>
                          <th>podne</th>
                          <th>ikindija</th>
                          <th>akšam</th>
                          <th>jacija</th>
                      </tr>
                  </thead>
                  <tbody>

                  ${monthlyVaktija.dan
                    .map((d, index) =>
                      moment(`${year}-${month}-${index + 1}`, "YYYY-M-D")
                        .tz("Europe/Sarajevo")
                        .format("ddd")
                        .toLowerCase() === "pet"
                        ? `<tr style="background-color:#f5f5f5; font-weight: bold">
                        <td style="text-align:center">${
                          index + 1
                        }</td>                       
                        <td style="text-align:center">
${moment(`${year}-${month}-${index + 1}`, "YYYY-M-D")
  .tz("Europe/Sarajevo")
  .format("ddd")
  .toLowerCase()}
</td>
<td>
${
  moment(`${year}-${month}-${index + 1}`, "YYYY-M-D")
    .tz("Europe/Sarajevo")
    .format("iD")
    .toLowerCase() === "1" || index === 0
    ? moment(`${year}-${month}-${index + 1}`, "YYYY-M-D")
        .tz("Europe/Sarajevo")
        .format("iD. iMMMM iYYYY")
        .toLowerCase()
    : moment(`${year}-${month}-${index + 1}`, "YYYY-M-D")
        .tz("Europe/Sarajevo")
        .format("iD")
        .toLowerCase()
}
  </td>
                        </td>     
                      <td class="monthly text-center">${d.vakat[0]}</td>
                      <td class="monthly text-center">${d.vakat[1]}</td>
                      <td class="monthly text-center">${d.vakat[2]}</td>
                      <td class="monthly text-center">${d.vakat[3]}</td>
                      <td class="monthly text-center">${d.vakat[4]}</td>
                      <td class="monthly text-center">${d.vakat[5]}</td>
                    </tr>`
                        : `<tr>
                        <td style="font-weight: bold; text-align:center">${
                          index + 1
                        }</td>

                        
                        <td style="text-align:center">
${moment(`${year}-${month}-${index + 1}`, "YYYY-M-D")
  .tz("Europe/Sarajevo")
  .format("ddd")
  .toLowerCase()}
</td>
                       

<td>
${
  moment(`${year}-${month}-${index + 1}`, "YYYY-M-D")
    .tz("Europe/Sarajevo")
    .format("iD")
    .toLowerCase() === "1" || index === 0
    ? moment(`${year}-${month}-${index + 1}`, "YYYY-M-D")
        .tz("Europe/Sarajevo")
        .format("iD. iMMMM iYYYY")
        .toLowerCase()
    : moment(`${year}-${month}-${index + 1}`, "YYYY-M-D")
        .tz("Europe/Sarajevo")
        .format("iD")
        .toLowerCase()
}
  </td>
                        </td>
                      


                                   
                      <td class="monthly text-center">${d.vakat[0]}</td>
                      <td class="monthly text-center">${d.vakat[1]}</td>
                      <td class="monthly text-center">${d.vakat[2]}</td>
                      <td class="monthly text-center">${d.vakat[3]}</td>
                      <td class="monthly text-center">${d.vakat[4]}</td>
                      <td class="monthly text-center">${d.vakat[5]}</td>
                    </tr>`
                    )
                    .join("")}
                  </tbody>
              </table>
          </div>
      </div>
  </div>

<br />

  <div class="container">
        <div class="row">
            <div class="col-lg-12 text-center">
                <a href="https://play.google.com/store/apps/details?id=ba.vaktija.android">
                    <img class="img-rounded" alt="Google" src="/img/google-badge.png" height="40" /></a>
                <a href="https://itunes.apple.com/us/app/vaktija.ba/id1095343967?ls=1&mt=8">
                    <img class="img-rounded" alt="Apple" src="/img/apple-badge.svg" height="40" /></a>
                <a href="https://www.microsoft.com/en-us/store/apps/vaktijaba/9nblggh5lc4p">
                    <img class="img-rounded" alt="Microsoft" src="/img/microsoft-badge.png" height="40" /></a>
            </div>
        </div>
    </div>

    <br />

    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <h5 style="color:#404040; font-weight: 400" class="text-center text-lowercase"><span>vaktija.ba 2008 - ${year}</span>
                </h5>
            </div>
        </div>
    </div>

      <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
      <script
        src="https://code.jquery.com/jquery-1.12.4.min.js"
        integrity="sha384-nvAa0+6Qg9clwYCGGPpDQLVpLNn0fRaROjHqs13t4Ggj3Ez50XnGQqc/r8MhnRDZ"
        crossorigin="anonymous"
      ></script>
      <!-- Include all compiled plugins (below), or include individual files as needed -->
      <script
        src="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"
        integrity="sha384-aJ21OjlMXNL5UyIl/XNwTMqvzeRMZH2w8c5cRVpzpU8Y5bApTppSuUkhZXN0VxHd"
        crossorigin="anonymous"
      ></script>
    </body>
  </html>
  
  `);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Pogresan unos!");
});

app.use((req, res) => {
  res.status(404);
  res.send({ error: "404 Not Found" });
});

var port = process.env.PORT || 8080;

app.listen(port, () =>
  console.log("Vaktija.ba API app listening on port 8080!")
);
