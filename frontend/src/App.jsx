import { useState } from "react"

function App() {
  const [file, setFile] = useState(null)
  const [text, setText] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const analyzeDocument = async () => {
    setError("")
    setResult(null)

    if (!file && !text.trim()) {
      setError("Please upload a PDF or paste some text.")
      return
    }

    setLoading(true)

    try {
      let response

      if (file) {
        const formData = new FormData()
        formData.append("file", file)

        response = await fetch(
          "http://127.0.0.1:8000/summarize-pdf",
          {
            method: "POST",
            body: formData,
          }
        )
      } else {
        response = await fetch(
          "http://127.0.0.1:8000/summarize-text",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: text,
            }),
          }
        )
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || "Something went wrong.")
      }

      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="hero">
        <h1>AI Document Insight Generator</h1>
        <p>
          Upload a document or paste text to generate AI-powered insights.
        </p>
      </header>

      <main className="container">
        <section className="input-card">
          <h2>Analyze Your Document</h2>

          <div className="upload-box">
            <div className="upload-icon">📄</div>

            <h3>Upload a PDF</h3>

            <p>Choose a text-based PDF from your computer</p>

            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={(event) => {
                setFile(event.target.files[0])
                setText("")
                setResult(null)
                setError("")
              }}
            />

            {file && (
              <p className="file-name">
                Selected: {file.name}
              </p>
            )}
          </div>

          <div className="divider">
            <span>OR</span>
          </div>

          <div className="text-section">
            <h3>Paste Text</h3>

            <textarea
              placeholder="Paste your document text here..."
              value={text}
              onChange={(event) => {
                setText(event.target.value)
                setFile(null)
                setResult(null)
                setError("")
              }}
            />
          </div>

          <button
            className="analyze-button"
            onClick={analyzeDocument}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze Document"}
          </button>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </section>

        {result && (
          <section className="results">
            <h2>Analysis Result</h2>

            <div className="result-card">
              <h3>📋 Summary</h3>

              <ul>
                {result.summary.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="result-card">
              <h3>💡 Key Insights</h3>

              <ol>
                {result.insights.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>
            </div>

            <div className="result-card">
              <h3>✅ Action Items</h3>

              <ul>
                {result.actions.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App