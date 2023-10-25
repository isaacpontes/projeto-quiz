import { loadQuestionsManager } from "./questions"

export async function loadResults(ul) {
  ul.innerHTML = ""
  const results = await fetch("http://localhost:3000/results").then((res) => res.json())

  results.forEach((result) => {
    const li = document.createElement("li")
    li.innerHTML = `<h3>${result.name}</h3><p>${result.description}</p>`
    li.id = `result-${result.id}`
    const deleteBtn = document.createElement("button")
    deleteBtn.textContent = "Excluir Resultado"
    deleteBtn.addEventListener("click", async () => {
      await fetch(`http://localhost:3000/results/${result.id}`, { method: "DELETE" })
      loadQuestionsManager(document.getElementById("questionsManager"))
      li.remove()
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

    const body = JSON.stringify({ name, description })

    await fetch("http://localhost:3000/results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body
    })

    form.reset()
    loadResults(document.getElementById("resultsList"))
    loadQuestionsManager(document.getElementById("questionsManager"))
  })
}
