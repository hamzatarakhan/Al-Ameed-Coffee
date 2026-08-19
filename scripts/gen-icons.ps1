Add-Type -AssemblyName System.Drawing

$imgDir = "C:\Users\HamzaTarkan\Downloads\Bon al ameed\al-ameed-app\assets\images"
$logoPath = Join-Path $imgDir "logo.png"
$cream = [System.Drawing.Color]::FromArgb(255, 250, 246, 240)  # #FAF6F0, matches splash's light bg

function New-IconCanvas {
    param(
        [int]$Size,
        [System.Drawing.Color]$BackgroundColor,
        [bool]$Transparent,
        [double]$LogoWidthFraction,
        [string]$OutPath,
        [bool]$Monochrome = $false
    )
    $logo = New-Object System.Drawing.Bitmap($logoPath)

    $canvas = New-Object System.Drawing.Bitmap($Size, $Size)
    $g = [System.Drawing.Graphics]::FromImage($canvas)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    if (-not $Transparent) {
        $brush = New-Object System.Drawing.SolidBrush($BackgroundColor)
        $g.FillRectangle($brush, 0, 0, $Size, $Size)
        $brush.Dispose()
    }

    $logoW = $Size * $LogoWidthFraction
    $logoH = $logoW * $logo.Height / $logo.Width
    $x = ($Size - $logoW) / 2
    $y = ($Size - $logoH) / 2

    if ($Monochrome) {
        # Recolor every non-transparent pixel to white, preserving alpha —
        # this is what Android's themed/monochrome icon layer expects.
        $mono = New-Object System.Drawing.Bitmap($logo.Width, $logo.Height)
        for ($py = 0; $py -lt $logo.Height; $py++) {
            for ($px = 0; $px -lt $logo.Width; $px++) {
                $p = $logo.GetPixel($px, $py)
                $mono.SetPixel($px, $py, [System.Drawing.Color]::FromArgb($p.A, 255, 255, 255))
            }
        }
        $g.DrawImage($mono, $x, $y, $logoW, $logoH)
        $mono.Dispose()
    } else {
        $g.DrawImage($logo, $x, $y, $logoW, $logoH)
    }

    $g.Dispose()
    $logo.Dispose()
    $canvas.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $canvas.Dispose()
    Write-Output "wrote $OutPath"
}

# iOS app icon — solid background (no alpha), logo fills most of the canvas.
New-IconCanvas -Size 1024 -BackgroundColor $cream -Transparent $false -LogoWidthFraction 0.78 -OutPath (Join-Path $imgDir "icon.png")

# Android adaptive icon foreground — transparent, sized within the ~66% safe
# zone so it survives the system's circular/square/rounded-square masking.
New-IconCanvas -Size 512 -BackgroundColor $cream -Transparent $true -LogoWidthFraction 0.5 -OutPath (Join-Path $imgDir "android-icon-foreground.png")

# Android adaptive icon background layer — flat brand color, no logo.
New-IconCanvas -Size 512 -BackgroundColor $cream -Transparent $false -LogoWidthFraction 0 -OutPath (Join-Path $imgDir "android-icon-background.png")

# Android 13+ themed/monochrome icon — white silhouette, transparent bg.
New-IconCanvas -Size 432 -BackgroundColor $cream -Transparent $true -LogoWidthFraction 0.5 -OutPath (Join-Path $imgDir "android-icon-monochrome.png") -Monochrome $true

# Web favicon.
New-IconCanvas -Size 48 -BackgroundColor $cream -Transparent $false -LogoWidthFraction 0.82 -OutPath (Join-Path $imgDir "favicon.png")

Write-Output "done"
