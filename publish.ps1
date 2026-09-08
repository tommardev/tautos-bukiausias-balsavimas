param(
  [string]$slug = "holy-osprey-fgkw"
)

$apiKey = (Get-Content "$HOME\.herenow\credentials").Trim()
$headers = @{
  "Authorization" = "Bearer $apiKey"
  "Content-Type" = "application/json"
  "X-HereNow-Client" = "antigravity/direct-api"
}

$f1 = Get-Item "index.html"
$f2 = Get-Item "style.css"
$f3 = Get-Item "app.js"

$bodyObj = @{
  files = @(
    @{ path = "index.html"; size = $f1.Length; contentType = "text/html; charset=utf-8" },
    @{ path = "style.css"; size = $f2.Length; contentType = "text/css; charset=utf-8" },
    @{ path = "app.js"; size = $f3.Length; contentType = "text/javascript; charset=utf-8" }
  )
  displayName = "Tautos Bukiausias 2026"
  displayDescription = "Oficialus TV3 laidos Tautos bukiausias balsavimas"
}

if ($slug) {
  Write-Host "1. Updating existing site version for '$slug'..."
  $res = Invoke-RestMethod -Uri "https://here.now/api/v1/publish/$slug" -Method Put -Headers $headers -Body ($bodyObj | ConvertTo-Json -Depth 5)
} else {
  Write-Host "1. Creating new site version..."
  $res = Invoke-RestMethod -Uri "https://here.now/api/v1/publish" -Method Post -Headers $headers -Body ($bodyObj | ConvertTo-Json -Depth 5)
}

Write-Host "Target: $($res.siteUrl)"

Write-Host "2. Uploading files..."
foreach ($item in $res.upload.uploads) {
  $filePath = Join-Path (Get-Location) $item.path
  $fileBytes = [System.IO.File]::ReadAllBytes($filePath)
  $req = [System.Net.HttpWebRequest]::Create($item.url)
  $req.Method = "PUT"
  $req.ContentType = $item.headers."Content-Type"
  $req.ContentLength = $fileBytes.Length
  $stream = $req.GetRequestStream()
  $stream.Write($fileBytes, 0, $fileBytes.Length)
  $stream.Close()
  $resp = $req.GetResponse()
  Write-Host "Uploaded $($item.path) -> Status: $($resp.StatusCode)"
  $resp.Close()
}

Write-Host "3. Finalizing..."
$finalizeHeaders = @{
  "Authorization" = "Bearer $apiKey"
  "Content-Type" = "application/json"
}
$finalizeBody = @{ versionId = $res.upload.versionId } | ConvertTo-Json
$finalRes = Invoke-RestMethod -Uri $res.upload.finalizeUrl -Method Post -Headers $finalizeHeaders -Body $finalizeBody

Write-Host "`n🎉 SITE DEPLOYED SUCCESSFULLY!"
Write-Host "Live URL: $($finalRes.siteUrl)"
