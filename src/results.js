import { createResult, deleteResult, fetchResults } from "./api"
import { button, listItem } from "./elements"
import { loadQuestionsManager } from "./questions"

export async function loadResults(ul) {
  ul.innerHTML = ""
  const results = await fetchResults()

  results.forEach((result) => {
    const li = listItem("", {
      id: `result-${result.id}`,
      innerHTML: `<h3>${result.name}</h3><p>${result.description}</p>`
    })

    const deleteBtn = button("Excluir Resultado", {
      onClick: async () => {
        await deleteResult(result.id)
        loadQuestionsManager(document.getElementById("questionsManager"))
        li.remove()
      }
    })

    li.append(deleteBtn)
    ul.append(li)
  })
}

export function addSubmitNewResultListener(form) {
  form.addEventListener("submit", async (ev) => {
    ev.preventDefault()

    const formData = new FormData(form)

    const name = formData.get("name")
    const description = formData.get("description")

    await createResult(name, description)

    form.reset()
    loadResults(document.getElementById("resultsList"))
    loadQuestionsManager(document.getElementById("questionsManager"))
  })
}
