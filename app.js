"use strict";

const steps = [
  {
    question: "To start, what semester are you in, and what do you study?",
    fields: [
      { name: "semester", label: "Current semester", type: "select", options: ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8", "Other"] },
      { name: "branch", label: "Branch / course", type: "text", placeholder: "e.g. Computer Science", maxlength: 80 }
    ]
  },
  {
    question: "How did your academics go last semester, and where does your overall CGPA stand?",
    fields: [
      { name: "previousCgpa", label: "Previous semester CGPA", type: "number", min: 0, max: 10, step: 0.01, placeholder: "0.00 — 10.00" },
      { name: "overallCgpa", label: "Overall CGPA", type: "number", min: 0, max: 10, step: 0.01, placeholder: "0.00 — 10.00" }
    ]
  },
  {
    question: "Are you carrying any backlogs? If so, which subjects would you most like to work on?",
    fields: [
      { name: "backlogs", label: "Number of current backlogs", type: "number", min: 0, max: 50, step: 1, placeholder: "0" },
      { name: "backlogSubjects", label: "Subjects to focus on (optional)", type: "text", placeholder: "e.g. Calculus, Physics", maxlength: 140, optional: true }
    ]
  },
  {
    question: "How are your internal assessments and end-of-term exams going?",
    fields: [
      { name: "internalMarks", label: "Average internal marks (%)", type: "number", min: 0, max: 100, step: 1, placeholder: "0 — 100" },
      { name: "externalMarks", label: "Average external marks (%)", type: "number", min: 0, max: 100, step: 1, placeholder: "0 — 100" }
    ]
  },
  {
    question: "How regularly are you attending lectures and labs?",
    fields: [
      { name: "attendance", label: "Current class attendance (%)", type: "number", min: 0, max: 100, step: 1, placeholder: "0 — 100" },
      { name: "labAttendance", label: "Lab attendance (%)", type: "number", min: 0, max: 100, step: 1, placeholder: "0 — 100" }
    ]
  },
  {
    question: "About how many classes do you miss in a typical month?",
    fields: [{ name: "missedClasses", label: "Missed classes per month", type: "number", min: 0, max: 200, step: 1, placeholder: "0" }]
  },
  {
    question: "What does a typical week of studying look like for you?",
    fields: [
      { name: "studyHours", label: "Hours of study each day", type: "number", min: 0, max: 24, step: 0.5, placeholder: "e.g. 3.5" },
      { name: "studyDays", label: "Days you study each week", type: "number", min: 0, max: 7, step: 1, placeholder: "0 — 7" }
    ]
  },
  {
    question: "How do you usually revise, and what does your practice look like?",
    fields: [
      { name: "revision", label: "Revision frequency", type: "select", options: ["Regular (several times a week)", "Weekly", "Sometimes (monthly)", "Never"] },
      { name: "notes", label: "Do you prepare your own notes?", type: "select", options: ["Yes, consistently", "Sometimes", "Not yet"] },
      { name: "practiceQuestions", label: "Practice questions solved per week", type: "number", min: 0, max: 1000, step: 1, placeholder: "e.g. 20" }
    ]
  },
  {
    question: "Roughly how much time do you spend on your phone each day, outside of study?",
    fields: [
      { name: "mobileHours", label: "Total mobile use (hours/day)", type: "number", min: 0, max: 24, step: 0.5, placeholder: "e.g. 4" },
      { name: "socialHours", label: "Social media use (hours/day)", type: "number", min: 0, max: 24, step: 0.5, placeholder: "e.g. 2" }
    ]
  },
  {
    question: "How are your rest and downtime shaping up on a usual day?",
    fields: [
      { name: "sleepHours", label: "Sleep each night (hours)", type: "number", min: 0, max: 24, step: 0.5, placeholder: "e.g. 7.5" },
      { name: "gamingHours", label: "Gaming per day (hours)", type: "number", min: 0, max: 24, step: 0.5, placeholder: "e.g. 1" }
    ]
  },
  {
    question: "When a topic gets challenging, how do you feel about your understanding and confidence?",
    fields: [
      { name: "understanding", label: "Understanding speed (1–10)", type: "number", min: 1, max: 10, step: 1, placeholder: "1 = slower, 10 = quick" },
      { name: "confidence", label: "Academic confidence (1–10)", type: "number", min: 1, max: 10, step: 1, placeholder: "1 = low, 10 = high" }
    ]
  },
  {
    question: "How anxious do exams make you feel, on an average?",
    fields: [{ name: "anxiety", label: "Exam anxiety (1–10)", type: "number", min: 1, max: 10, step: 1, placeholder: "1 = relaxed, 10 = very anxious" }]
  },
  {
    question: "How are you keeping up with assignments and projects?",
    fields: [
      { name: "assignments", label: "Assignments submitted on time", type: "select", options: ["Always (90%+)", "Usually (75–89%)", "Sometimes (50–74%)", "Rarely (under 50%)"] },
      { name: "projects", label: "Project completion", type: "select", options: ["On track", "Mostly on track", "A little behind", "Significantly behind"] }
    ]
  },
  {
    question: "Do you practice with previous-year questions, and where do you study best?",
    fields: [
      { name: "previousPapers", label: "Previous-year question practice", type: "select", options: ["Regularly", "Sometimes", "Rarely", "Never"] },
      { name: "environment", label: "Your usual study environment", type: "select", options: ["Quiet and focused", "Mostly calm", "Sometimes distracting", "Often distracting"] }
    ]
  },
  {
    question: "Lastly, is anything else affecting your study time or energy?",
    fields: [
      { name: "partTimeJob", label: "Do you have a part-time job?", type: "select", options: ["No", "Yes, up to 10 hours/week", "Yes, 11–20 hours/week", "Yes, over 20 hours/week"] },
      { name: "health", label: "Any health issues affecting your studies?", type: "select", options: ["No", "Occasionally", "Often"] }
    ]
  }
];

const answers = Object.create(null);
const messages = document.getElementById("chat-messages");
const report = document.getElementById("full-report");
const readinessEmpty = document.getElementById("readiness-empty");
const readinessResult = document.getElementById("readiness-result");
const modelSelect = document.getElementById("model-select");
let currentStep = 0;
let currentReport = null;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function appendAssistant(paragraphs) {
  const article = document.createElement("article");
  article.className = "welcome-message";
  const avatar = document.createElement("span");
  avatar.className = "message-avatar";
  avatar.setAttribute("aria-hidden", "true");
  avatar.textContent = "e";
  const content = document.createElement("div");
  content.className = "message-content";
  for (const paragraph of paragraphs) {
    const line = document.createElement("p");
    line.textContent = paragraph;
    content.append(line);
  }
  article.append(avatar, content);
  messages.append(article);
  article.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function fieldMarkup(field) {
  const id = `field-${field.name}`;
  const required = field.optional ? "" : " required";
  let control;
  if (field.type === "select") {
    const options = field.options.map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("");
    control = `<select id="${id}" name="${field.name}"${required}><option value="" disabled selected>Choose an option</option>${options}</select>`;
  } else {
    const maxLength = field.maxlength ? ` maxlength="${field.maxlength}"` : "";
    const optionalPlaceholder = field.placeholder ? ` placeholder="${escapeHtml(field.placeholder)}"` : "";
    control = `<input id="${id}" name="${field.name}" type="${field.type}"${field.min !== undefined ? ` min="${field.min}" max="${field.max}" step="${field.step}"` : ""}${optionalPlaceholder}${maxLength}${required}>`;
  }
  return `<div class="field-wrap"><label for="${id}">${escapeHtml(field.label)}</label>${control}</div>`;
}

function renderStep(index) {
  const step = steps[index];
  if (!step) return;

  const questionNumber = document.createElement("div");
  questionNumber.className = "question-number";
  questionNumber.textContent = `Question ${index + 1} of ${steps.length}`;
  const form = document.createElement("form");
  form.className = "answer-form";
  form.noValidate = true;
  form.setAttribute("aria-label", `Question ${index + 1}`);
  const prompt = document.createElement("p");
  prompt.className = "answer-prompt";
  prompt.textContent = step.question;
  const fieldContainer = document.createElement("div");
  fieldContainer.className = "form-fields";
  fieldContainer.innerHTML = step.fields.map(fieldMarkup).join("");
  const error = document.createElement("p");
  error.className = "form-error";
  error.setAttribute("role", "alert");
  const button = document.createElement("button");
  button.className = "submit-answer";
  button.type = "submit";
  button.innerHTML = index === steps.length - 1 ? 'See my check-in <span aria-hidden="true">→</span>' : 'Continue <span aria-hidden="true">→</span>';
  form.append(prompt, fieldContainer, error, button);
  messages.append(questionNumber, form);
  document.getElementById("progress-label").textContent = `QUESTION ${String(index + 1).padStart(2, "0")} · YOUR CHECK-IN`;
  document.getElementById("progress-count").innerHTML = `${String(index + 1).padStart(2, "0")} <span>/ ${steps.length}</span>`;
  document.getElementById("progress-fill").style.width = `${((index + 1) / steps.length) * 100}%`;
  form.addEventListener("submit", (event) => submitStep(event, form, error, button, index));
  form.querySelector("input:not([type=hidden]), select, textarea")?.focus({ preventScroll: true });
  form.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function submitStep(event, form, error, button, index) {
  event.preventDefault();
  const step = steps[index];
  const formData = new FormData(form);
  const collected = Object.create(null);
  const displayed = [];
  for (const field of step.fields) {
    const raw = String(formData.get(field.name) ?? "").trim();
    if (!raw && field.optional) continue;
    if (!raw) {
      error.textContent = `Please fill in “${field.label.toLowerCase()}” to continue.`;
      form.querySelector(`[name="${field.name}"]`)?.focus();
      return;
    }
    if (field.type === "number") {
      const number = Number(raw);
      if (!Number.isFinite(number) || number < field.min || number > field.max) {
        error.textContent = `${field.label} needs to be between ${field.min} and ${field.max}.`;
        form.querySelector(`[name="${field.name}"]`)?.focus();
        return;
      }
      collected[field.name] = number;
      displayed.push(`${field.label}: ${number}`);
    } else {
      collected[field.name] = raw;
      displayed.push(`${field.label}: ${raw}`);
    }
  }
  Object.assign(answers, collected);
  const userMessage = document.createElement("div");
  userMessage.className = "user-message";
  userMessage.textContent = displayed.join(" · ");
  form.replaceWith(userMessage);
  const questionLabel = form.previousElementSibling;
  if (questionLabel?.classList.contains("question-number")) questionLabel.remove();
  if (index + 1 < steps.length) {
    currentStep++;
    window.setTimeout(() => {
      appendAssistant([responseFor(index)]);
      renderStep(currentStep);
    }, 130);
  } else {
    window.setTimeout(() => {
      appendAssistant(["Thank you for sharing that with me. I’ve pulled together your personalized check-in and a practical plan to help you move forward."]);
      currentReport = buildReport(answers);
      renderReport(currentReport);
      setNavView("report");
    }, 150);
  }
  error.textContent = "";
  button.disabled = true;
}

function responseFor(index) {
  const prompts = [
    "Thanks for sharing. A little context helps me make the guidance more useful.",
    "Got it. Let’s get a clearer picture of how the semester is going.",
    "Thanks for being open about it. Every detail helps shape your plan.",
    "That’s helpful. Let’s talk about your day-to-day routine next.",
    "Thanks. We’re building a fuller picture, one step at a time.",
    "I appreciate you sharing this. Let’s look at your study habits next.",
    "That’s good to know. A few more details will help tailor your recommendations.",
    "Thanks for checking in. Rest and focus both play a part, too.",
    "We’re making good progress. Let’s look at confidence and understanding.",
    "Thanks for being honest. There’s no wrong answer here.",
    "That context matters. Let’s round things out with how coursework is going.",
    "Almost there. One last question about your schedule and wellbeing.",
    "Thank you. Now, let’s look at your study environment.",
    "One last check-in, then I’ll put your personalized plan together."
  ];
  return prompts[index] || "Thanks, I’ve got it. Let’s keep going.";
}

function scoreInputs(data) {
  const attendancePoints = data.attendance >= 90 ? 20 : data.attendance >= 80 ? 15 : data.attendance >= 70 ? 10 : 0;
  const studyPoints = data.studyHours >= 5 ? 20 : data.studyHours >= 3 ? 15 : data.studyHours >= 1 ? 10 : 0;
  const cgpaPoints = data.previousCgpa >= 8.5 ? 20 : data.previousCgpa >= 7 ? 15 : data.previousCgpa >= 6 ? 10 : 5;
  const assignmentPoints = data.assignments.startsWith("Always") ? 15 : data.assignments.startsWith("Usually") ? 10 : data.assignments.startsWith("Sometimes") ? 5 : 0;
  const revisionPoints = data.revision.startsWith("Regular") ? 15 : data.revision === "Weekly" ? 10 : data.revision.startsWith("Sometimes") ? 5 : 0;
  const confidencePoints = data.confidence >= 8 ? 10 : data.confidence >= 5 ? 5 : 0;
  return {
    attendance: attendancePoints,
    study: studyPoints,
    academics: cgpaPoints,
    assignments: assignmentPoints,
    revision: revisionPoints,
    confidence: confidencePoints,
    total: attendancePoints + studyPoints + cgpaPoints + assignmentPoints + revisionPoints + confidencePoints
  };
}

function bandForScore(score) {
  if (score >= 90) return { label: "Excellent", grade: "A", passMin: 95, passMax: 99, cgpaMin: 8.5, cgpaMax: 10, bandMin: 90, bandMax: 100, risk: "Low" };
  if (score >= 75) return { label: "Good", grade: "B", passMin: 85, passMax: 94, cgpaMin: 7, cgpaMax: 8.5, bandMin: 75, bandMax: 89, risk: "Moderate" };
  if (score >= 60) return { label: "Average", grade: "C", passMin: 70, passMax: 84, cgpaMin: 6, cgpaMax: 7, bandMin: 60, bandMax: 74, risk: "Elevated" };
  if (score >= 40) return { label: "At risk", grade: "D", passMin: 50, passMax: 69, cgpaMin: 4, cgpaMax: 6, bandMin: 40, bandMax: 59, risk: "High" };
  return { label: "High risk", grade: "E", passMin: 0, passMax: 49, cgpaMin: 0, cgpaMax: 4, bandMin: 0, bandMax: 39, risk: "Critical" };
}

function assessRisk(data, score) {
  if (score >= 90) return "Low";
  let severity = score >= 75 ? 1 : score >= 60 ? 2 : score >= 40 ? 3 : 4;
  if (data.attendance < 70) severity = Math.min(4, severity + 1);
  if (data.backlogs > 2 || data.externalMarks < 35 || data.internalMarks < 35) severity = Math.min(4, severity + 1);
  if (data.confidence >= 8 && data.attendance >= 80 && data.backlogs === 0) severity = Math.max(1, severity - 1);
  return ["Low", "Moderate", "Elevated", "High", "Critical"][severity];
}

function linearEstimate(score, band, min, max) {
  const ratio = band.bandMax === band.bandMin ? 0 : (score - band.bandMin) / (band.bandMax - band.bandMin);
  return min + Math.max(0, Math.min(1, ratio)) * (max - min);
}

function buildReport(data) {
  const score = scoreInputs(data);
  const band = bandForScore(score.total);
  const risk = assessRisk(data, score.total);
  const dataPressure = (data.backlogs > 0 ? Math.min(12, data.backlogs * 4) : 0)
    + (data.internalMarks < 50 ? Math.min(8, (50 - data.internalMarks) * 0.2) : 0)
    + (data.externalMarks < 50 ? Math.min(8, (50 - data.externalMarks) * 0.2) : 0)
    + (data.sleepHours < 6 ? 3 : 0);
  const confidenceBoost = data.confidence >= 8 && data.attendance >= 80 ? 2 : 0;
  const passProbability = Math.round(Math.min(band.passMax, Math.max(band.passMin, linearEstimate(score.total, band, band.passMin, band.passMax) - dataPressure + confidenceBoost)));
  const cgpa = Math.min(10, Math.max(0, linearEstimate(score.total, band, band.cgpaMin, band.cgpaMax) - dataPressure * 0.025));
  const percentage = Math.round(Math.min(100, cgpa * 9.5));
  const strengths = [];
  const weaknesses = [];
  if (data.attendance >= 80) strengths.push(`Your ${data.attendance}% class attendance gives you a solid connection to lectures; keep aiming for 90% or higher.`);
  else weaknesses.push(`At ${data.attendance}% attendance, missed class time may make it harder to keep up. Set a weekly attendance goal of at least 80%, then work toward 90%.`);
  if (data.studyHours >= 3 && data.studyDays >= 5) strengths.push(`${data.studyHours} study hours across ${data.studyDays} days a week is a consistent foundation.`);
  else weaknesses.push(`Build a steadier rhythm: aim for focused study on five days each week, increasing daily time gradually from your current ${data.studyHours} hours.`);
  if (data.previousCgpa >= 7) strengths.push(`Your previous-semester CGPA of ${data.previousCgpa.toFixed(2)} gives you an academic base to build on.`);
  else weaknesses.push(`Your previous-semester CGPA of ${data.previousCgpa.toFixed(2)} suggests that targeted review of foundational topics could help.`);
  if (data.assignments.startsWith("Always") || data.assignments.startsWith("Usually")) strengths.push(`Staying on top of assignments helps reinforce the material before exams.`);
  else weaknesses.push(`Breaking each assignment into an early start, one work session, and a final check can help you submit more consistently.`);
  if (data.revision.startsWith("Regular") || data.revision === "Weekly") strengths.push("Regular revision gives you more chances to remember and apply what you learn.");
  else weaknesses.push("Short weekly review sessions can prevent topics from piling up before exams.");
  if (data.confidence >= 7) strengths.push(`Your confidence (${data.confidence}/10) is a helpful resource when approaching challenging topics.`);
  if (data.labAttendance < 80) weaknesses.push(`Your ${data.labAttendance}% lab attendance is worth building up with a practical catch-up and attendance plan.`);
  if (data.backlogs > 0) weaknesses.push(`You mentioned ${data.backlogs} backlog${data.backlogs === 1 ? "" : "s"}${data.backlogSubjects ? ` (${data.backlogSubjects})` : ""}; set aside a small, protected weekly block for these subjects.`);
  if (data.internalMarks < 50 || data.externalMarks < 50) weaknesses.push(`Use ${data.internalMarks < 50 ? "internal assessments" : "external exams"} as a guide: note the topics that cost marks and seek feedback early.`);
  if (data.sleepHours < 7) weaknesses.push(`Your ${data.sleepHours} hours of sleep may affect focus. If possible, move toward a consistent 7–9-hour sleep schedule.`);
  if (!strengths.length) strengths.push("Completing this check-in is a positive first step. Your willingness to reflect gives you something useful to build on.");
  if (!weaknesses.length) weaknesses.push("No major concerns stood out in your answers. Keep your habits steady and check in with yourself as exams approach.");

  const plan = [];
  const hoursTarget = data.studyHours < 2 ? 2 : Math.min(8, Math.ceil(data.studyHours + 1));
  plan.push(`Plan for ${hoursTarget} focused study hours a day, on at least five days each week. Increase your current routine gradually rather than trying to change everything at once.`);
  plan.push(`After each lecture, spend 20–30 minutes reviewing your notes. Add two short weekly revision sessions for the topics that feel least familiar.`);
  plan.push(`Protect one distraction-light study block each day: put your phone out of reach and use a 25-minute focus block followed by a 5-minute break.`);
  if (data.backlogs > 0) plan.push(`Set aside three sessions a week for${data.backlogSubjects ? ` ${data.backlogSubjects}` : " your backlog subjects"}, and break each topic into small, testable goals.`);
  else plan.push("Use one weekly session to work through practice questions and previous-year papers under a gentle time limit.");
  if (data.anxiety >= 7) plan.push("Before exams, try brief timed practice followed by slow breathing. Ask a trusted teacher or student-support service for additional help if anxiety is making it hard to study.");
  if (data.projects.toLowerCase().includes("behind")) plan.push("Split your project into small milestones, and arrange a check-in with your project partner or supervisor this week.");
  if (data.partTimeJob !== "No") plan.push("Fit study blocks around work: reserve two specific, repeatable sessions on lighter workdays instead of relying on leftover time.");

  const subjectRisks = [];
  if (data.backlogSubjects) {
    for (const subject of data.backlogSubjects.split(/[,;]+/).map((name) => name.trim()).filter(Boolean).slice(0, 5)) {
      subjectRisks.push({ subject, risk: "Focused support needed", advice: "Prioritize one small foundational topic at a time; practice a few questions and ask for help when you get stuck." });
    }
  }
  if (data.internalMarks < 50 || data.externalMarks < 50) {
    subjectRisks.push({ subject: "Current course assessments", risk: "Review advised", advice: `Your average internal/external marks are ${data.internalMarks}% / ${data.externalMarks}%. Review your marked papers to identify specific topics that need attention.` });
  }
  if (!subjectRisks.length) {
    subjectRisks.push({ subject: "No individual subjects assessed", risk: "More detail needed", advice: "This check-in does not collect subject-specific marks. For a more accurate subject risk check, note each course’s recent assessment results and compare them with its passing requirement." });
  }

  const strengthsRating = Math.min(100, Math.round((data.attendance + data.labAttendance + data.internalMarks + data.externalMarks) / 4));
  const studyRating = Math.min(100, Math.round(data.studyHours / 6 * 100));
  const habitsRating = Math.round((score.assignments / 15 * 45) + (score.revision / 15 * 35) + (data.previousPapers === "Regularly" ? 20 : data.previousPapers === "Sometimes" ? 12 : data.previousPapers === "Rarely" ? 5 : 0));

  return {
    score, band, risk, passProbability, failProbability: 100 - passProbability, cgpa,
    percentage, strengths, weaknesses, plan, subjectRisks, hoursTarget,
    pulse: {
      attendance: Math.round(data.attendance),
      study: studyRating,
      academics: Math.round((data.overallCgpa * 10 + data.internalMarks + data.externalMarks) / 3),
      habits: habitsRating
    },
    strengthsRating
  };
}

function updateDashboard(result) {
  readinessEmpty.classList.add("hidden");
  readinessResult.classList.remove("hidden");
  const scoreRing = document.getElementById("score-ring");
  scoreRing.style.setProperty("--score-angle", `${result.score.total * 3.6}deg`);
  document.getElementById("score-value").textContent = String(result.score.total);
  document.getElementById("score-status").textContent = result.band.label;
  document.getElementById("sidebar-pass").textContent = `${result.passProbability}%`;
  document.getElementById("sidebar-cgpa").textContent = result.cgpa.toFixed(2);
  document.getElementById("sidebar-risk").textContent = result.risk;
  document.getElementById("pulse-tag").textContent = `${result.band.label.toUpperCase()} · CLASS ${result.band.grade}`;
  document.getElementById("pulse-caption").innerHTML = `<span class="caption-dot"></span> An instant snapshot, based on ${escapeHtml(answers.attendance)}% attendance and ${escapeHtml(answers.studyHours)} daily study hours.`;
  for (const [key, value] of Object.entries(result.pulse)) {
    const bar = document.getElementById(`bar-${key}`);
    if (bar) bar.style.height = `${Math.max(4, Math.min(100, value))}%`;
  }
}

function renderReport(result) {
  const subjectRows = result.subjectRisks.map((subject) => `<div class="subject-row"><span><strong>${escapeHtml(subject.subject)}</strong><br><span class="risk-pill ${riskClass(result.risk)}">${escapeHtml(subject.risk)}</span></span><span>${escapeHtml(subject.advice)}</span></div>`).join("");
  const riskClassName = riskClass(result.risk);
  const bulletList = (items) => `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  report.innerHTML = `
    <div class="report-header">
      <div><span class="eyebrow">✳ &nbsp; YOUR PERSONALIZED CHECK-IN</span><h2>${escapeHtml(answers.branch)} · ${escapeHtml(answers.semester)}</h2><p>A clear-eyed estimate based on what you shared. Think of this as a helpful starting point for planning—not a promise of exam results.</p></div>
      <div class="report-actions"><button class="secondary-button" id="print-report" type="button">Print / save PDF</button><button class="secondary-button" id="start-over" type="button">New check-in</button></div>
    </div>
    <div class="report-kpis">
      <div class="report-kpi"><span>Performance score</span><strong>${result.score.total}<small>/100</small></strong><small>${escapeHtml(result.band.label)} · Class ${result.band.grade}</small></div>
      <div class="report-kpi"><span>Estimated pass probability</span><strong>${result.passProbability}%</strong><small>Estimated fail probability: ${result.failProbability}%</small></div>
      <div class="report-kpi"><span>Predicted semester CGPA</span><strong>${result.cgpa.toFixed(2)}</strong><small>Approx. ${result.percentage}% (${(result.cgpaMin || result.band.cgpaMin * 9.5).toFixed(0)}–${(result.band.cgpaMax * 9.5).toFixed(0)}% band)</small></div>
      <div class="report-kpi"><span>Academic risk level</span><strong><span class="risk-pill ${riskClassName}">${escapeHtml(result.risk)}</span></strong><small>${result.score.total < 60 || result.risk === "High" || result.risk === "Critical" ? "Early action could make a difference" : "Keep your progress steady"}</small></div>
    </div>
    <div class="report-columns">
      <section class="report-section"><h3><span class="section-icon">✦</span> What’s working</h3>${bulletList(result.strengths)}</section>
      <section class="report-section"><h3><span class="section-icon">◌</span> Opportunities to grow</h3>${bulletList(result.weaknesses)}</section>
      <section class="report-section section-full"><h3><span class="section-icon">⌁</span> Your practical study plan</h3><ol>${result.plan.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol><p class="report-disclaimer"><strong>Recommended study time:</strong> aim for ${result.hoursTarget} focused hours per day across at least five days each week; adjust to your timetable and wellbeing.</p></section>
      <section class="report-section"><h3><span class="section-icon">◷</span> A more manageable attendance routine</h3>${bulletList(attendanceTips(answers))}</section>
      <section class="report-section"><h3><span class="section-icon">◇</span> Prepare for exams with intention</h3>${bulletList(examTips(answers))}</section>
      <section class="report-section section-full"><h3><span class="section-icon">⌖</span> Subject-wise risk analysis</h3><div>${subjectRows}</div><p class="report-disclaimer">Individual subject marks and pass requirements weren’t collected. Subject-level risk is only estimated where you named backlog subjects or shared below-target assessment results.</p></section>
    </div>
    <section class="ai-panel" aria-labelledby="ai-heading">
      <h3 id="ai-heading">Ask your local AI study coach</h3>
      <p>Have a follow-up question? ${escapeHtml(modelSelect.value)} runs privately on your computer. Your check-in result appears immediately; AI advice is optional.</p>
      <form class="ask-row" id="ai-form"><label class="visually-hidden" for="ai-question">Ask the study coach a question</label><input class="ask-input" id="ai-question" name="question" maxlength="500" required placeholder="e.g. How could I fit revision around my part-time job?"><button class="primary-button" id="ai-submit" type="submit">Ask AI <span aria-hidden="true">→</span></button></form>
      <div id="ai-result" aria-live="polite"></div>
    </section>
    <p class="report-disclaimer">This is a transparent, rule-based academic-planning estimate, not a trained or validated machine-learning model. Results are uncertain and depend on information you provided. For support with academic requirements, speak with your instructors or academic adviser${answers.health !== "No" ? "; if your health is affecting your studies, consider contacting an appropriate health or student-support professional" : ""}. Local AI advice is generated by Ollama and may be imperfect.</p>`;

  updateDashboard(result);
  report.classList.remove("hidden");
  report.querySelector("#print-report").addEventListener("click", () => window.print());
  report.querySelector("#start-over").addEventListener("click", startOver);
  report.querySelector("#ai-form").addEventListener("submit", askLocalAI);
  document.getElementById("breadcrumb-current").textContent = "Performance report";
  window.setTimeout(() => report.scrollIntoView({ behavior: "smooth", block: "start" }), 180);
}

function riskClass(risk) {
  return ({ Low: "low", Moderate: "moderate", Elevated: "elevated", High: "high", Critical: "critical" })[risk] || "moderate";
}

function attendanceTips(data) {
  const tips = [];
  if (data.attendance < 90) tips.push("Choose a realistic weekly attendance goal and schedule classes as non-negotiable calendar commitments.");
  if (data.missedClasses > 4) tips.push(`You mentioned around ${data.missedClasses} missed classes a month. After any unavoidable absence, ask a classmate for notes and review the topic within 48 hours.`);
  if (data.labAttendance < 80) tips.push("Prioritize the next lab sessions and arrange a catch-up with your instructor about any missed practicals.");
  if (data.environment.includes("distract")) tips.push("Prepare your bag and notes the night before, and ask about a library or quiet study space if one is available.");
  if (!tips.length) tips.push("Keep your attendance consistent, and make time to review lecture notes on the same day while ideas are fresh.");
  return tips;
}

function examTips(data) {
  const tips = [];
  if (data.previousPapers === "Never" || data.previousPapers === "Rarely") tips.push("Begin with one past-paper question each week; check your answer against your notes, then add another as your confidence grows.");
  else tips.push("Use past papers to find recurring question styles. Review your mistakes and revisit the underlying ideas, not only the answers.");
  if (data.anxiety >= 7) tips.push("Practice one short, timed section at a time and take a few slow breaths between sections. If exam anxiety feels unmanageable, ask a trusted adviser about support.");
  if (data.confidence <= 5) tips.push("Build confidence by explaining one topic in your own words, then doing a few questions on that topic before moving on.");
  tips.push("A few days before each exam, make a short list of the three topics that need the most review and schedule focused sessions for them.");
  return tips;
}

async function askLocalAI(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const questionInput = form.elements.namedItem("question");
  const submit = document.getElementById("ai-submit");
  const responseArea = document.getElementById("ai-result");
  const question = questionInput.value.trim();
  if (!question || !currentReport) return;
  submit.disabled = true;
  responseArea.innerHTML = '<p class="assistant-error"><span class="pulse-loader"></span>Thinking locally, on your device…</p>';
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: modelSelect.value,
        question,
        context: {
          semester: answers.semester,
          branch: answers.branch,
          performanceScore: currentReport.score.total,
          passProbability: currentReport.passProbability,
          predictedCGPA: Number(currentReport.cgpa.toFixed(2)),
          riskLevel: currentReport.risk,
          studyHours: answers.studyHours,
          studyDays: answers.studyDays,
          attendance: answers.attendance,
          confidence: answers.confidence,
          backlogs: answers.backlogs,
          strengths: currentReport.strengths.slice(0, 3),
          improvementAreas: currentReport.weaknesses.slice(0, 3)
        }
      })
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || `Local AI request failed (${response.status}).`);
    if (typeof payload.response !== "string" || !payload.response.trim()) throw new Error("The selected Ollama model returned an empty reply. Please try again.");
    responseArea.innerHTML = `<div class="ask-response">${escapeHtml(payload.response.trim())}</div>`;
  } catch (error) {
    responseArea.innerHTML = `<p class="assistant-error" role="alert">${escapeHtml(error instanceof Error ? error.message : "Could not reach your local AI. Check that Ollama is running and try again.")}</p>`;
  } finally {
    submit.disabled = false;
    questionInput.focus();
  }
}

async function checkOllama() {
  const dot = document.getElementById("model-dot");
  const status = document.getElementById("model-status");
  try {
    const response = await fetch("/api/tags", { signal: AbortSignal.timeout(5000) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Ollama is unavailable.");
    const modelNames = (Array.isArray(result.models) ? result.models : []).map((model) => model.name);
    for (const modelName of modelNames) {
      if (!Array.from(modelSelect.options).some((option) => option.value === modelName)) {
        const option = document.createElement("option");
        option.value = modelName;
        option.textContent = modelName;
        modelSelect.append(option);
      }
    }
    const available = Array.from(modelSelect.options).map((option) => option.value);
    if (!available.includes(modelSelect.value)) {
      const preferred = available.find((name) => name.startsWith("llama3.2")) || available[0];
      if (preferred) modelSelect.value = preferred;
    }
    if (!modelNames.some((name) => name === modelSelect.value || `${name}:latest` === modelSelect.value)) {
      const firstAvailable = modelNames.find((name) => available.includes(name)) || modelNames[0];
      if (firstAvailable) modelSelect.value = firstAvailable;
    }
    dot.className = `model-dot${modelNames.length ? " online" : " offline"}`;
    status.className = `model-status${modelNames.length ? " online" : ""}`;
    status.textContent = modelNames.length ? "Ollama ready" : "No models found";
    if (modelNames.length === 0) status.title = "Start Ollama and pull a model, then refresh this page.";
  } catch {
    dot.className = "model-dot offline";
    status.className = "model-status";
    status.textContent = "Ollama offline";
    status.title = "Start Ollama and refresh this page to enable local AI replies.";
  }
}

function setNavView(view) {
  for (const link of document.querySelectorAll(".nav-link")) {
    const selected = link.dataset.view === view;
    link.classList.toggle("active", selected);
    if (selected) document.getElementById("breadcrumb-current").textContent = link.textContent.trim();
  }
  if (view === "report" && !report.classList.contains("hidden")) {
    window.setTimeout(() => report.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }
}

function startOver() {
  for (const key of Object.keys(answers)) delete answers[key];
  currentReport = null;
  currentStep = 0;
  messages.replaceChildren();
  report.replaceChildren();
  report.classList.add("hidden");
  readinessEmpty.classList.remove("hidden");
  readinessResult.classList.add("hidden");
  document.getElementById("progress-label").textContent = "LET’S GET TO KNOW YOU";
  document.getElementById("progress-count").innerHTML = '01 <span>/ 15</span>';
  document.getElementById("progress-fill").style.width = `${100 / steps.length}%`;
  document.getElementById("pulse-tag").textContent = "GETTING READY";
  document.getElementById("pulse-caption").innerHTML = '<span class="caption-dot"></span> Your personal overview appears after your check-in.';
  for (const key of ["attendance", "study", "academics", "habits"]) document.getElementById(`bar-${key}`).style.height = "0";
  appendAssistant([
    "🎓 Welcome to EduPredict AI. I’ll help you reflect on your study habits, understand where you’re at, and build a practical plan for your semester.",
    "It takes about 2–3 minutes, and your answers stay on this device. Ready when you are."
  ]);
  setNavView("assessment");
  renderStep(0);
  document.querySelector(".chat-card").scrollIntoView({ behavior: "smooth", block: "start" });
}

document.getElementById("theme-toggle").addEventListener("click", () => {
  const dark = document.body.classList.toggle("dark-mode");
  const button = document.getElementById("theme-toggle");
  button.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  try {
    window.localStorage.setItem("edupredict-theme", dark ? "dark" : "light");
  } catch (error) {
    console.warn("Could not save the theme preference:", error);
  }
});

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    const view = link.dataset.view;
    if (view === "assessment" && currentStep === 0) {
      document.querySelector(".chat-card").scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (view === "report" && report.classList.contains("hidden")) {
      if (currentStep > 0) appendAssistant(["Complete the check-in to see your full personalized report."]);
      document.querySelector(".chat-card").scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setNavView(view);
    if (view === "assessment") document.querySelector(".chat-card").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

try {
  if (window.localStorage.getItem("edupredict-theme") === "dark") {
    document.body.classList.add("dark-mode");
    document.getElementById("theme-toggle").setAttribute("aria-label", "Switch to light mode");
  }
} catch (error) {
  console.warn("Could not load the saved theme preference:", error);
}

appendAssistant([
  "🎓 Welcome to EduPredict AI. I’ll help you reflect on your study habits, understand where you’re at, and build a practical plan for your semester.",
  "It takes about 2–3 minutes, and your answers stay on this device. Ready when you are."
]);
renderStep(0);
checkOllama();
