// Codice eseguito al caricamento della pagina
document.addEventListener('DOMContentLoaded', function() {
    const expireDate = new Date(localStorage.getItem('expire')); // Ottiene la data di scadenza del token
    const currentDate = new Date(); // Ottiene la data attuale

    // Controlla che il token esista e sia valido
    if (localStorage.getItem('token') !== null && currentDate < expireDate) {
        // Reindirizza alla schermata delle medie
        window.location.href = '/';
    }
});

async function login() {
    // Ottieni le credenziali
    const user = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const url = "http://truenas3.ddns.net:2001/login"; // URL del server proxy
    // const url = "http://localhost:2001/login"; // Server proxy per il development

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
        localStorage.setItem('expire', login.expire); // Salva la data di scadenza del token

        location.reload(); // Ricarica la pagina

        console.log(login); // Togliere
    } catch (error) {
        console.error("Errore:", error);
        alert("Si è verificato un errore durante l'autenticazione.");
    }
}