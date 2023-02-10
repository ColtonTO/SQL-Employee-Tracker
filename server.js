// Required modules 
const db = require('./db/dbconnection.js')
const express = require('express')
const init = require('./lib/prompts')
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use((req,res) => {
    res.status(404).end();
})
// Main function to connect to the DB
db.connect(err => {
    if (err) throw err;
    console.log('Database connected')
    app.listen(PORT, () => {
        console.log(`App listening at http://localhost:${PORT} 🚀
 |--------------------------------------------------------------------------------------------------------------------|    
 |     _______                   __                               _______                                             |
 |    |    ___|.--------..-----.|  |.-----..--.--..-----..-----. |   |   |.---.-..-----..---.-..-----..-----..----.   |
 |    |    ___||        ||  _  ||  ||  _  ||  |  ||  -__||  -__| |       ||  _  ||     ||  _  ||  _  ||  -__||   _|   |
 |    |_______||__|__|__||   __||__||_____||___  ||_____||_____| |__|_|__||___._||__|__||___._||___  ||_____||__|     |
 |                       |__|              |_____|                                             |_____|                |
 |                                                                                                                    |
 
 |--------------------------------------------------------------------------------------------------------------------| `
    
    );
        init();
    })
})