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

$noJekyllPath = Join-Path $outputDir ".nojekyll"
New-Item -ItemType File -Path $noJekyllPath -Force | Out-Null

Write-Host "Prepared Cloudflare deploy directory:" $outputDir
