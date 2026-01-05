param(
    [string]$OutputPath = "$PSScriptRoot/../public/fonts"
)

$fonts = @(
    @{ File = "NotoSansArabic-Regular.ttf"; Url = "https://github.com/google/fonts/raw/main/ofl/notosansarabic/NotoSansArabic-Regular.ttf" },
    @{ File = "NotoSansArabic-Bold.ttf";    Url = "https://github.com/google/fonts/raw/main/ofl/notosansarabic/NotoSansArabic-Bold.ttf" }
)

if (-not (Test-Path $OutputPath)) {
    New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
}

foreach ($font in $fonts) {
    $destination = Join-Path $OutputPath $font.File

    Write-Host "Downloading $($font.File)..."
    Invoke-WebRequest -Uri $font.Url -OutFile $destination -UseBasicParsing
}

Write-Host "Fonts downloaded to $OutputPath"
