"use strict";
const path = require('path');
const express = require('express');
const app = express();
let publicDir = path.join(__dirname, '../public');
let staticDir = path.join(__dirname, '../public/static');
let indexPath = path.join(publicDir, 'index.html');
console.log('public dir:', publicDir);
console.log('static dir:', staticDir);
console.log('index path:', indexPath);
app.use('/static', express.static(staticDir));
// serve the index path for any URL
app.get('*', (request, response) => {
    response.sendFile(indexPath);
});
let PORT = 8080; // process.env.PORT
const listener = app.listen(PORT, function () {
    console.log(`Your app is listening on port ${listener.address().port}`);
});
