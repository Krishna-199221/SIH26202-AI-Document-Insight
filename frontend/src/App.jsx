import { useState } from "react"

import {
  demoDashboard,
  demoSources,
  demoDocuments,
  demoInsights,
  demoResources,
  demoAutomations,
  demoReports,
  demoAssistantQuestions,
  demoAssistantAnswer,
} from "./demoData"


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

  // Prototype navigation
  const [currentPage, setCurrentPage] = useState("home")

  // Prototype automation state
  const [automations, setAutomations] = useState(
    demoAutomations
  )

  // Prototype sources state
  const [sources, setSources] = useState(demoSources)

  // Prototype assistant state
  const [assistantQuestion, setAssistantQuestion] =
    useState("")

  const [assistantAnswer, setAssistantAnswer] =
    useState(null)

  // Version 2 preview
  const [v2Feature, setV2Feature] = useState(null)


  // =========================
  // NAVIGATION
  // =========================

  const goToHome = () => {
    setCurrentPage("home")
    setShowResultsPage(false)
    setError("")

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }, 50)
  }


  const goToAnalyzer = () => {
    setCurrentPage("analyzer")
    setShowResultsPage(false)
    setError("")

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }, 50)
  }


  const goToDashboard = () => {
    setCurrentPage("dashboard")
    setShowResultsPage(false)
    setError("")

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }


  const goToSources = () => {
    setCurrentPage("sources")
    setShowResultsPage(false)

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }


  const goToDocuments = () => {
    setCurrentPage("documents")
    setShowResultsPage(false)

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }


  const goToAssistant = () => {
    setCurrentPage("assistant")
    setShowResultsPage(false)

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }


  const goToInsights = () => {
    if (result) {
      setCurrentPage("results")
      setShowResultsPage(true)
    } else {
      setCurrentPage("insights")
      setShowResultsPage(false)
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }


  const goToResources = () => {
    setCurrentPage("resources")
    setShowResultsPage(false)

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }


  const goToAutomations = () => {
    setCurrentPage("automations")
    setShowResultsPage(false)

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }


  const goToReports = () => {
    setCurrentPage("reports")
    setShowResultsPage(false)

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }


  // =========================
  // FILE SELECTION
  // =========================

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]

    if (selectedFile) {
      setFile(selectedFile)
      setText("")
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
    setResult(null)
    setShowResultsPage(false)
    setError("")
    setCopied(false)
  }


  // =========================
  // REAL AI ANALYZER
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

      if (file) {
        const formData = new FormData()

        formData.append("file", file)

        response = await fetch(
          "https://sih26202-ai-document-insight.onrender.com/summarize-pdf",
          {
            method: "POST",
            body: formData,
          }
        )
      } else {
        response = await fetch(
          "https://sih26202-ai-document-insight.onrender.com/summarize-text",
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
        throw new Error(
          data.detail ||
            "AI processing failed."
        )
      }

      setResult(data)
      setCurrentPage("results")
      setShowResultsPage(true)

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
      await navigator.clipboard.writeText(fullText)

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
  // DOWNLOAD
  // =========================

  const downloadPDF = () => {
    if (!result) return

    window.print()
  }


  // =========================
  // AUTOMATION TOGGLE
  // =========================

  const toggleAutomation = (id) => {
    setAutomations((previous) =>
      previous.map((automation) =>
        automation.id === id
          ? {
              ...automation,
              enabled: !automation.enabled,
            }
          : automation
      )
    )
  }


  // =========================
  // SOURCES
  // =========================

  const addDemoSource = () => {
    const newSource = {
      id: Date.now(),
      name: "New Demo Resource Source",
      type: "PDF",
      status: "Processed",
      date: "11 Sep 2026",
    }

    setSources((previous) => [newSource, ...previous])
  }

  // =========================
  // ASSISTANT
  // =========================

  const askAssistant = (question) => {
    const selectedQuestion =
      question || assistantQuestion

    if (!selectedQuestion.trim()) return

    setAssistantQuestion(selectedQuestion)

    setAssistantAnswer({
      question: selectedQuestion,
      answer:
        selectedQuestion ===
        demoAssistantAnswer.question
          ? demoAssistantAnswer.answer
          : "Based on the prototype resource data, the main areas to investigate are resource utilization, workload distribution, operational bottlenecks, and opportunities to improve allocation.",
    })
  }


  // =========================
  // VERSION 2 FEATURES
  // =========================

  const version2Features = [
    {
      icon: "📚",
      title: "Multi-Document Analysis",
      text:
        "Analyze multiple documents together to discover common themes, relationships, and combined insights.",
    },
    {
      icon: "🔗",
      title: "Multiple Sources",
      text:
        "Bring information from documents, text, web sources, and other knowledge inputs into one analysis workspace.",
    },
    {
      icon: "🔍",
      title: "Document Comparison",
      text:
        "Compare documents to identify similarities, differences, changes, and important contradictions.",
    },
    {
      icon: "📊",
      title: "Insight Dashboard",
      text:
        "View important findings, patterns, trends, categories, and document-level analytics in one dashboard.",
    },
    {
      icon: "🧠",
      title: "Smart Recommendations",
      text:
        "Generate context-aware recommendations from important findings and detected patterns.",
    },
    {
      icon: "📑",
      title: "Advanced Reports",
      text:
        "Create structured reports containing summaries, insights, recommendations, and visual analytics.",
    },
  ]


  const openV2Feature = (feature) => {
    setV2Feature(feature)
  }


  const closeV2Feature = () => {
    setV2Feature(null)
  }


  // =========================
  // PAGE HEADER
  // =========================

  const PageHeader = ({ eyebrow, title, text }) => (
    <div className="hero-content">
      <div className="eyebrow">
        {eyebrow}
      </div>

      <h1>
        {title}
      </h1>

      <p>
        {text}
      </p>

      <button
        className="back-button"
        onClick={goToHome}
        style={{ marginTop: "20px" }}
      >
        ← Back to Home
      </button>
    </div>
  )


  // =========================
  // DASHBOARD
  // =========================

  const DashboardPage = () => (
    <main className="container">

      <section className="analyzer-card">

        <PageHeader
          eyebrow="INSIGHTX • PROTOTYPE DASHBOARD"
          title="Resource Intelligence Dashboard"
          text="A prototype view of how InsightX can transform multiple information sources into useful insights and decisions."
        />

        <div className="feature-pills">

          <div className="feature-pill blue">
            📊 Prototype Data
          </div>

          <div className="feature-pill purple">
            🧠 AI Intelligence
          </div>

          <div className="feature-pill cyan">
            ⚡ Smart Automation
          </div>

        </div>


        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "20px",
            marginTop: "30px",
          }}
        >

          <div className="result-card">
            <div className="result-icon">
              📚
            </div>
            <div className="result-content">
              <h3>Sources</h3>
              <p>{demoDashboard.sources}</p>
            </div>
          </div>


          <div className="result-card">
            <div className="result-icon">
              📄
            </div>
            <div className="result-content">
              <h3>Documents</h3>
              <p>{demoDashboard.documents}</p>
            </div>
          </div>


          <div className="result-card">
            <div className="result-icon">
              💡
            </div>
            <div className="result-content">
              <h3>Insights</h3>
              <p>{demoDashboard.insights}</p>
            </div>
          </div>


          <div className="result-card">
            <div className="result-icon">
              ⚠️
            </div>
            <div className="result-content">
              <h3>Risks</h3>
              <p>{demoDashboard.risks}</p>
            </div>
          </div>


          <div className="result-card">
            <div className="result-icon">
              🚀
            </div>
            <div className="result-content">
              <h3>Optimization</h3>
              <p>
                {demoDashboard.optimizationOpportunities}
              </p>
            </div>
          </div>

        </div>


        <div style={{ marginTop: "35px" }}>

          <h2>Recent AI Insights</h2>

          <div className="insight-list">

            {demoInsights.slice(0, 3).map(
              (insight) => (

                <div
                  className="insight-item"
                  key={insight.id}
                >

                  <div className="insight-number">
                    {String(
                      insight.id
                    ).padStart(2, "0")}
                  </div>

                  <p>
                    <strong>
                      {insight.title}
                    </strong>
                    {" — "}
                    {insight.description}
                  </p>

                </div>

              )
            )}

          </div>

        </div>


        <div style={{ marginTop: "30px" }}>

          <button
            className="analyze-button"
            onClick={goToAnalyzer}
          >
            ✦ Open Real AI Analyzer →
          </button>

        </div>

        <div className="privacy-note">
          ℹ Prototype Dashboard uses demo data.
          It is not connected to a database yet.
        </div>

      </section>

    </main>
  )


  // =========================
  // SOURCES
  // =========================

  const SourcesPage = () => (
    <main className="container">

      <section className="analyzer-card">

        <PageHeader
          eyebrow="INSIGHTX • SOURCES"
          title="Information Sources"
          text="Prototype representation of the different sources InsightX can work with."
        />

        <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "20px",
            }}
          >
            <button
              className="analyze-button"
              onClick={addDemoSource}
            >
              ＋ Add Demo Source
            </button>
          </div>

          <div className="insight-list">

          {sources.map((source) => (

            <div
              className="insight-item"
              key={source.id}
            >

              <div className="insight-number">
                {source.type}
              </div>

              <p>
                <strong>
                  {source.name}
                </strong>
                <br />
                Status: {source.status}
                <br />
                Added: {source.date}
              </p>

            </div>

          ))}

        </div>

        <div className="privacy-note">
          Prototype Demo Data • Source ingestion
          beyond PDF/text is planned for the expanded
          platform.
        </div>

      </section>

    </main>
  )


  // =========================
  // DOCUMENTS
  // =========================

  const DocumentsPage = () => (
    <main className="container">

      <section className="analyzer-card">

        <PageHeader
          eyebrow="INSIGHTX • DOCUMENTS"
          title="Documents"
          text="Prototype document workspace showing processed resources."
        />

        <div className="insight-list">

          {demoDocuments.map((document) => (

            <div
              className="insight-item"
              key={document.id}
            >

              <div className="insight-number">
                📄
              </div>

              <p>
                <strong>
                  {document.name}
                </strong>
                <br />
                Type: {document.type}
                <br />
                Pages: {document.pages}
                <br />
                Status: {document.status}
              </p>

            </div>

          ))}

        </div>

      </section>

    </main>
  )


  // =========================
  // INSIGHTS
  // =========================

  const InsightsPage = () => (
    <main className="container">

      <section className="analyzer-card">

        <PageHeader
          eyebrow="INSIGHTX • INSIGHTS"
          title="AI Insights"
          text="Prototype findings generated from demonstration resource data."
        />

        <div className="insight-list">

          {demoInsights.map((insight) => (

            <div
              className="insight-item"
              key={insight.id}
            >

              <div className="insight-number">
                {String(
                  insight.id
                ).padStart(2, "0")}
              </div>

              <p>
                <strong>
                  {insight.title}
                </strong>
                <br />
                Category: {insight.category}
                <br />
                Severity: {insight.severity}
                <br />
                {insight.description}
              </p>

            </div>

          ))}

        </div>

      </section>

    </main>
  )


  // =========================
  // RESOURCES
  // =========================

  const ResourcesPage = () => (
    <main className="container">

      <section className="analyzer-card">

        <PageHeader
          eyebrow="INSIGHTX • RESOURCE INTELLIGENCE"
          title="Resource Utilization"
          text="Prototype view of how InsightX can identify resource usage patterns."
        />

        <div className="insight-list">

          {demoResources.map((resource) => (

            <div
              className="insight-item"
              key={resource.id}
            >

              <div className="insight-number">
                {resource.utilization}%
              </div>

              <p>
                <strong>
                  {resource.name}
                </strong>
                <br />
                Type: {resource.type}
                <br />
                Utilization: {resource.utilization}%
                <br />
                Status: {resource.status}
              </p>

            </div>

          ))}

        </div>

      </section>

    </main>
  )


  // =========================
  // AUTOMATIONS
  // =========================

  const AutomationsPage = () => (
    <main className="container">

      <section className="analyzer-card">

        <PageHeader
          eyebrow="INSIGHTX • SMART AUTOMATION"
          title="Automation Center"
          text="Interactive prototype of future InsightX automation workflows."
        />

        <div className="insight-list">

          {automations.map((automation) => (

            <div
              className="insight-item"
              key={automation.id}
            >

              <div className="insight-number">
                ⚡
              </div>

              <p>
                <strong>
                  {automation.name}
                </strong>
                <br />
                Trigger: {automation.trigger}
                <br />
                Action: {automation.action}
                <br />
                Status:{" "}
                {automation.enabled
                  ? "ON"
                  : "OFF"}
              </p>

              <button
                className="result-action-button"
                onClick={() =>
                  toggleAutomation(
                    automation.id
                  )
                }
              >
                {automation.enabled
                  ? "Turn OFF"
                  : "Turn ON"}
              </button>

            </div>

          ))}

        </div>

        <div className="privacy-note">
          Prototype only. These switches change
          frontend demo state; they do not execute
          real external workflows yet.
        </div>

      </section>

    </main>
  )


  // =========================
  // REPORTS
  // =========================

  const ReportsPage = () => (
    <main className="container">

      <section className="analyzer-card">

        <PageHeader
          eyebrow="INSIGHTX • REPORTS"
          title="Reports"
          text="Prototype collection of generated intelligence reports."
        />

        <div className="insight-list">

          {demoReports.map((report) => (

            <div
              className="insight-item"
              key={report.id}
            >

              <div className="insight-number">
                📑
              </div>

              <p>
                <strong>
                  {report.name}
                </strong>
                <br />
                Type: {report.type}
                <br />
                Date: {report.date}
              </p>

              <button
                className="result-action-button"
                onClick={() =>
                  alert(
                    "Prototype report preview: " +
                    report.name
                  )
                }
              >
                View Report
              </button>

            </div>

          ))}

        </div>

      </section>

    </main>
  )


  // =========================
  // AI ASSISTANT
  // =========================

  const AssistantPage = () => (
    <main className="container">

      <section className="analyzer-card">

        <PageHeader
          eyebrow="INSIGHTX • AI ASSISTANT"
          title="Ask InsightX"
          text="Prototype assistant for asking questions about resource intelligence."
        />

        <textarea
          value={assistantQuestion}
          onChange={(event) =>
            setAssistantQuestion(
              event.target.value
            )
          }
          placeholder="Ask a question about the available resources..."
          style={{
            width: "100%",
            minHeight: "120px",
            marginTop: "25px",
          }}
        />

        <button
          className="analyze-button"
          onClick={() =>
            askAssistant()
          }
        >
          🧠 Ask InsightX →
        </button>


        <div style={{ marginTop: "25px" }}>

          <h3>Suggested Questions</h3>

          <div className="feature-pills">

            {demoAssistantQuestions.map(
              (question) => (

                <button
                  className="feature-pill blue"
                  key={question}
                  onClick={() =>
                    askAssistant(question)
                  }
                >
                  {question}
                </button>

              )
            )}

          </div>

        </div>


        {assistantAnswer && (

          <div
            className="result-card"
            style={{
              marginTop: "30px",
            }}
          >

            <div className="result-icon">
              🧠
            </div>

            <div className="result-content">

              <h3>
                Answer
              </h3>

              <p>
                <strong>
                  Question:
                </strong>{" "}
                {assistantAnswer.question}
              </p>

              <p>
                {assistantAnswer.answer}
              </p>

            </div>

          </div>

        )}

        <div className="privacy-note">
          Prototype Demo Assistant • Responses are
          demonstration data and are not connected to
          the real AI backend.
        </div>

      </section>

    </main>
  )


  // =========================
  // REAL ANALYZER PAGE
  // =========================

  const AnalyzerPage = () => (
    <main
      className="container"
      id="analyzer"
    >

      <section className="analyzer-card">

        <div className="hero-content">

          <div className="eyebrow">
            REAL AI ANALYZER
          </div>

          <h1>
            Analyze Your Document
          </h1>

          <p>
            Upload a text-based PDF or paste text.
            InsightX sends it to the real FastAPI
            backend for AI analysis.
          </p>

        </div>


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


        <div className="privacy-note">
          🔒 Your document is processed
          securely and is not stored.
        </div>


        {error && (

          <div className="error-message">
            ⚠ {error}
          </div>

        )}


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
                still available.
              </div>

            </div>

            <button
              className="previous-result-button"
              onClick={() => {
                setCurrentPage("results")
                setShowResultsPage(true)
              }}
            >
              View Previous Results →
            </button>

          </div>

        )}

      </section>

    </main>
  )


  // =========================
  // RESULTS PAGE
  // =========================

  const ResultsPage = () => {
    if (!result) {
      return <AnalyzerPage />
    }

    return (
      <main className="container">

        <section className="results results-page">

          <button
            className="back-button"
            onClick={goToAnalyzer}
          >
            ← Back to Analyzer
          </button>


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
                className="result-action-button"
                onClick={
                  copyResults
                }
              >
                {copied
                  ? "✓ Copied!"
                  : "📋 Copy Results"}
              </button>

              <button
                className="result-action-button"
                onClick={
                  downloadPDF
                }
              >
                📄 Download PDF
              </button>

            </div>

          </div>


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
    )
  }


  // =========================
  // HOME PAGE
  // =========================

  const HomePage = () => (
    <>

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


          <button
            className="analyze-button"
            onClick={goToAnalyzer}
          >
            ✦ Start Real AI Analysis →
          </button>

        </div>


        <div className="hero-orb">

          <div className="orb-core">
            ✦
          </div>

        </div>

      </header>


      {/* =========================
          PROTOTYPE MODULES
      ========================= */}

      <section className="v2-section">

        <div className="v2-header">

          <div>

            <div className="eyebrow">
              INSIGHTX • PROTOTYPE
            </div>

            <h2>
              Resource Intelligence Platform
            </h2>

            <p>
              Explore the working frontend prototype
              for dashboards, sources, insights,
              resources, automation and reports.
            </p>

          </div>

          <div className="v2-badge">
            ✦ Prototype Demo
          </div>

        </div>


        <div className="v2-grid">

          <button
            className="v2-feature-card"
            onClick={goToDashboard}
          >
            <div className="v2-feature-icon">
              📊
            </div>

            <div className="v2-feature-content">

              <div className="v2-feature-title">
                Dashboard
              </div>

              <div className="v2-feature-text">
                View prototype KPIs, risks,
                insights and optimization opportunities.
              </div>

            </div>

            <div className="v2-feature-arrow">
              →
            </div>

          </button>


          <button
            className="v2-feature-card"
            onClick={goToSources}
          >
            <div className="v2-feature-icon">
              📚
            </div>

            <div className="v2-feature-content">

              <div className="v2-feature-title">
                Sources
              </div>

              <div className="v2-feature-text">
                Explore demonstration information sources.
              </div>

            </div>

            <div className="v2-feature-arrow">
              →
            </div>

          </button>


          <button
            className="v2-feature-card"
            onClick={goToDocuments}
          >
            <div className="v2-feature-icon">
              📄
            </div>

            <div className="v2-feature-content">

              <div className="v2-feature-title">
                Documents
              </div>

              <div className="v2-feature-text">
                Browse prototype processed documents.
              </div>

            </div>

            <div className="v2-feature-arrow">
              →
            </div>

          </button>


          <button
            className="v2-feature-card"
            onClick={goToAssistant}
          >
            <div className="v2-feature-icon">
              🧠
            </div>

            <div className="v2-feature-content">

              <div className="v2-feature-title">
                AI Assistant
              </div>

              <div className="v2-feature-text">
                Ask questions using prototype intelligence data.
              </div>

            </div>

            <div className="v2-feature-arrow">
              →
            </div>

          </button>


          <button
            className="v2-feature-card"
            onClick={goToInsights}
          >
            <div className="v2-feature-icon">
              💡
            </div>

            <div className="v2-feature-content">

              <div className="v2-feature-title">
                Insights
              </div>

              <div className="v2-feature-text">
                Explore findings, risks and optimization opportunities.
              </div>

            </div>

            <div className="v2-feature-arrow">
              →
            </div>

          </button>


          <button
            className="v2-feature-card"
            onClick={goToResources}
          >
            <div className="v2-feature-icon">
              📈
            </div>

            <div className="v2-feature-content">

              <div className="v2-feature-title">
                Resources
              </div>

              <div className="v2-feature-text">
                View utilization and resource status.
              </div>

            </div>

            <div className="v2-feature-arrow">
              →
            </div>

          </button>


          <button
            className="v2-feature-card"
            onClick={goToAutomations}
          >
            <div className="v2-feature-icon">
              ⚡
            </div>

            <div className="v2-feature-content">

              <div className="v2-feature-title">
                Automation
              </div>

              <div className="v2-feature-text">
                Toggle prototype automation workflows.
              </div>

            </div>

            <div className="v2-feature-arrow">
              →
            </div>

          </button>


          <button
            className="v2-feature-card"
            onClick={goToReports}
          >
            <div className="v2-feature-icon">
              📑
            </div>

            <div className="v2-feature-content">

              <div className="v2-feature-title">
                Reports
              </div>

              <div className="v2-feature-text">
                Browse prototype intelligence reports.
              </div>

            </div>

            <div className="v2-feature-arrow">
              →
            </div>

          </button>

        </div>

      </section>


      {/* =========================
          ORIGINAL V2 PREVIEW
      ========================= */}

      <section className="v2-section">

        <div className="v2-header">

          <div>

            <div className="eyebrow">
              INSIGHTX • FULL VERSION COMING SOON
            </div>

            <h2>
              Advanced Intelligence Platform
            </h2>

            <p>
              A preview of the expanded InsightX
              vision for multi-source intelligence,
              comparison, analytics and decision support.
            </p>

          </div>

          <div className="v2-badge">
            ✦ Future Vision
          </div>

        </div>


        <div className="v2-grid">

          {version2Features.map(
            (feature) => (

              <button
                className="v2-feature-card"
                key={feature.title}
                onClick={() =>
                  openV2Feature(feature)
                }
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

            )
          )}

        </div>

      </section>

    </>
  )


  // =========================
  // MAIN UI
  // =========================

  return (
    <div
      className={
        darkMode
          ? "app dark-mode"
          : "app"
      }
    >

      {/* =========================
          NAVBAR
      ========================= */}

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
            onClick={goToDashboard}
          >
            Dashboard
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
          >
            {darkMode
              ? "☀️"
              : "🌙"}
          </button>

        </div>

      </nav>


      {/* =========================
          PAGE ROUTING
      ========================= */}

      {showResultsPage ? (

        <ResultsPage />

      ) : currentPage === "home" ? (

        <HomePage />

      ) : currentPage === "dashboard" ? (

        <DashboardPage />

      ) : currentPage === "sources" ? (

        <SourcesPage />

      ) : currentPage === "documents" ? (

        <DocumentsPage />

      ) : currentPage === "assistant" ? (

        <AssistantPage />

      ) : currentPage === "insights" ? (

        <InsightsPage />

      ) : currentPage === "resources" ? (

        <ResourcesPage />

      ) : currentPage === "automations" ? (

        <AutomationsPage />

      ) : currentPage === "reports" ? (

        <ReportsPage />

      ) : (

        <AnalyzerPage />

      )}


      {/* =========================
          V2 MODAL
      ========================= */}

      {v2Feature && (

        <div
          className="v2-modal-overlay"
          onClick={closeV2Feature}
        >

          <div
            className="v2-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
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
              This feature is part of the proposed
              Version 2 product vision and is shown
              here as a frontend prototype for
              demonstration.
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


      {/* =========================
          FOOTER
      ========================= */}

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
