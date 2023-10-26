export async function fetchResults() {
  return await fetch("http://localhost:3000/results").then((res) => res.json())
}

export async function createResult(name, description) {
  const body = JSON.stringify({ name, description })

  await fetch("http://localhost:3000/results", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body
  })
}

export async function deleteResult(resultId) {
  await fetch(`http://localhost:3000/results/${resultId}`, { method: "DELETE" })
}

export async function fetchQuestions() {
  return await fetch("http://localhost:3000/questions").then((res) => res.json())
}

export async function createQuestion(text = "", points = {
  "fullyDisagree": null,
  "partiallyDisagree": null,
  "fullyAgree": null,
  "partiallyAgree": null,
  "dontKnow": null
}) {
  await fetch("http://localhost:3000/questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: text,
      points: points
    })
  })
}

export async function updateQuestion(questionId, text, points) {
  await fetch(`http://localhost:3000/questions/${questionId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, points })
  })
}

export async function deleteQuestion(questionId) {
  await fetch(`http://localhost:3000/questions/${questionId}`, { method: "DELETE" })
}