import express from "express";
import "moment-duration-format";
import moment from "moment-hijri";
import "moment-timezone";
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

const app = express();

app.use(express.static("public"));

app.get("/", (req, res) => res.send("/:location/:year/:month"));

app.get("/:location/:year/:month", (req, res, next) => {
  const { location, year, month } = req.params;
  const monthlyVaktija = mjesecna(location, year, month);
  const grad = lokacija().lokacija[location];
  const vaktijaZa = moment([year, month - 1]).format("MMMM YYYY");

  res.send(`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
      <title>${grad} - Vaktija</title>
  
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
  
        <br />    
        <br />

        <div class="row">
            <div class="col-lg-12">
                <img class="img-responsive center-block" alt="logo" src="/logo.svg" /></a>
            </div>
        </div>
        
        <br />
        
        <div class="row">
            <div class="col-lg-10 col-lg-offset-1">
              <div class="row">
                <div class="col-lg-6">
                        <blockquote>
                            <p>i koji molitve svoje na vrijeme obavljaju</p>
                            <footer>23:9 (El-Mu’minūn – Vjernici)</footer>
                        </blockquote>
                    </div>
                    <div class="col-lg-6">
                        <h1 class="text-right">${grad}</h1>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row">
          <div class="col-lg-12">
            <h2 class="text-center">${vaktijaZa}</h2>
          </div>
        </div>

        <br />

        <div class="row">
            <div class="col-lg-10 col-lg-offset-1">
                <table class="table table-hover table-responsive">
                    <thead>
                        <tr>
                            <th colSpan=3>dan</th>
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
                          ? `<tr class="p">
                                <td class="g">${index + 1}</td>     
                                                  
                                <td class="d">
                                ${moment(
                                  `${year}-${month}-${index + 1}`,
                                  "YYYY-M-D"
                                )
                                  .tz("Europe/Sarajevo")
                                  .format("ddd")
                                  .toLowerCase()}
                                </td>

                                <td class="h">
                                ${
                                  moment(
                                    `${year}-${month}-${index + 1}`,
                                    "YYYY-M-D"
                                  )
                                    .tz("Europe/Sarajevo")
                                    .format("iD")
                                    .toLowerCase() === "1" || index === 0
                                    ? moment(
                                        `${year}-${month}-${index + 1}`,
                                        "YYYY-M-D"
                                      )
                                        .tz("Europe/Sarajevo")
                                        .format("iD. iMMMM iYYYY")
                                        .toLowerCase()
                                    : moment(
                                        `${year}-${month}-${index + 1}`,
                                        "YYYY-M-D"
                                      )
                                        .tz("Europe/Sarajevo")
                                        .format("iD")
                                        .toLowerCase()
                                }
                                </td>

                                <td>${d.vakat[0]}</td>
                                <td>${d.vakat[1]}</td>
                                <td>${d.vakat[2]}</td>
                                <td>${d.vakat[3]}</td>
                                <td>${d.vakat[4]}</td>
                                <td>${d.vakat[5]}</td>
                            </tr>`
                          : `<tr>
                                  <td class="g">${index + 1}</td>

                                  <td class="d">
                                    ${moment(
                                      `${year}-${month}-${index + 1}`,
                                      "YYYY-M-D"
                                    )
                                      .tz("Europe/Sarajevo")
                                      .format("ddd")
                                      .toLowerCase()}
                                  </td>
                                
                                  <td class="h">
                                  ${
                                    moment(
                                      `${year}-${month}-${index + 1}`,
                                      "YYYY-M-D"
                                    )
                                      .tz("Europe/Sarajevo")
                                      .format("iD")
                                      .toLowerCase() === "1" || index === 0
                                      ? moment(
                                          `${year}-${month}-${index + 1}`,
                                          "YYYY-M-D"
                                        )
                                          .tz("Europe/Sarajevo")
                                          .format("iD. iMMMM iYYYY")
                                          .toLowerCase()
                                      : moment(
                                          `${year}-${month}-${index + 1}`,
                                          "YYYY-M-D"
                                        )
                                          .tz("Europe/Sarajevo")
                                          .format("iD")
                                          .toLowerCase()
                                  }
                                  </td>
                                    
                                  <td>${d.vakat[0]}</td>
                                  <td>${d.vakat[1]}</td>
                                  <td>${d.vakat[2]}</td>
                                  <td>${d.vakat[3]}</td>
                                  <td>${d.vakat[4]}</td>
                                  <td>${d.vakat[5]}</td>
                              </tr>`
                      )
                      .join("")}
                    </tbody>
                </table>
            </div>
        </div>

        <br />

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

        <br />
        
        <div class="row">
            <div class="col-lg-12">
                <p class="text-center"><span>vaktija.ba 2008 - ${year}</span>
                </p>
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
