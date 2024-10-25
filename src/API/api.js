const express = require('express');
const axios = require('axios');
const cors = require('cors');

const port = 2001;
const app = express();

app.use(cors());

// Middleware per il parsing di JSON e URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Returns the response containing token and more
app.post('/login', async (req, res) => {
    const { uid, pwd } = req.body;
    
    const url = 'https://web.spaggiari.eu/rest/v1/auth/login';

    const headers = {
        'Content-Type': 'application/json',
        'Z-Dev-ApiKey': 'Tg1NWEwNGIgIC0K',
        'User-Agent': 'CVVS/std/4.2.3 Android/12'
    };

    const data = {
        ident: null,
        pass: pwd,
        uid: uid
    };

    try {
        const response = await axios.post(url, data, { headers });
        res.json(response.data);
    } catch (error) {
        console.error("Errore durante la richiesta:", error.response ? error.response.data : error.message);
    }
});

// Returns all the user's grades
app.post('/grades', async (req, res) => {
    const { token, studentId } = req.body;

    const url = "https://web.spaggiari.eu/rest/v1/students/" + studentId + "/grades";

    const headers = {
        'Content-Type': 'application/json',
        'Z-Dev-ApiKey': 'Tg1NWEwNGIgIC0K',
        'User-Agent': 'CVVS/std/4.2.3 Android/12',
        'Z-Auth-Token': token
    };

    try {
        const response = await axios.get(url, { headers });
        res.json(response.data);
    } catch (error) {
        console.error("Errore durante la richiesta:", error.response ? error.response.data : error.message);
    }
});

app.listen(port, () => console.log(`Api Endpoint listening on port ${port}!`));