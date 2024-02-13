// Funzione per caricare i dati dal file JSON
function loadQaData(callback) {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open('GET', 'qa_data.json', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.send(null);
}

// Funzione per visualizzare le domande e le risposte nel sito
function displayQa() {
    loadQaData(function (data) {
        var container = document.querySelector('.questions-container');
        container.innerHTML = ''; // Pulisce il contenitore prima di aggiungere le nuove domande
        data.questions.forEach(function (question) {
            var questionDiv = document.createElement('div');
            questionDiv.classList.add('question');
            var questionTitle = document.createElement('h2');
            questionTitle.classList.add('question-title');
            questionTitle.innerHTML = question.text + '<i class="fas fa-chevron-down"></i>';
            questionTitle.addEventListener('click', function () {
                questionDiv.classList.toggle('open');
            });
            questionDiv.appendChild(questionTitle);
            var answersDiv = document.createElement('div');
            answersDiv.classList.add('answers');
            question.answers.forEach(function (answer) {
                var answerP = document.createElement('p');
                answerP.textContent = answer.text;
                answersDiv.appendChild(answerP);
            });
            questionDiv.appendChild(answersDiv);
            container.appendChild(questionDiv);
        });
    });
}

// Funzione per aggiungere una nuova domanda
function addNewQuestion() {
    var newQuestionText = document.getElementById("newQuestion").value;
    if (newQuestionText.trim() !== "") {
        var newQuestion = {
            "id": new Date().getTime(), // Genera un ID univoco per la nuova domanda
            "text": newQuestionText,
            "answers": [] // Nuova domanda senza risposte inizialmente
        };
        saveNewQuestion(newQuestion);
    } else {
        alert("Inserisci una domanda prima di inviare.");
    }
}

// Funzione per salvare una nuova domanda nel file JSON
function saveNewQuestion(newQuestion) {
    loadQaData(function (data) {
        data.questions.push(newQuestion);
        var xhr = new XMLHttpRequest();
        xhr.overrideMimeType("application/json");
        xhr.open('POST', 'save_qa_data.php', true); // Aggiorna il percorso del file PHP per salvare i dati
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                displayQa(); // Ricarica le domande dopo aver salvato la nuova domanda
            }
        };
        xhr.send(JSON.stringify(data));
    });
}

function searchQuestions() {
    var input, filter, container, questions, question, i, txtValue;
    input = document.getElementById('searchBar');
    filter = input.value.toUpperCase();
    container = document.querySelector('.questions-container');
    questions = container.getElementsByClassName('question');
  
    for (i = 0; i < questions.length; i++) {
        question = questions[i].querySelector('.question-title');
        txtValue = question.textContent || question.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            questions[i].style.display = "";
        } else {
            questions[i].style.display = "none";
        }
    }
}

// Chiamiamo la funzione per visualizzare le domande e le risposte nel sito
displayQa();
