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