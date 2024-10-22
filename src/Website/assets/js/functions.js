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

        console.log(login); // Togliere
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

        const data = await response.json();
        localStorage.setItem('data', JSON.stringify(data)); // Salva i voti in localStorage

        console.log(JSON.parse(localStorage.getItem('data'))); // Togliere
    } catch (error) {
        console.error("Errore:", error);
        alert("Si è verificato un errore durante la richiesta.");
    }
}

function calculateAverage() {
    const data = JSON.parse(localStorage.getItem('data'));
    let grades = {
        period: [{}, {}]
    };

    console.log(data); // Togliere

    let i = 0;
    while (i < data.grades.length) {
        const subjectId = data.grades[i].subjectId;

        if (grades.period[0].hasOwnProperty(subjectId) && grades.period[1].hasOwnProperty(subjectId)) {
            i++;
            continue;
        } else {
            let nGrades = 0;
            let sumGrades = 0;

            const gradesFilter = data.grades.filter(grade => grade.subjectId === subjectId);
            gradesFilter.forEach((grade) => {
                nGrades++;
                sumGrades += grade.decimalValue;
            });

            const averageGrade = sumGrades / nGrades;
            let colorGrade;
            
            if (averageGrade >= 6) {
                colorGrade = "green";
            } else if (averageGrade >= 5) {
                colorGrade = "orange";
            } else {
                colorGrade = "red";
            }

            if (data.grades[i].periodPos === 1) {
                grades.period[0][subjectId] = {
                    subjectDesc: data.grades[i].subjectDesc,
                    average: averageGrade,
                    averageDisplay: String(averageGrade),
                    color: colorGrade,
                };
            } else {
                grades.period[1][subjectId] = {
                    subjectDesc: data.grades[i].subjectDesc,
                    average: averageGrade,
                    averageDisplay: String(averageGrade),
                    color: colorGrade,
                };
            }
            i++;
        }
    }
    localStorage.setItem('grades', JSON.stringify(grades)); // Salva i voti formattati in localStorage
    console.log(grades); // Togliere
}