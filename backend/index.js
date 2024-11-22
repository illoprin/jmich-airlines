const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const cors = require('cors');
const file_upload = require('express-fileupload');

// Create express app
const app = express();
// Use JSON parser
app.use(express.json());
// Use CORS protocol
app.use(cors());
// Add possibility to upload files
app.use(file_upload());

// Get dotenv config
dotenv.config();
// Connect to db MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to db MySQL
db.connect(err => {
    if (err) {
        console.error(err);
        return;  
    }else {
        console.log('Connection to MySQL database established');
    }
});

const user = require('./router/user.js')(db);
const purchase = require('./router/purchase.js')(db);
const {flight, update_flights} = require('./router/flight.js')(db);
const city = require('./router/city.js')(db);
const promo = require('./router/promo.js')(db);
const company = require('./router/company.js')(db);

app.use('/user', user);
app.use('/purchase', purchase);
app.use('/flight', flight);
app.use('/city', city);
app.use('/promo', promo);
app.use('/company', company);

update_flights(db);

// Add possability to send images
app.use('/upload', express.static('./upload'));

const port = process.env.PORT || 3001; 
app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});