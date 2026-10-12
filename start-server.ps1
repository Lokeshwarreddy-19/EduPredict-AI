$ErrorActionPreference = "Stop"

$serverAddress = "http://127.0.0.1:8765/"
$serverRoot = $PSScriptRoot
$ollamaAddress = "http://127.0.0.1:11434"

function Send-JsonResponse {
    param(
        [System.Net.HttpListenerResponse] $Response,
        [int] $StatusCode,
        [object] $Payload
    )

    $json = ConvertTo-Json -InputObject $Payload -Depth 8 -Compress
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
    $Response.StatusCode = $StatusCode
    $Response.ContentType = "application/json; charset=utf-8"
    $Response.ContentLength64 = $bytes.Length
    $Response.OutputStream.Write($bytes, 0, $bytes.Length)
}

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add($serverAddress)
try {
    $listener.Start()
}
catch {
    Write-Error "Couldn't start the local server at $serverAddress. Check whether another app is using port 8765. $($_.Exception.Message)"
    exit 1
}

$url = "http://localhost:8765/"
Write-Host "EduPredict AI is running at $url" -ForegroundColor Green
Write-Host "Local Ollama API: $ollamaAddress" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the local server." -ForegroundColor DarkGray
Start-Process $url

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        try {
            if ($request.Url.AbsolutePath -eq "/api/tags" -and $request.HttpMethod -eq "GET") {
                try {
                    $ollamaResult = Invoke-RestMethod -Uri "$ollamaAddress/api/tags" -TimeoutSec 6
                    Send-JsonResponse -Response $response -StatusCode 200 -Payload $ollamaResult
                }
                catch {
                    $detail = $_.Exception.Message
                    Write-Warning "Ollama model check failed: $detail"
                    Send-JsonResponse -Response $response -StatusCode 502 -Payload @{ error = "Could not connect to Ollama at $ollamaAddress. Start Ollama and try again."; detail = $detail }
                }
                continue
            }

            if ($request.Url.AbsolutePath -eq "/api/chat") {
                if ($request.HttpMethod -ne "POST") {
                    Send-JsonResponse -Response $response -StatusCode 405 -Payload @{ error = "The local AI endpoint accepts POST requests only." }
                    continue
                }
                if ($request.ContentLength64 -gt 65536) {
                    Send-JsonResponse -Response $response -StatusCode 413 -Payload @{ error = "The AI request is too large. Please shorten your question and try again." }
                    continue
                }

                $reader = [System.IO.StreamReader]::new($request.InputStream, $request.ContentEncoding)
                $requestBody = $reader.ReadToEnd()
                $payload = $requestBody | ConvertFrom-Json
                $question = [string]$payload.question
                $model = [string]$payload.model
                $knownModels = @("llama3.2:latest", "llama3.2", "qwen3:4b")
                if ([string]::IsNullOrWhiteSpace($question) -or $question.Length -gt 500) {
                    Send-JsonResponse -Response $response -StatusCode 400 -Payload @{ error = "Please enter a question of 500 characters or fewer." }
                    continue
                }
                if ($knownModels -notcontains $model -and $model -notmatch '^[A-Za-z0-9][A-Za-z0-9._:-]{0,100}$') {
                    Send-JsonResponse -Response $response -StatusCode 400 -Payload @{ error = "The selected Ollama model name is invalid." }
                    continue
                }

                $contextData = $payload.context | ConvertTo-Json -Depth 6 -Compress
                $systemPrompt = "You are EduPredict AI, a concise, warm academic study coach. Give practical, encouraging and evidence-informed guidance. Never claim that a prediction is certain, that you trained a model, or that you are a human counselor. Do not repeat sensitive details unnecessarily. Keep replies to about 120 words or less. The student's self-reported, unverified check-in context is: $contextData"
                $ollamaBody = @{
                    model = $model
                    messages = @(
                        @{ role = "system"; content = $systemPrompt },
                        @{ role = "user"; content = $question }
                    )
                    stream = $false
                    think = $false
                    options = @{
                        temperature = 0.2
                        num_predict = 220
                    }
                } | ConvertTo-Json -Depth 8 -Compress

                try {
                    $ollamaResult = Invoke-RestMethod -Uri "$ollamaAddress/api/chat" -Method Post -ContentType "application/json; charset=utf-8" -Body $ollamaBody -TimeoutSec 90
                    $content = [string]$ollamaResult.message.content
                    if ([string]::IsNullOrWhiteSpace($content)) {
                        throw "Ollama returned an empty answer. Please retry or select another local model."
                    }
                    Send-JsonResponse -Response $response -StatusCode 200 -Payload @{ response = $content.Trim(); model = $ollamaResult.model }
                }
                catch {
                    $detail = $_.Exception.Message
                    Write-Warning "Ollama chat request failed: $detail"
                    $message = if ($detail -match "404|not found") { "That Ollama model isn't available. Check the model name and run ollama pull $model." } else { "Ollama couldn't complete the request. Check that the selected model is installed and try again." }
                    Send-JsonResponse -Response $response -StatusCode 502 -Payload @{ error = $message; detail = $detail }
                }
                continue
            }

            if ($request.HttpMethod -ne "GET" -and $request.HttpMethod -ne "HEAD") {
                Send-JsonResponse -Response $response -StatusCode 405 -Payload @{ error = "This method is not supported." }
                continue
            }

            $relativePath = [System.Uri]::UnescapeDataString($request.Url.AbsolutePath.TrimStart("/"))
            if ([string]::IsNullOrWhiteSpace($relativePath)) {
                $relativePath = "index.html"
            }
            $resolvedPath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($serverRoot, $relativePath))
            $rootWithSeparator = [System.IO.Path]::GetFullPath($serverRoot).TrimEnd([System.IO.Path]::DirectorySeparatorChar) + [System.IO.Path]::DirectorySeparatorChar
            if (-not $resolvedPath.StartsWith($rootWithSeparator, [System.StringComparison]::OrdinalIgnoreCase) -or -not (Test-Path -LiteralPath $resolvedPath -PathType Leaf)) {
                $response.StatusCode = 404
                $response.Close()
                continue
            }

            $contentType = switch ([System.IO.Path]::GetExtension($resolvedPath).ToLowerInvariant()) {
                ".html" { "text/html; charset=utf-8" }
                ".css" { "text/css; charset=utf-8" }
                ".js" { "text/javascript; charset=utf-8" }
                ".svg" { "image/svg+xml" }
                ".ico" { "image/x-icon" }
                default { "application/octet-stream" }
            }
            $bytes = [System.IO.File]::ReadAllBytes($resolvedPath)
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.Headers.Add("X-Content-Type-Options", "nosniff")
            $response.Headers.Add("X-Frame-Options", "DENY")
            $response.Headers.Add("Referrer-Policy", "no-referrer")
            $response.Headers.Add("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'")
            $response.Headers.Add("Cache-Control", "no-store")
            if ($request.HttpMethod -eq "GET") {
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
            $response.Close()
        }
        catch {
            $detail = $_.Exception.Message
            Write-Warning "Request failed ($($request.HttpMethod) $($request.Url.AbsolutePath)): $detail"
            if ($response.OutputStream.CanWrite) {
                try {
                    Send-JsonResponse -Response $response -StatusCode 500 -Payload @{ error = "The local EduPredict server encountered an error."; detail = $detail }
                }
                catch {
                    Write-Warning "Could not send error response: $($_.Exception.Message)"
                }
            }
            $response.Close()
        }
    }
}
finally {
    $listener.Stop()
    $listener.Close()
    Write-Host "EduPredict AI server stopped." -ForegroundColor DarkGray
}
