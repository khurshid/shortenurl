const express = require("express");
const bodyparser = require('body-parser') 
const cors = require('cors');
const app = express();
var router = require("./router");
var con = require("./constants");
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use(cors());
app.listen(con.port);
console.log("Started listening at:"+con.root_url);
router.route(app); 
