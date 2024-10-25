// Codice eseguito al caricamento della pagina
document.addEventListener('DOMContentLoaded', function() {
    const expireDate = new Date(localStorage.getItem('expire')); // Ottiene la data di scadenza del token
    const currentDate = new Date(); // Ottiene la data attuale

    // Controlla che il token esista e sia valido
    if (localStorage.getItem('token') === null || currentDate > expireDate) {
        // Reindirizza alla schermata di login
        window.location.href = '/login/';
    } else {
        getGrades(); // Ottiene i voti
        calculateAverage(); // Calcola la media
        displayGrades(); // Mostra le medie nel sito
    }
});

async function getGrades() {
    const token = localStorage.getItem('token'); // Recupera il token
    const studentId = localStorage.getItem('studentId'); // Recupera lo studentId

    const url = "http://192.168.0.100:2001/grades"; // URL del server proxy
    // const url = "http://localhost:2001/grades"; // Server proxy per il development

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
        period: [{}, {}],
        global: {}
    };

    console.log(data); // Togliere

    let sumTotGrades = 0; // Somma di tutti i voti

    let nGradesPeriod_0 = 0; // Numero voti primo periodo
    let sumGradesPeriod_0 = 0; // Somma voti primo periodo

    let nGradesPeriod_1 = 0; // Numero voti secondo periodo
    let sumGradesPeriod_1 = 0; // Somma voti secondo periodo

    let i = 0;
    while (i < data.grades.length) {
        const subjectId = data.grades[i].subjectId;
        const periodPos = data.grades[i].periodPos;
        
        sumTotGrades += data.grades[i].decimalValue; // Media totale
        
        if (data.grades[i].periodPos === 1) {
            // Media primo periodo
            nGradesPeriod_0++;
            sumGradesPeriod_0 += data.grades[i].decimalValue;
        } else {
            // Media secondo periodo
            nGradesPeriod_1++;
            sumGradesPeriod_1 += data.grades[i].decimalValue;
        }

        if (!(grades.period[0].hasOwnProperty(subjectId) && grades.period[1].hasOwnProperty(subjectId))) {
            // Calcolo media materie
            let nGrades = 0;
            let sumGrades = 0;

            const gradesFilter = data.grades.filter(grade => grade.subjectId === subjectId && grade.periodPos === periodPos);
            gradesFilter.forEach((grade) => {
                nGrades++;
                sumGrades += grade.decimalValue;
            });

            let averageGrade = sumGrades / nGrades;
            let colorGrade = getGradeColor(averageGrade);

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
        }
        i++;
    }
    // Calcolo media totale
    let totAverage = sumTotGrades / data.grades.length;

    let colorGrade = getGradeColor(totAverage);

    grades.global = {
        average: totAverage,
        averageDisplay: String(totAverage),
        color: colorGrade,
    }

    // Calcolo media periodi

    // Primo periodo
    let averagePeriod_0 = sumGradesPeriod_0 / nGradesPeriod_0;

    colorGrade = getGradeColor(averagePeriod_0);

    grades.period[0]["global"] = {
        average: averagePeriod_0,
        averageDisplay: String(averagePeriod_0),
        color: colorGrade,
    }

    // Secondo periodo
    let averagePeriod_1 = sumGradesPeriod_1 / nGradesPeriod_1;

    colorGrade = getGradeColor(averagePeriod_1);

    grades.period[1]["global"] = {
        average: averagePeriod_1,
        averageDisplay: String(averagePeriod_1),
        color: colorGrade,
    }

    localStorage.setItem('grades', JSON.stringify(grades)); // Salva i voti formattati in localStorage
    console.log(grades); // Togliere
}

function getGradeColor(grade) {
    if (grade >= 6) {
        return "green";
    } else if (grade >= 5) {
        return "orange";
    } else {
        return "red";
    }
}

function displayGrades() {
    const grades = JSON.parse(localStorage.getItem('grades'));

    // Crea l'elemento tabella
    const table = document.createElement('table');
    table.border = "1"; // Imposta il bordo della tabella
    table.cellPadding = "5"; // Imposta il padding delle caselle della tabella
    table.cellSpacing = "0"; // Spazio tra le caselle della tabella

    // Crea l'intestazione della tabella
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // Crea le intestazioni delle colonne
    const subjectHeader = document.createElement('th');
    subjectHeader.innerText = 'Materie';
    headerRow.appendChild(subjectHeader);

    const firstPeriodHeader = document.createElement('th');
    firstPeriodHeader.innerText = 'Primo Periodo';
    headerRow.appendChild(firstPeriodHeader);

    const secondPeriodHeader = document.createElement('th');
    secondPeriodHeader.innerText = 'Secondo Periodo';
    headerRow.appendChild(secondPeriodHeader);

    const averageHeader = document.createElement('th');
    averageHeader.innerText = 'Media Generale';
    headerRow.appendChild(averageHeader);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Crea il corpo della tabella
    const tbody = document.createElement('tbody');

    // Aggiungi la riga per la media generale
    const generalRow = document.createElement('tr');
    
    const generalSubjectCell = document.createElement('td');
    generalSubjectCell.innerText = 'Generale'; // Nome materia
    generalRow.appendChild(generalSubjectCell);

    const firstPeriodGeneralCell = document.createElement('td');
    firstPeriodGeneralCell.innerText = grades.period[0].global.averageDisplay; // Media primo periodo
    generalRow.appendChild(firstPeriodGeneralCell);

    const secondPeriodGeneralCell = document.createElement('td');
    secondPeriodGeneralCell.innerText = grades.period[1].global.averageDisplay; // Media secondo periodo
    generalRow.appendChild(secondPeriodGeneralCell);

    const averageGeneralCell = document.createElement('td');
    averageGeneralCell.innerText = grades.global.averageDisplay; // Media generale
    generalRow.appendChild(averageGeneralCell);

    // Aggiungi la riga della media generale all'inizio del tbody
    tbody.appendChild(generalRow);

    // Aggiungi una riga vuota per distacco
    tbody.appendChild(document.createElement('tr'));

    // Estrai le materie e le loro medie dai voti
    const subjects = grades.period[0]; // Primo periodo
    const secondPeriodSubjects = grades.period[1]; // Secondo periodo

    // Elenco delle materie con le loro medie
    Object.keys(subjects).forEach(subjectId => {
        if (subjectId !== 'global') { // Escludi la voce globale
            const subjectData = subjects[subjectId];
            const secondPeriodData = secondPeriodSubjects[subjectId] || {}; // Se non esiste, è un oggetto vuoto

            const row = document.createElement('tr');

            // Aggiungi il nome della materia
            const subjectCell = document.createElement('td');
            subjectCell.innerText = subjectData.subjectDesc;
            row.appendChild(subjectCell);

            // Aggiungi la media del primo periodo
            const firstPeriodCell = document.createElement('td');
            firstPeriodCell.innerText = subjectData.averageDisplay;
            row.appendChild(firstPeriodCell);

            // Aggiungi la media del secondo periodo
            const secondPeriodCell = document.createElement('td');
            secondPeriodCell.innerText = secondPeriodData.averageDisplay || 'N/A'; // Mostra 'N/A' se non esiste
            row.appendChild(secondPeriodCell);

            // Aggiungi la media generale (N/A per le singole materie)
            const averageCell = document.createElement('td');
            averageCell.innerText = 'N/A'; // Non mostrare valori delle singole materie
            row.appendChild(averageCell);

            tbody.appendChild(row);
        }
    });

    // Aggiungi il corpo alla tabella
    table.appendChild(tbody);

    // Aggiungi la tabella al body del documento
    document.body.appendChild(table);
}