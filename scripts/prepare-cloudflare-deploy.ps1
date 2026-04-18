param(
  [string]$RepoDir = ".",
  [string]$SiteSlug = "shengcai-20260417",
  [string]$OutputDirName = ".cloudflare-deploy"
)

$ErrorActionPreference = "Stop"

$resolvedRepoDir = (Resolve-Path -LiteralPath $RepoDir).Path
$outputDir = Join-Path $resolvedRepoDir $OutputDirName

if (Test-Path -LiteralPath $outputDir) {
  Remove-Item -LiteralPath $outputDir -Recurse -Force
}

New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

$siteSourceDir = Join-Path $resolvedRepoDir $SiteSlug
if (-not (Test-Path -LiteralPath $siteSourceDir)) {
  throw "Missing site directory: $siteSourceDir"
}

Copy-Item -Path (Join-Path $siteSourceDir "*") -Destination $outputDir -Recurse -Force

$maxAssetSizeBytes = 25MB
$oversizedFiles = Get-ChildItem -Path $outputDir -Recurse -File | Where-Object { $_.Length -gt $maxAssetSizeBytes }

foreach ($file in $oversizedFiles) {
  Write-Warning ("Skipping oversized Cloudflare asset: {0} ({1:N1} MiB)" -f $file.FullName, ($file.Length / 1MB))
  Remove-Item -LiteralPath $file.FullName -Force
}

$noJekyllPath = Join-Path $outputDir ".nojekyll"
New-Item -ItemType File -Path $noJekyllPath -Force | Out-Null

Write-Host "Prepared Cloudflare deploy directory:" $outputDir
