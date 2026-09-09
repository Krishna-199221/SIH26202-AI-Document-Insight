import { useState } from "react"

function App() {
  const [file, setFile] = useState(null)
  const [text, setText] = useState("")
  const [activeTab, setActiveTab] = useState("upload")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]

    if (selectedFile) {
      setFile(selectedFile)
      setText("")
      setResult(null)
      setError("")
    }
  }

  const handleTextChange = (event) => {
    setText(event.target.value)
    setFile(null)
    setResult(null)
    setError("")
  }

  const analyzeDocument = async () => {
    setError("")
    setResult(null)

    if (!file && !text.trim()) {
      setError("Please upload a PDF or paste some text first.")
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
        throw new Error(data.detail || "AI processing failed.")
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

      {/* Navigation */}
      <nav className="navbar">
        <div className="brand">
          <div className="brand-icon">✦</div>

          <div>
            <div className="brand-name">AI DocInsight</div>
            <div className="brand-tagline">
              From Documents to Decisions
            </div>
          </div>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#analyzer">Analyzer</a>
          <a href="#results">Insights</a>
        </div>

        <div className="secure-badge">
          ✦ Smart • Secure • Simple
        </div>
      </nav>

      {/* Hero */}
      <header className="hero" id="home">

        <div className="hero-content">

          <div className="eyebrow">
            POWERED BY ARTIFICIAL INTELLIGENCE
          </div>

          <h1>
            AI Document
            <span> Insight Generator</span>
          </h1>

          <p>
            Transform documents into concise summaries, meaningful insights,
            and actionable information using Artificial Intelligence.
          </p>

          <div className="feature-pills">
            <div className="feature-pill blue">
              ⚡ Fast Analysis
            </div>

            <div className="feature-pill purple">
              ✦ Intelligent Insights
            </div>

            <div className="feature-pill cyan">
              ◫ PDF & Text Support
            </div>
          </div>

        </div>

        <div className="hero-orb">
          <div className="orb-core">✦</div>
        </div>

      </header>

      {/* Analyzer */}
      <main className="container" id="analyzer">

        <section className="analyzer-card">

          {/* Tabs */}
          <div className="tabs">

            <button
              className={activeTab === "upload" ? "tab active" : "tab"}
              onClick={() => setActiveTab("upload")}
            >
              📄 Upload Document
            </button>

            <button
              className={activeTab === "text" ? "tab active" : "tab"}
              onClick={() => setActiveTab("text")}
            >
              ☷ Paste Text
            </button>

          </div>

          {/* Upload mode */}
          {activeTab === "upload" && (
            <div className="upload-area">

              <div className="upload-glow-icon">
                ↑
              </div>

              <h2>Upload a PDF Document</h2>

              <p>
                Choose a text-based PDF from your computer
              </p>

              <label className="file-button">
                📄 Choose File

                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                />
              </label>

              {file ? (
                <div className="selected-file">
                  ✓ {file.name}
                </div>
              ) : (
                <div className="file-placeholder">
                  No file chosen
                </div>
              )}

              <div className="supported">
                Supported format: PDF (text-based)
              </div>

            </div>
          )}

          {/* Text mode */}
          {activeTab === "text" && (
            <div className="text-area-wrapper">

              <div className="text-icon">
                ✎
              </div>

              <h2>Paste Your Document Text</h2>

              <p>
                Add the text you want AI to analyze
              </p>

              <textarea
                value={text}
                onChange={handleTextChange}
                placeholder="Paste your document text here..."
              />

            </div>
          )}

          {/* Analyze button */}
          <button
            className="analyze-button"
            onClick={analyzeDocument}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Analyzing with AI...
              </>
            ) : (
              <>
                ✦ Analyze Document →
              </>
            )}
          </button>

          <div className="privacy-note">
            🔒 Your document is processed securely and is not stored.
          </div>

          {error && (
            <div className="error-message">
              ⚠ {error}
            </div>
          )}

        </section>

        {/* Results */}
        {result && (
          <section className="results" id="results">

            <div className="results-heading">
              <div>
                <div className="eyebrow">
                  AI ANALYSIS COMPLETE
                </div>

                <h2>
                  Your Document Insights
                </h2>
              </div>

              <div className="success-badge">
                ✓ Analysis Complete
              </div>
            </div>

            {/* Summary */}
            <div className="result-card summary-card">

              <div className="result-icon">
                📋
              </div>

              <div className="result-content">
                <h3>Summary</h3>

                <ul>
                  {result.summary.map((item, index) => (
                    <li key={index}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Insights */}
            <div className="result-card insight-card">

              <div className="result-icon">
                💡
              </div>

              <div className="result-content">
                <h3>Key Insights</h3>

                <div className="insight-list">
                  {result.insights.map((item, index) => (
                    <div className="insight-item" key={index}>

                      <div className="insight-number">
                        0{index + 1}
                      </div>

                      <p>{item}</p>

                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="result-card action-card">

              <div className="result-icon">
                ✓
              </div>

              <div className="result-content">
                <h3>Recommended Actions</h3>

                <ul>
                  {result.actions.map((item, index) => (
                    <li key={index}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="footer">

        <div>
          AI DocInsight
        </div>

        <div>
          Smart India Hackathon
        </div>

        <div>
          Ideas for a Better India 🇮🇳
        </div>

      </footer>

    </div>
  )
}

export default App