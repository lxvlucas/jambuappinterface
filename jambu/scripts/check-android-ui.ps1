param([string]$Name, [string]$TapLabel, [string]$Route, [string]$Text, [switch]$SwipeUp,
  [string]$AdbPath = (Join-Path $env:LOCALAPPDATA 'Android/Sdk/platform-tools/adb.exe'), [string]$OutputDir)
$ErrorActionPreference = 'Stop'
$jambuAdb = $AdbPath
$jambuOut = if ($OutputDir) { [System.IO.Path]::GetFullPath($OutputDir) } else { Join-Path $PSScriptRoot '../.impeccable/review/mobile-v2' }
New-Item -ItemType Directory -Path $jambuOut -Force | Out-Null
function Run-Adb { & $jambuAdb -s emulator-5554 @args; if ($LASTEXITCODE -ne 0) { throw "ADB failed; capture is invalid." } }
function Dump-Ui {
  Run-Adb shell uiautomator dump /sdcard/jambu-ui.xml | Out-Null
  Run-Adb pull /sdcard/jambu-ui.xml "$jambuOut/ui.xml" | Out-Null
}
if ($Route) { Run-Adb shell am start -a android.intent.action.VIEW -d "exp://127.0.0.1:8095/--/$Route" host.exp.exponent | Out-Null }
if ($TapLabel) {
  Dump-Ui
  [xml]$jambuXml = Get-Content -Encoding UTF8 "$jambuOut/ui.xml"
  $jambuMatches = $jambuXml.SelectNodes('//node') | Where-Object { $_.'content-desc' -eq $TapLabel -or $_.text -eq $TapLabel }
  $jambuNode = $jambuMatches | Where-Object { $_.class -eq 'android.widget.EditText' } | Select-Object -First 1
  if (!$jambuNode) { $jambuNode = $jambuMatches | Select-Object -First 1 }
  if (!$jambuNode) { throw "No visible control: $TapLabel" }
  $jambuBounds = [regex]::Matches($jambuNode.bounds, '\d+') | ForEach-Object { [int]$_.Value }
  Run-Adb shell input tap ([int](($jambuBounds[0]+$jambuBounds[2])/2)) ([int](($jambuBounds[1]+$jambuBounds[3])/2))
}
if ($Text) { Run-Adb shell input text $Text }
if ($SwipeUp) { Run-Adb shell input swipe 540 1700 540 650 450 }
Dump-Ui
if ($Name) {
  Run-Adb shell screencap -p /sdcard/jambu-ui.png
  Run-Adb pull /sdcard/jambu-ui.png "$jambuOut/$Name.png"
}
[xml]$jambuXml = Get-Content -Encoding UTF8 "$jambuOut/ui.xml"
$jambuXml.SelectNodes('//node') | Where-Object { $_.text -or $_.'content-desc' } | ForEach-Object { "$($_.text) $($_.'content-desc') $($_.bounds)" }
