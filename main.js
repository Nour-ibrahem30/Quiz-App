// Select Elements
let countSpan = document.querySelector(".count span");
let bulletSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-app .quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let resultsContainer = document.querySelector(".result");
let countDownElement = document.querySelector(".countdown");

let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;

function getQuestions() {
  fetch("./html_questions.json")
    .then((response) => response.json())
    .then((questions) => {
      let questionCount = questions.length;

      createBullets(questionCount);
      displayQuestion(questions[currentIndex], questionCount);
      startCountdown(60, questionCount);

      submitButton.onclick = () => {
        let correctAnswer = questions[currentIndex].right_answer;
        checkAnswer(correctAnswer);

        currentIndex++;
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";

        if (currentIndex < questionCount) {
          displayQuestion(questions[currentIndex], questionCount);
          handleBullets();
          clearInterval(countDownInterval);
          startCountdown(60, questionCount);
        } else {
          showResults(questionCount);
        }
      };
    });
}

getQuestions();

function createBullets(count) {
  countSpan.innerHTML = count;
  bulletSpanContainer.innerHTML = ""; // Ensure no duplicate bullets

  for (let i = 0; i < count; i++) {
    let bullet = document.createElement("span");
    if (i === 0) bullet.className = "active";
    bulletSpanContainer.appendChild(bullet);
  }
}

function displayQuestion(question, total) {
  if (currentIndex < total) {
    let title = document.createElement("h2");
    title.textContent = question.title;
    quizArea.appendChild(title);

    for (let i = 1; i <= 4; i++) {
      let answerDiv = document.createElement("div");
      answerDiv.className = "answer";

      let radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "question";
      radio.id = `answer_${i}`;
      radio.dataset.answer = question[`answer_${i}`];
      if (i === 1) radio.checked = true;

      let label = document.createElement("label");
      label.htmlFor = `answer_${i}`;
      label.textContent = question[`answer_${i}`];

      answerDiv.appendChild(radio);
      answerDiv.appendChild(label);
      answersArea.appendChild(answerDiv);
    }
  }
}

function checkAnswer(correctAnswer) {
  let selected = document.querySelector('input[name="question"]:checked');
  if (selected && selected.dataset.answer === correctAnswer) {
    rightAnswers++;
  }
}

function handleBullets() {
  let spans = document.querySelectorAll(".bullets .spans span");
  spans.forEach((span, index) => {
    span.className = index === currentIndex ? "active" : "";
  });
}

function showResults(total) {
  quizArea.remove();
  answersArea.remove();
  submitButton.remove();
  bullets.remove();

  let resultMessage = "";
  if (rightAnswers === total) {
    resultMessage = `<span class="perfect">Perfect</span> All answers are correct`;
  } else if (rightAnswers > total / 2) {
    resultMessage = `<span class="good">Good</span> ${rightAnswers} out of ${total}`;
  } else {
    resultMessage = `<span class="bad">Bad</span> ${rightAnswers} out of ${total}`;
  }

  resultsContainer.innerHTML = resultMessage;
  resultsContainer.style.padding = "10px";
  resultsContainer.style.backgroundColor = "white";
  resultsContainer.style.marginTop = "10px";
}

function startCountdown(duration, total) {
  if (currentIndex < total) {
    let minutes, seconds;
    countDownInterval = setInterval(() => {
      minutes = Math.floor(duration / 60);
      seconds = duration % 60;
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      countDownElement.textContent = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
