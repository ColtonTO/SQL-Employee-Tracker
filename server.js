const db = require('./db/db_init.sql')
const express = require('express')
const prompts = require('./lib/prompts')
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use((req,res) => {
    res.status(404).end();
})