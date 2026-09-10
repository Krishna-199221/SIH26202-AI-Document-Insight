import { useState } from "react"

function renderInsightText(text) {
  if (!text) return null

  const separatorIndex = text.indexOf(":")

  if (separatorIndex === -1) {
    return text
  }

  const title = text.slice(0, separatorIndex + 1)
  const description = text.slice(separatorIndex + 1).trim()

  return (
    <>
      <strong>{title}</strong>{" "}
      {description}
    </>
  )
}

function App() {
  const [file, setFile] = useState(null)
  const [text, setText] = useState("")
  const [activeTab, setActiveTab] = useState("upload")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [showResultsPage, setShowResultsPage] = useState(false)
  const [v2Feature, setV2Feature] = useState(null)

  // =========================
  // GO TO ANALYZER
  // =========================

  const goToAnalyzer = () => {
    // Do NOT clear:
    // file
    // text
    // result

    setShowResultsPage(false)
    setError("")
    setCopied(false)

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }, 50)
  }

  // =========================
  // GO TO HOME
  // =========================

  const goToHome = () => {
    setShowResultsPage(false)
    setError("")

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }, 50)
  }

  // =========================
  // VIEW PREVIOUS RESULTS
  // =========================

  const viewPreviousResults = () => {
    if (!result) return

    setShowResultsPage(true)
    setError("")
    setCopied(false)

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }, 50)
  }

  // =========================
  // INSIGHTS NAVIGATION
  // =========================

  const goToInsights = () => {
    if (result) {
      viewPreviousResults()
    } else {
      goToAnalyzer()
    }
  }

  // =========================
  // FILE SELECTION
  // =========================

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]

    if (selectedFile) {
      setFile(selectedFile)
      setText("")

      // New document = old result is no longer relevant
      setResult(null)

      setShowResultsPage(false)
      setError("")
      setCopied(false)
    }
  }

  // =========================
  // TEXT INPUT
  // =========================

  const handleTextChange = (event) => {
    setText(event.target.value)
    setFile(null)

    // New text = old result is no longer relevant
    setResult(null)

    setShowResultsPage(false)
    setError("")
    setCopied(false)
  }

  // =========================
  // ANALYZE DOCUMENT
  // =========================

  const analyzeDocument = async () => {
    setError("")
    setCopied(false)

    if (!file && !text.trim()) {
      setError(
        "Please upload a PDF or paste some text first."
      )
      return
    }

    setLoading(true)

    try {
      let response

      // =========================
      // PDF ANALYSIS
      // =========================

      if (file) {
        const formData = new FormData()

        formData.append(
          "file",
          file
        )

        response = await fetch(
          "http://127.0.0.1:8000/summarize-pdf",
          {
            method: "POST",
            body: formData,
          }
        )
      }

      // =========================
      // TEXT ANALYSIS
      // =========================

      else {
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

      // =========================
      // READ RESPONSE
      // =========================

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "AI processing failed."
        )
      }

      // Save AI result
      setResult(data)

      // Open Results page
      setShowResultsPage(true)

      // Scroll to top
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }

    catch (err) {
      setError(
        err.message ||
          "Something went wrong while analyzing the document."
      )
    }

    finally {
      setLoading(false)
    }
  }

  // =========================
  // COPY RESULTS
  // =========================

  const copyResults = async () => {
    if (!result) return

    const summaryText = result.summary
      .map(
        (item, index) =>
          `${index + 1}. ${item}`
      )
      .join("\n\n")

    const insightsText = result.insights
      .map(
        (item, index) =>
          `${index + 1}. ${item}`
      )
      .join("\n\n")

    const actionsText = result.actions
      .map(
        (item, index) =>
          `${index + 1}. ${item}`
      )
      .join("\n\n")

    const fullText = `AI DOCUMENT INSIGHTS

SUMMARY
${summaryText}

KEY INSIGHTS
${insightsText}

RECOMMENDED ACTIONS
${actionsText}

Generated by InsightX
Smart India Hackathon
`

    try {
      await navigator.clipboard.writeText(
        fullText
      )

      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 2500)
    }

    catch (err) {
      setError(
        "Unable to copy results. Please try again."
      )
    }
  }

  // =========================
  // DOWNLOAD PDF
  // =========================

  const downloadPDF = () => {
    if (!result) return

    window.print()
  }

  // =========================
  // VERSION 2 DEMO FEATURES
  // =========================

  const version2Features = [
    {
      icon: "📚",
      title: "Multi-Document Analysis",
      text: "Analyze multiple documents together to discover common themes, relationships, and combined insights.",
    },
    {
      icon: "🔗",
      title: "Multiple Sources",
      text: "Bring information from documents, text, web sources, and other knowledge inputs into one analysis workspace.",
    },
    {
      icon: "🔍",
      title: "Document Comparison",
      text: "Compare documents to identify similarities, differences, changes, and important contradictions.",
    },
    {
      icon: "📊",
      title: "Insight Dashboard",
      text: "View important findings, patterns, trends, categories, and document-level analytics in one dashboard.",
    },
    {
      icon: "🧠",
      title: "Smart Recommendations",
      text: "Generate context-aware recommendations from important findings and detected patterns.",
    },
    {
      icon: "📑",
      title: "Advanced Reports",
      text: "Create structured reports containing summaries, insights, recommendations, and visual analytics.",
    },
  ]

  const openV2Feature = (feature) => {
    setV2Feature(feature)
  }

  const closeV2Feature = () => {
    setV2Feature(null)
  }

  // =========================
  // APP UI
  // =========================

  return (
    <div
      className={
        darkMode
          ? "app dark-mode"
          : "app"
      }
    >

      {/* ==================================================
          NAVIGATION
      ================================================== */}

      <nav className="navbar">

        <div className="brand">

          <div className="brand-icon">
            ✦
          </div>

          <div>

            <div className="brand-name">
              InsightX
            </div>

            <div className="brand-tagline">
              From Documents to Decisions
            </div>

          </div>

        </div>


        <div className="nav-links">

          <button
            className="nav-link-button"
            onClick={goToHome}
          >
            Home
          </button>

          <button
            className="nav-link-button"
            onClick={goToAnalyzer}
          >
            Analyzer
          </button>

          <button
            className="nav-link-button"
            onClick={goToInsights}
          >
            Insights
          </button>

        </div>


        <div className="navbar-actions">

          <div className="secure-badge">
            ✦ Smart • Secure • Simple
          </div>

          <button
            className="theme-toggle"
            onClick={() =>
              setDarkMode(!darkMode)
            }
            aria-label="Toggle dark mode"
            title={
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            {darkMode
              ? "☀️"
              : "🌙"}
          </button>

        </div>

      </nav>


      {/* ==================================================
          ANALYZER PAGE
      ================================================== */}

      {!showResultsPage && (

        <>

          {/* ==================================================
              HERO
          ================================================== */}

          <header
            className="hero"
            id="home"
          >

            <div className="hero-content">

              <div className="eyebrow">
                POWERED BY ARTIFICIAL INTELLIGENCE
              </div>

              <h1>
                InsightX
                <span>
                  {" "}
                  Intelligence Platform
                </span>
              </h1>

              <p>
                Transform documents into concise
                summaries, meaningful insights,
                and actionable information using
                Artificial Intelligence.
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

              <div className="orb-core">
                ✦
              </div>

            </div>

          </header>

          {/* ==================================================
              VERSION 2 - ADVANCED INTELLIGENCE PREVIEW
          ================================================== */}

          <section className="v2-section">
            <div className="v2-header">
              <div>
                <div className="eyebrow">
                  INSIGHTX • VERSION 2
                </div>
                <h2>
                  Advanced Intelligence Platform
                </h2>
                <p>
                  A preview of the expanded InsightX vision for
                  multi-source intelligence, comparison, analytics,
                  and decision support.
                </p>
              </div>

              <div className="v2-badge">
                ✦ Prototype Preview
              </div>
            </div>

            <div className="v2-grid">
              {version2Features.map((feature) => (
                <button
                  className="v2-feature-card"
                  key={feature.title}
                  onClick={() => openV2Feature(feature)}
                >
                  <div className="v2-feature-icon">
                    {feature.icon}
                  </div>

                  <div className="v2-feature-content">
                    <div className="v2-feature-title">
                      {feature.title}
                    </div>

                    <div className="v2-feature-text">
                      {feature.text}
                    </div>
                  </div>

                  <div className="v2-feature-arrow">
                    →
                  </div>

                  <span className="v2-coming-badge">
                    V2
                  </span>
                </button>
              ))}
            </div>
          </section>


          {/* ==================================================
              ANALYZER
          ================================================== */}

          <main
            className="container"
            id="analyzer"
          >

            <section className="analyzer-card">

              {/* ==================================================
                  TABS
              ================================================== */}

              <div className="tabs">

                <button
                  className={
                    activeTab === "upload"
                      ? "tab active"
                      : "tab"
                  }
                  onClick={() =>
                    setActiveTab("upload")
                  }
                >
                  📄 Upload Document
                </button>


                <button
                  className={
                    activeTab === "text"
                      ? "tab active"
                      : "tab"
                  }
                  onClick={() =>
                    setActiveTab("text")
                  }
                >
                  ☷ Paste Text
                </button>

              </div>


              {/* ==================================================
                  UPLOAD MODE
              ================================================== */}

              {activeTab === "upload" && (

                <div className="upload-area">

                  <div className="upload-glow-icon">
                    ↑
                  </div>

                  <h2>
                    Upload a PDF Document
                  </h2>

                  <p>
                    Choose a text-based PDF
                    from your computer
                  </p>


                  <label className="file-button">

                    📄 Choose File

                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={
                        handleFileChange
                      }
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
                    Supported format:
                    PDF (text-based)
                  </div>

                </div>

              )}


              {/* ==================================================
                  TEXT MODE
              ================================================== */}

              {activeTab === "text" && (

                <div className="text-area-wrapper">

                  <div className="text-icon">
                    ✎
                  </div>

                  <h2>
                    Paste Your Document Text
                  </h2>

                  <p>
                    Add the text you want
                    AI to analyze
                  </p>


                  <textarea
                    value={text}
                    onChange={
                      handleTextChange
                    }
                    placeholder="Paste your document text here..."
                  />

                </div>

              )}


              {/* ==================================================
                  ANALYZE BUTTON
              ================================================== */}

              <button
                className="analyze-button"
                onClick={
                  analyzeDocument
                }
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


              {/* ==================================================
                  PRIVACY NOTE
              ================================================== */}

              <div className="privacy-note">
                🔒 Your document is processed
                securely and is not stored.
              </div>


              {/* ==================================================
                  ERROR
              ================================================== */}

              {error && (

                <div className="error-message">
                  ⚠ {error}
                </div>

              )}


              {/* ==================================================
                  PREVIOUS RESULT
              ================================================== */}

              {result && !loading && (

                <div className="previous-result-box">

                  <div className="previous-result-icon">
                    📊
                  </div>


                  <div className="previous-result-content">

                    <div className="previous-result-title">
                      Previous Analysis Available
                    </div>

                    <div className="previous-result-text">
                      Your previous AI analysis is
                      still available. You can view
                      it again without analyzing the
                      document again.
                    </div>

                  </div>


                  <button
                    className="previous-result-button"
                    onClick={
                      viewPreviousResults
                    }
                  >
                    View Previous Results →
                  </button>

                </div>

              )}

            </section>

          </main>

        </>

      )}


      {/* ==================================================
          RESULTS PAGE
      ================================================== */}

      {showResultsPage && result && (

        <main
          className="container results-page-container"
        >

          <section
            className="results results-page"
            id="results"
          >

            {/* ==================================================
                BACK BUTTON
            ================================================== */}

            <button
              className="back-button"
              onClick={goToAnalyzer}
            >
              ← Back to Analyzer
            </button>


            {/* ==================================================
                RESULTS HEADER
            ================================================== */}

            <div className="results-heading">

              <div>

                <div className="eyebrow">
                  AI ANALYSIS COMPLETE
                </div>

                <h2>
                  Your Document Insights
                </h2>

              </div>


              <div className="results-controls">

                <div className="success-badge">
                  ✓ Analysis Complete
                </div>


                <button
                  className="result-action-button copy-button"
                  onClick={
                    copyResults
                  }
                >
                  {copied
                    ? "✓ Copied!"
                    : "📋 Copy Results"}
                </button>


                <button
                  className="result-action-button pdf-button"
                  onClick={
                    downloadPDF
                  }
                >
                  📄 Download PDF
                </button>

              </div>

            </div>


            {/* ==================================================
                SUMMARY
            ================================================== */}

            <div className="result-card summary-card">

              <div className="result-icon">
                📋
              </div>


              <div className="result-content">

                <h3>

                  Summary

                  <span className="result-count">
                    {result.summary.length}
                    {" "}
                    points
                  </span>

                </h3>


                <ul>

                  {result.summary.map(
                    (item, index) => (

                      <li key={index}>
                        {renderInsightText(item)}
                      </li>

                    )
                  )}

                </ul>

              </div>

            </div>


            {/* ==================================================
                KEY INSIGHTS
            ================================================== */}

            <div className="result-card insight-card">

              <div className="result-icon">
                💡
              </div>


              <div className="result-content">

                <h3>

                  Key Insights

                  <span className="result-count">
                    {result.insights.length}
                    {" "}
                    insights
                  </span>

                </h3>


                <div className="insight-list">

                  {result.insights.map(
                    (item, index) => (

                      <div
                        className="insight-item"
                        key={index}
                      >

                        <div className="insight-number">
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </div>


                        <p>
                          {renderInsightText(item)}
                        </p>

                      </div>

                    )
                  )}

                </div>

              </div>

            </div>


            {/* ==================================================
                RECOMMENDED ACTIONS
            ================================================== */}

            <div className="result-card action-card">

              <div className="result-icon">
                ✓
              </div>


              <div className="result-content">

                <h3>

                  Recommended Actions

                  <span className="result-count">
                    {result.actions.length}
                    {" "}
                    actions
                  </span>

                </h3>


                {result.actions.length > 0 ? (

                  <ul>

                    {result.actions.map(
                      (item, index) => (

                        <li key={index}>
                          {renderInsightText(item)}
                        </li>

                      )
                    )}

                  </ul>

                ) : (

                  <p className="no-actions">
                    No specific actions were
                    identified from this document.
                  </p>

                )}

              </div>

            </div>

          </section>

        </main>

      )}


      {/* ==================================================
          VERSION 2 FEATURE PREVIEW MODAL
      ================================================== */}

      {v2Feature && (
        <div
          className="v2-modal-overlay"
          onClick={closeV2Feature}
        >
          <div
            className="v2-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="v2-modal-close"
              onClick={closeV2Feature}
              aria-label="Close feature preview"
            >
              ×
            </button>

            <div className="v2-modal-icon">
              {v2Feature.icon}
            </div>

            <div className="eyebrow">
              INSIGHTX • VERSION 2
            </div>

            <h2>
              {v2Feature.title}
            </h2>

            <p>
              {v2Feature.text}
            </p>

            <div className="v2-modal-status">
              <span>✦</span>
              Prototype Preview
            </div>

            <div className="v2-modal-note">
              This feature is part of the proposed Version 2
              product vision and is shown here as a frontend
              prototype for demonstration.
            </div>

            <button
              className="v2-modal-button"
              onClick={closeV2Feature}
            >
              Continue Exploring InsightX
            </button>
          </div>
        </div>
      )}

      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer className="footer">

        <div>
          InsightX
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