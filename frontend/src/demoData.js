// Prototype Demo Data
// This data is used for the NEXUS AI prototype screens.
// It is NOT real backend/database data.

export const demoDashboard = {
  sources: 124,
  documents: 47,
  insights: 23,
  risks: 6,
  optimizationOpportunities: 14,
};

export const demoSources = [
  {
    id: 1,
    name: "Resource Utilization Report",
    type: "PDF",
    status: "Processed",
    date: "12 Sep 2026",
  },
  {
    id: 2,
    name: "Department Workload Data",
    type: "CSV",
    status: "Processed",
    date: "11 Sep 2026",
  },
  {
    id: 3,
    name: "Annual Operations Report",
    type: "PDF",
    status: "Processed",
    date: "10 Sep 2026",
  },
  {
    id: 4,
    name: "Infrastructure Inventory",
    type: "XLSX",
    status: "Processed",
    date: "09 Sep 2026",
  },
  {
    id: 5,
    name: "Public Resource Dataset",
    type: "Web",
    status: "Available",
    date: "08 Sep 2026",
  },
];

export const demoDocuments = [
  {
    id: 1,
    name: "Resource Utilization Report.pdf",
    type: "PDF",
    pages: 24,
    status: "Analyzed",
  },
  {
    id: 2,
    name: "Department Workload Data.csv",
    type: "CSV",
    pages: "-",
    status: "Analyzed",
  },
  {
    id: 3,
    name: "Annual Operations Report.pdf",
    type: "PDF",
    pages: 38,
    status: "Analyzed",
  },
  {
    id: 4,
    name: "Infrastructure Inventory.xlsx",
    type: "XLSX",
    pages: "-",
    status: "Analyzed",
  },
];

export const demoInsights = [
  {
    id: 1,
    title: "Resource Under-Utilization",
    category: "Optimization",
    severity: "Medium",
    description:
      "Several available resources are being used below their expected capacity. Better allocation could improve overall utilization without requiring additional resources.",
  },
  {
    id: 2,
    title: "Workload Imbalance",
    category: "Efficiency",
    severity: "High",
    description:
      "The workload data indicates that some teams are handling significantly more tasks than others. Redistributing suitable tasks could reduce bottlenecks.",
  },
  {
    id: 3,
    title: "Operational Bottleneck",
    category: "Risk",
    severity: "High",
    description:
      "A recurring processing bottleneck has been identified in the operational workflow. This may increase completion time and affect downstream activities.",
  },
  {
    id: 4,
    title: "Duplicate Resources",
    category: "Optimization",
    severity: "Low",
    description:
      "Similar resources appear across multiple departments. Consolidating or sharing selected resources may reduce duplication and improve utilization.",
  },
  {
    id: 5,
    title: "Optimization Opportunity",
    category: "Recommendation",
    severity: "Medium",
    description:
      "The available information suggests that resource allocation can be improved through better demand forecasting and workload-based distribution.",
  },
];

export const demoResources = [
  {
    id: 1,
    name: "Team Alpha",
    type: "Human Resource",
    utilization: 82,
    status: "Healthy",
  },
  {
    id: 2,
    name: "Compute Cluster A",
    type: "Infrastructure",
    utilization: 91,
    status: "High Usage",
  },
  {
    id: 3,
    name: "Storage Pool B",
    type: "Infrastructure",
    utilization: 48,
    status: "Under-utilized",
  },
  {
    id: 4,
    name: "Analytics Team",
    type: "Human Resource",
    utilization: 67,
    status: "Healthy",
  },
  {
    id: 5,
    name: "Software License Group",
    type: "Software",
    utilization: 39,
    status: "Under-utilized",
  },
];

export const demoAutomations = [
  {
    id: 1,
    name: "High Risk Alert",
    trigger: "Risk score becomes high",
    action: "Send alert",
    enabled: true,
  },
  {
    id: 2,
    name: "Resource Overload",
    trigger: "Utilization exceeds 90%",
    action: "Generate warning",
    enabled: true,
  },
  {
    id: 3,
    name: "New Report Analysis",
    trigger: "New document uploaded",
    action: "Run AI analysis",
    enabled: false,
  },
  {
    id: 4,
    name: "Weekly Insight Report",
    trigger: "Every Monday",
    action: "Generate report",
    enabled: true,
  },
];

export const demoReports = [
  {
    id: 1,
    name: "Weekly Resource Intelligence Report",
    date: "09 Sep 2026",
    type: "AI Analysis",
  },
  {
    id: 2,
    name: "Department Efficiency Report",
    date: "05 Sep 2026",
    type: "Optimization",
  },
  {
    id: 3,
    name: "Infrastructure Utilization Report",
    date: "01 Sep 2026",
    type: "Resource Analysis",
  },
];

export const demoAssistantQuestions = [
  "What are the biggest resource inefficiencies?",
  "Which resources are under-utilized?",
  "Where are the major bottlenecks?",
  "What should be optimized first?",
];

export const demoAssistantAnswer = {
  question: "What are the biggest resource inefficiencies?",
  answer:
    "The main inefficiencies are under-utilized resources, workload imbalance between teams, and high utilization in selected infrastructure resources. Improving resource allocation and redistributing suitable workloads could increase overall efficiency.",
};
