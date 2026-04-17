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

$rootFiles = @(
  "index.html",
  ".nojekyll"
)

foreach ($file in $rootFiles) {
  $sourcePath = Join-Path $resolvedRepoDir $file
  if (-not (Test-Path -LiteralPath $sourcePath)) {
    throw "Missing root publish file: $sourcePath"
  }

  Copy-Item -LiteralPath $sourcePath -Destination $outputDir -Force
}

$siteSourceDir = Join-Path $resolvedRepoDir $SiteSlug
if (-not (Test-Path -LiteralPath $siteSourceDir)) {
  throw "Missing site directory: $siteSourceDir"
}

Copy-Item -LiteralPath $siteSourceDir -Destination $outputDir -Recurse -Force

Write-Host "Prepared Cloudflare deploy directory:" $outputDir
