async function login() {
    // Ottieni le credenziali
    const user = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const url = "http://localhost:2000/login"; // URL del server proxy

    // Dati che verranno inviati al server proxy
    const loginData = {
        uid: user,
        pwd: password
    };

    try {
        // Fai la richiesta POST al server proxy
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        // Controlla se la richiesta ha avuto successo
        if (!response.ok) {
            throw new Error('Errore durante l\'autenticazione.');
        }

        // Ottieni la risposta
        const login = await response.json();
        const studentId = login.ident.replace("S", "");

        localStorage.setItem('token', login.token); // Salva il token in localStorage
        localStorage.setItem('studentId', studentId); // Salva lo studentId in localStorage

        console.log(login);

        alert("Sessione avviata con successo!");
    } catch (error) {
        console.error("Errore:", error);
        alert("Si è verificato un errore durante l'autenticazione.");
    }
}

async function getGrades() {
    const token = localStorage.getItem('token'); // Recupera il token
    const studentId = localStorage.getItem('studentId'); // Recupera lo studentId

    const url = "http://localhost:2000/grades"; // URL del server proxy

    const body = {
        token: token,
        studentId: studentId
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error("Errore durante la richiesta: " + response.statusText);
        }

        const res = await response.json();

        // Fare una formattazione dei dati

        console.log(res);
    } catch (error) {
        console.error("Errore:", error);
        alert("Si è verificato un errore durante la richiesta.");
    }
}