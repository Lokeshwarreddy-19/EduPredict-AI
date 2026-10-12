# EduPredict AI

A private, responsive study-coaching app that turns a 15-step, one-question-at-a-time check-in into an immediate academic-readiness estimate, subject-focus notes, and a practical study plan. Optional follow-up advice uses a model running on your own computer with Ollama.

## Start the app

Requirements: Windows PowerShell 5.1 or later, and [Ollama for Windows](https://ollama.com/download). No npm packages, cloud accounts, or API keys are required.

1. Make sure Ollama is running. In a PowerShell window, check that both models are available:

   ```powershell
   ollama list
   ```

   If needed, download the models:

   ```powershell
   ollama pull llama3.2
   ollama pull qwen3:4b
   ```

2. In PowerShell, start the app from its folder:

   ```powershell
   powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\start-server.ps1
   ```

   This runs the app without changing your computer's PowerShell execution policy.

3. Your browser opens to [http://localhost:8765](http://localhost:8765). Keep the PowerShell window open; press **Ctrl+C** there when you are finished.

Choose a local model using the selector in the top-right corner. The app checks the Ollama server on `127.0.0.1:11434` and displays the installed models. If Ollama is stopped, the questionnaire and instant assessment remain usable, but local AI follow-up needs Ollama running.

## How the assessment works

The check-in takes about 2–3 minutes and collects the 15 answers needed to discuss coursework, prior performance, attendance, study habits, focus, sleep, exam confidence, assignments, wellbeing, and competing commitments. Answers remain in the current browser tab and are cleared when you choose **New check-in**.

The performance score is a transparent, deterministic rules-based estimate, not a trained or validated machine-learning model. Attendance, daily study hours, previous-semester CGPA, assignment habits, revision frequency, and confidence make up the 100-point score; additional self-reported information provides context for the displayed estimates and recommendations. The predicted CGPA and pass/fail probabilities are approximate planning guides, not guaranteed outcomes. The report clearly distinguishes these estimates from measured subject-level predictions.

Optional AI follow-up sends the user's question and a small summary of their check-in to the selected local Ollama model through the PowerShell server. The Ollama API is only used for this follow-up; the questionnaire advances immediately, and the deterministic report is calculated locally in the browser without waiting for a model response.

## Troubleshooting

- **Ollama offline:** Start Ollama, then refresh the browser page. Check `ollama list` to see which models are installed.
- **Port 8765 already in use:** Stop the application using that port, then run `.\start-server.ps1` again.
- **PowerShell script blocked:** From PowerShell, run `powershell -ExecutionPolicy Bypass -File .\start-server.ps1`. This allows this one script to run without changing the system execution policy.
