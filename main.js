import { createEmptyQuestion, loadQuestionsManager } from './src/questions'
import { addSubmitNewResultListener, loadResults } from './src/results'
import './style.css'

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app")
  const newResultForm = document.getElementById("newResultForm")
  const resultsList = document.getElementById("resultsList")
  const questionsManager = document.getElementById("questionsManager")
  const newQuestionBtn = document.getElementById("newQuestion")

  if (app) loadQuestions()
  if (resultsList) loadResults(resultsList)
  if (newResultForm) addSubmitNewResultListener(newResultForm)
  if (questionsManager) loadQuestionsManager(questionsManager)
  if (newQuestionBtn) newQuestionBtn.addEventListener("click", createEmptyQuestion)
})
