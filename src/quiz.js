export async function loadQuestions() {
  const appElement = document.getElementById("app")
  const questions = await fetch("http://localhost:3000/questions").then((res) => res.json())
  const answers = questions.map((question) => ({ questionId: question.id, answer: null }))

  questions.forEach((question, index) => {
    const questionContainer = document.createElement("div")
    questionContainer.classList = "question"

    const textEl = document.createElement("h2")
    textEl.textContent = question.text

    const alternatives = document.createElement("div")
    const alternativeBtns = createAlternativeBtns(question, answers)
    alternatives.append(...alternativeBtns)

    if (index > 0) {
      const goBackBtn = document.createElement("button")
      goBackBtn.textContent = "Voltar à Pergunta Anterior"
      goBackBtn.addEventListener("click", () => {
        window.scrollBy({ top: -document.querySelector(".question").scrollHeight, behavior: "smooth" })
      })
      questionContainer.appendChild(goBackBtn)
    }

    questionContainer.append(textEl, alternatives)
    appElement.append(questionContainer)
  })

  const finishBtnContainer = document.createElement("div")
  finishBtnContainer.className = "finish-btn-container"

  const finishBtn = document.createElement("button")
  finishBtn.textContent = "Ver meu resultado!"
  finishBtn.className = "finish-btn"
  finishBtn.addEventListener("click", async () => {
    const result = await calculateResults(questions, answers)
    appElement.innerHTML = `<div class="result"><h2>Seu resultado foi: ${result.name}!</h2><p>${result.description}</p></div>`
  })

  finishBtnContainer.append(finishBtn)
  appElement.append(finishBtnContainer)
}

async function calculateResults(questions, answers) {
  const results = []

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i]
    const answer = answers[i]

    results.push(question.points[answer.answer])
  }

  const resultsCount = {}
  results.forEach((result) => resultsCount[result] = (resultsCount[result] || 0) + 1)

  let winnerResult
  let highestCount = 0;

  for (const numero in resultsCount) {
    if (resultsCount[numero] > highestCount) {
      winnerResult = numero;
      highestCount = resultsCount[numero];
    }
  }

  const result = await fetch(`http://localhost:3000/results/${winnerResult}`).then((res) => res.json())
  return result
}

function createAlternativeBtns(question, answers) {
  const fullyDisagreeBtn = document.createElement("button")
  fullyDisagreeBtn.textContent = "Discordo Completamente"
  fullyDisagreeBtn.classList.add("inline-block")
  fullyDisagreeBtn.addEventListener("click", handleSelectAlternative)
  fullyDisagreeBtn.addEventListener("click", () => {
    const currentAnswer = answers.find((answer) => answer.questionId === question.id)
    currentAnswer.answer = "fullyDisagree"
  })

  const partiallyDisagreeBtn = document.createElement("button")
  partiallyDisagreeBtn.textContent = "Discordo Parcialmente"
  partiallyDisagreeBtn.classList.add("inline-block")
  partiallyDisagreeBtn.addEventListener("click", handleSelectAlternative)
  partiallyDisagreeBtn.addEventListener("click", () => {
    const currentAnswer = answers.find((answer) => answer.questionId === question.id)
    currentAnswer.answer = "partiallyDisagree"
  })

  const dontKnowBtn = document.createElement("button")
  dontKnowBtn.textContent = "Não sei"
  dontKnowBtn.classList.add("inline-block")
  dontKnowBtn.addEventListener("click", handleSelectAlternative)
  dontKnowBtn.addEventListener("click", () => {
    const currentAnswer = answers.find((answer) => answer.questionId === question.id)
    currentAnswer.answer = "dontKnow"
  })

  const partiallyAgreeBtn = document.createElement("button")
  partiallyAgreeBtn.textContent = "Concordo Parcialmente"
  partiallyAgreeBtn.classList.add("inline-block")
  partiallyAgreeBtn.addEventListener("click", handleSelectAlternative)
  partiallyAgreeBtn.addEventListener("click", () => {
    const currentAnswer = answers.find((answer) => answer.questionId === question.id)
    currentAnswer.answer = "partiallyAgree"
  })

  const fullyAgreeBtn = document.createElement("button")
  fullyAgreeBtn.textContent = "Concordo Completamente"
  fullyAgreeBtn.classList.add("inline-block")
  fullyAgreeBtn.addEventListener("click", handleSelectAlternative)
  fullyAgreeBtn.addEventListener("click", () => {
    const currentAnswer = answers.find((answer) => answer.questionId === question.id)
    currentAnswer.answer = "fullyAgree"
  })

  return [fullyDisagreeBtn, partiallyDisagreeBtn, dontKnowBtn, partiallyAgreeBtn, fullyAgreeBtn]
}

function handleSelectAlternative(ev) {
  ev.target.parentElement.childNodes.forEach((node) => {
    node.classList.remove("selected")
  })
  ev.target.classList.add("selected")

  setTimeout(() => {
    window.scrollBy({ top: document.querySelector(".question").scrollHeight, behavior: "smooth" })
  }, 250)
}
