
Add-Type -AssemblyName System.Drawing

$imagePath = "C:\Users\Particular\Desktop\Mundo_Magico_LiLi\exemplos\inverter.png"
if (-not (Test-Path $imagePath)) { echo "File not found"; exit }

$bmp = [System.Drawing.Bitmap]::FromFile($imagePath)

# ROI centered roughly on the red mark found (~1229, 594)
$roiX = 1150
$roiY = 520
$roiW = 150
$roiH = 150

$totalR = 0; $totalG = 0; $totalB = 0; $pixelCount = 0
$redX = 0; $redY = 0; $redCount = 0

# Pass 1: Calc Avg Background + Find accurate Red Mark in this ROI
for ($x = $roiX; $x -lt ($roiX + $roiW); $x++) {
    for ($y = $roiY; $y -lt ($roiY + $roiH); $y++) {
        if ($x -ge $bmp.Width -or $y -ge $bmp.Height) { continue }
        $p = $bmp.GetPixel($x, $y)
        
        if ($p.R -gt 200 -and $p.G -lt 60 -and $p.B -lt 60) {
            $redX += $x; $redY += $y; $redCount++
        }
        else {
            $totalR += $p.R
            $totalG += $p.G
            $totalB += $p.B
            $pixelCount++
        }
    }
}

if ($redCount -eq 0) {
    Write-Output "Red mark NOT found in ROI ($roiX, $roiY)."
    exit
}

$redCx = $redX / $redCount
$redCy = $redY / $redCount
$avgR = $totalR / $pixelCount
$avgG = $totalG / $pixelCount
$avgB = $totalB / $pixelCount

Write-Output "Red Mark Center: $redCx, $redCy"
Write-Output "Background Avg: $avgR, $avgG, $avgB"

# Pass 2: Find Foreground (pixels distinct from background)
$minX = 9999; $maxX = 0
$minY = 9999; $maxY = 0
$fgCount = 0

for ($x = $roiX; $x -lt ($roiX + $roiW); $x++) {
    for ($y = $roiY; $y -lt ($roiY + $roiH); $y++) {
        if ($x -ge $bmp.Width -or $y -ge $bmp.Height) { continue }
        $p = $bmp.GetPixel($x, $y)
        
        # Skip Red Mark
        if ($p.R -gt 200 -and $p.G -lt 60 -and $p.B -lt 60) { continue }
        
        # Diff
        $diff = [Math]::Abs($p.R - $avgR) + [Math]::Abs($p.G - $avgG) + [Math]::Abs($p.B - $avgB)
        
        # Threshold: if diff > 100 (significant change)
        if ($diff -gt 100) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
            $fgCount++
        }
    }
}

if ($fgCount -gt 0) {
    # Bounding Box Center
    $bboxCx = ($minX + $maxX) / 2
    $bboxCy = ($minY + $maxY) / 2
    
    Write-Output "Foreground Bounds: X=$minX-$maxX, Y=$minY-$maxY"
    Write-Output "Foreground Center: $bboxCx, $bboxCy"
    
    # Calculate Offset
    # The user wants offsets FROM cursor center TO red mark
    # OffsetX = RedX - CursorCenterX
    # OffsetY = RedY - CursorCenterY
    
    $ox = $redCx - $bboxCx
    $oy = $redCy - $bboxCy
    
    Write-Output "Calculated Offsets: X=$ox, Y=$oy"
}
else {
    Write-Output "No foreground object found."
}

$bmp.Dispose()
