import { createQuestion, deleteQuestion, fetchQuestions, fetchResults, updateQuestion } from "./api"
import { button, div, h3, input, label, option, select } from "./elements"

export async function createEmptyQuestion() {
  await createQuestion()
  const questionsManagerElement = document.getElementById("questionsManager")
  loadQuestionsManager(questionsManagerElement)
}

export async function loadQuestionsManager(managerElement) {
  managerElement.innerHTML = ""
  const questions = await fetchQuestions()
  const results = await fetchResults()

  questions.forEach((question) => createQuestionForm(question, results))
}

function createQuestionForm(question, results) {
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

    await updateQuestion(question.id, text, points)
    alert("Pergunta atualizada com sucesso!")
  })

  const questionFormTitle = h3(`Pergunta ${question.id}`)
  const questionTextLabel = label("Texto da Pergunta:", `question-${question.id}-text`)
  const questionTextInput = input("text", {
    id: `question-${question.id}-text`,
    name: "text",
    value: question.text
  })

  const fullyDisagreeDiv = createFullyDisagreeField(question, results)
  const partiallyDisagreeDiv = createPartiallyDisagreeField(question, results)
  const fullyAgreeDiv = createFullyAgreeField(question, results)
  const partiallyAgreeDiv = createPartiallyAgreeField(question, results)
  const dontKnowDiv = createDontKnowField(question, results)

  const buttonGroup = div({ className: "button-group" })

  const submitBtn = button("Salvar", { type: "submit" })

  const deleteBtn = button("Excluir Pergunta", {
    onClick: async () => {
      await deleteQuestion(question.id)
      questionForm.remove()
    }
  })

  buttonGroup.append(submitBtn, deleteBtn)

  questionForm.append(
    questionFormTitle,
    questionTextLabel,
    questionTextInput,
    fullyDisagreeDiv,
    partiallyDisagreeDiv,
    dontKnowDiv,
    partiallyAgreeDiv,
    fullyAgreeDiv,
    buttonGroup
  )
  managerElement.append(questionForm)
}

function createFullyDisagreeField(question, results) {
  const fullyDisagreeDiv = div({ className: "inline-block" })

  const fullyDisagreeLabel = label("Discordo Completamente", `question-${question.id}-fully-disagree`)
  const fullyDisagreeSelect = select(`question-${question.id}-fully-disagree`, "fullyDisagree")

  const defaultOption = option()
  fullyDisagreeSelect.options.add(defaultOption)

  results.forEach((result) => {
    const resultOption = option(result.name, {
      value: result.id,
      selected: question.points.fullyDisagree === result.id
    })
    fullyDisagreeSelect.options.add(resultOption)
  })

  fullyDisagreeDiv.append(fullyDisagreeLabel, fullyDisagreeSelect)

  return fullyDisagreeDiv
}

function createPartiallyDisagreeField(question, results) {
  const partiallyDisagreeDiv = div({ className: "inline-block" })

  const partiallyDisagreeLabel = label("Discordo Parcialmente", `question-${question.id}-partially-disagree`)
  const partiallyDisagreeSelect = select(`question-${question.id}-partially-disagree`, "partiallyDisagree")

  const defaultOption = option("Selecione...", { selected: true, disabled: true })
  partiallyDisagreeSelect.options.add(defaultOption)

  results.forEach((result) => {
    const resultOption = option(result.name, {
      value: result.id,
      selected: question.points.partiallyDisagree === result.id
    })
    partiallyDisagreeSelect.options.add(resultOption)
  })

  partiallyDisagreeDiv.append(partiallyDisagreeLabel, partiallyDisagreeSelect)

  return partiallyDisagreeDiv
}

function createPartiallyAgreeField(question, results) {
  const partiallyAgreeDiv = div({ className: "inline-block" })

  const partiallyAgreeLabel = label("Concordo Parcialmente", `question-${question.id}-partially-agree`)
  const partiallyAgreeSelect = select(`question-${question.id}-partially-agree`, "partiallyAgree")

  const defaultOption = option("Selecione...", { selected: true, disabled: true })
  partiallyAgreeSelect.options.add(defaultOption)

  results.forEach((result) => {
    const resultOption = option(result.name, {
      value: result.id,
      selected: question.points.partiallyAgree === result.id
    })
    partiallyAgreeSelect.options.add(resultOption)
  })

  partiallyAgreeDiv.append(partiallyAgreeLabel, partiallyAgreeSelect)

  return partiallyAgreeDiv
}

function createFullyAgreeField(question, results) {
  const fullyAgreeDiv = div({ className: "inline-block" })

  const fullyAgreeLabel = label("Concordo Completamente", `question-${question.id}-fully-agree`)
  const fullyAgreeSelect = select(`question-${question.id}-fully-agree`, "fullyAgree")

  const defaultOption = option("Selecione...", { selected: true, disabled: true })
  fullyAgreeSelect.options.add(defaultOption)

  results.forEach((result) => {
    const resultOption = option(result.name, {
      value: result.id,
      selected: question.points.fullyAgree === result.id
    })
    fullyAgreeSelect.options.add(resultOption)
  })


  fullyAgreeDiv.append(fullyAgreeLabel, fullyAgreeSelect)

  return fullyAgreeDiv
}

function createDontKnowField(question, results) {
  const dontKnowDiv = div({ className: "inline-block" })

  const dontKnowLabel = label("Não Sei", `question-${question.id}-dont-know`)
  const dontKnowSelect = select(`question-${question.id}-dont-know`, "dontKnow")

  const defaultOption = option("Selecione...", { selected: true, disabled: true })
  dontKnowSelect.options.add(defaultOption)

  results.forEach((result) => {
    const resultOption = option(result.name, {
      value: result.id,
      selected: question.points.dontKnow === result.id
    })
    dontKnowSelect.options.add(resultOption)
  })

  dontKnowDiv.append(dontKnowLabel, dontKnowSelect)

  return dontKnowDiv
}