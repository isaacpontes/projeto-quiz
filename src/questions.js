export async function createEmptyQuestion() {
  await fetch("http://localhost:3000/questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: "",
      points: { "fullyDisagree": null, "partiallyDisagree": null, "fullyAgree": null, "partiallyAgree": null, "dontKnow": null }
    })
  })
  loadQuestionsManager(document.getElementById("questionsManager"))
}

export async function loadQuestionsManager(managerElement) {
  managerElement.innerHTML = ""
  const questions = await fetch("http://localhost:3000/questions").then((res) => res.json())
  const results = await fetch("http://localhost:3000/results").then((res) => res.json())

  questions.forEach((question) => {
    const questionForm = document.createElement("form")
    questionForm.classList.add("questionForm")

    questionForm.addEventListener("submit", async (ev) => {
      ev.preventDefault()

      const formData = new FormData(ev.target)
      const text = formData.get("text")
      const points = {}
      points.fullyDisagree = +formData.get("fullyDisagree")
      points.partiallyDisagree = +formData.get("partiallyDisagree")
      points.dontKnow = +formData.get("dontKnow")
      points.partiallyAgree = +formData.get("partiallyAgree")
      points.fullyAgree = +formData.get("fullyAgree")

      await fetch(`http://localhost:3000/questions/${question.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, points })
      })
      alert("Pergunta atualizada com sucesso!")
    })

    const questionFormTitle = createQuestionTitleElement(question)
    const questionTextLabel = createQuestionTextLabel(question)
    const questionTextInput = createQuestionTextInput(question)
    const fullyDisagreeDiv = createFullyDisagreeSelect(question, results)
    const partiallyDisagreeDiv = createPartiallyDisagreeSelect(question, results)
    const fullyAgreeDiv = createFullyAgreeSelect(question, results)
    const partiallyAgreeDiv = createPartiallyAgreeSelect(question, results)
    const dontKnowDiv = createDontKnowSelect(question, results)

    const buttonGroup = document.createElement("div")
    buttonGroup.classList.add("button-group")

    const submitBtn = document.createElement("button")
    submitBtn.type = "submit"
    submitBtn.textContent = "Salvar"

    const deleteBtn = document.createElement("button")
    deleteBtn.type = "button"
    deleteBtn.textContent = "Excluir Pergunta"
    deleteBtn.addEventListener("click", async () => {
      await fetch(`http://localhost:3000/questions/${question.id}`, { method: "DELETE" })
      questionForm.remove()
    })

    buttonGroup.append(submitBtn, deleteBtn)

    questionForm.append(questionFormTitle, questionTextLabel, questionTextInput, fullyDisagreeDiv, partiallyDisagreeDiv, dontKnowDiv, partiallyAgreeDiv, fullyAgreeDiv, buttonGroup)
    managerElement.append(questionForm)
  })
}

function createQuestionTitleElement(question) {
  const questionFormTitle = document.createElement("h3")
  questionFormTitle.textContent = `Pergunta ${question.id}`
  return questionFormTitle
}

function createQuestionTextLabel(question) {
  const questionTextLabel = document.createElement("label")
  questionTextLabel.htmlFor = `question-${question.id}-text`
  questionTextLabel.textContent = "Texto da Pergunta:"
  return questionTextLabel
}

function createQuestionTextInput(question) {
  const questionTextInput = document.createElement("input")
  questionTextInput.id = `question-${question.id}-text`
  questionTextInput.name = "text"
  questionTextInput.type = "text"
  questionTextInput.value = question.text
  return questionTextInput
}

function createFullyDisagreeSelect(question, results) {
  const fullyDisagreeDiv = document.createElement("div")
  fullyDisagreeDiv.classList.add("inline-block")

  const fullyDisagreeLabel = document.createElement("label")
  fullyDisagreeLabel.textContent = "Discordo Completamente"
  fullyDisagreeLabel.htmlFor = `question-${question.id}-fully-disagree`

  const fullyDisagreeSelect = document.createElement("select")
  fullyDisagreeSelect.id = `question-${question.id}-fully-disagree`
  fullyDisagreeSelect.name = "fullyDisagree"

  const defaultOption = createDefaultOption()
  fullyDisagreeSelect.options.add(defaultOption)

  results.forEach((result) => {
    const resultOption = document.createElement("option")
    resultOption.textContent = result.name
    resultOption.value = result.id
    resultOption.selected = question.points.fullyDisagree === result.id
    fullyDisagreeSelect.options.add(resultOption)
  })

  fullyDisagreeDiv.append(fullyDisagreeLabel, fullyDisagreeSelect)

  return fullyDisagreeDiv
}

function createPartiallyDisagreeSelect(question, results) {
  const partiallyDisagreeDiv = document.createElement("div")
  partiallyDisagreeDiv.classList.add("inline-block")

  const partiallyDisagreeLabel = document.createElement("label")
  partiallyDisagreeLabel.textContent = "Discordo Parcialmente"
  partiallyDisagreeLabel.htmlFor = `question-${question.id}-partially-disagree`

  const partiallyDisagreeSelect = document.createElement("select")
  partiallyDisagreeSelect.id = `question-${question.id}-partially-disagree`
  partiallyDisagreeSelect.name = "partiallyDisagree"

  const defaultOption = createDefaultOption()
  partiallyDisagreeSelect.options.add(defaultOption)

  results.forEach((result) => {
    const resultOption = document.createElement("option")
    resultOption.textContent = result.name
    resultOption.value = result.id
    resultOption.selected = question.points.partiallyDisagree === result.id
    partiallyDisagreeSelect.options.add(resultOption)
  })

  partiallyDisagreeDiv.append(partiallyDisagreeLabel, partiallyDisagreeSelect)

  return partiallyDisagreeDiv
}

function createPartiallyAgreeSelect(question, results) {
  const partiallyAgreeDiv = document.createElement("div")
  partiallyAgreeDiv.classList.add("inline-block")

  const partiallyAgreeLabel = document.createElement("label")
  partiallyAgreeLabel.textContent = "Concordo Parcialmente"
  partiallyAgreeLabel.htmlFor = `question-${question.id}-partially-agree`

  const partiallyAgreeSelect = document.createElement("select")
  partiallyAgreeSelect.id = `question-${question.id}-partially-agree`
  partiallyAgreeSelect.name = "partiallyAgree"

  const defaultOption = createDefaultOption()
  partiallyAgreeSelect.options.add(defaultOption)

  results.forEach((result) => {
    const resultOption = document.createElement("option")
    resultOption.textContent = result.name
    resultOption.value = result.id
    resultOption.selected = question.points.partiallyAgree === result.id
    partiallyAgreeSelect.options.add(resultOption)
  })

  partiallyAgreeDiv.append(partiallyAgreeLabel, partiallyAgreeSelect)

  return partiallyAgreeDiv
}

function createFullyAgreeSelect(question, results) {
  const fullyAgreeDiv = document.createElement("div")
  fullyAgreeDiv.classList.add("inline-block")

  const fullyAgreeLabel = document.createElement("label")
  fullyAgreeLabel.textContent = "Concordo Completamente"
  fullyAgreeLabel.htmlFor = `question-${question.id}-fully-agree`

  const fullyAgreeSelect = document.createElement("select")
  fullyAgreeSelect.id = `question-${question.id}-fully-agree`
  fullyAgreeSelect.name = "fullyAgree"

  const defaultOption = createDefaultOption()
  fullyAgreeSelect.options.add(defaultOption)

  results.forEach((result) => {
    const resultOption = document.createElement("option")
    resultOption.textContent = result.name
    resultOption.value = result.id
    resultOption.selected = question.points.fullyAgree === result.id
    fullyAgreeSelect.options.add(resultOption)
  })

  fullyAgreeDiv.append(fullyAgreeLabel, fullyAgreeSelect)

  return fullyAgreeDiv
}

function createDontKnowSelect(question, results) {
  const dontKnowDiv = document.createElement("div")
  dontKnowDiv.classList.add("inline-block")

  const dontKnowLabel = document.createElement("label")
  dontKnowLabel.textContent = "Não Sei"
  dontKnowLabel.htmlFor = `question-${question.id}-dont-know`

  const dontKnowSelect = document.createElement("select")
  dontKnowSelect.id = `question-${question.id}-dont-know`
  dontKnowSelect.name = "dontKnow"

  const defaultOption = createDefaultOption()
  dontKnowSelect.options.add(defaultOption)

  results.forEach((result) => {
    const resultOption = document.createElement("option")
    resultOption.textContent = result.name
    resultOption.value = result.id
    resultOption.selected = question.points.dontKnow === result.id
    dontKnowSelect.options.add(resultOption)
  })

  dontKnowDiv.append(dontKnowLabel, dontKnowSelect)

  return dontKnowDiv
}

function createDefaultOption() {
  const defaultOption = document.createElement("option")
  defaultOption.textContent = "Selecione..."
  defaultOption.selected = true
  defaultOption.disabled = true
  return defaultOption
}