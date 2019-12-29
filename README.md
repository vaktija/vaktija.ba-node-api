npm install

node(mon) --experimental-modules --experimental-json-modules index.mjs

pm2 start ecosystem.config.js

Dont'forget this (DST issues)

heroku config:add TZ="Europe/Sarajevo"
