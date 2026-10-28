# Execute com dot-sourcing para ativar o JDK Android no terminal atual:
# . .\scripts\android-env.ps1

$jambuAndroidSdk = [Environment]::GetEnvironmentVariable('ANDROID_HOME', 'User')
if ([string]::IsNullOrWhiteSpace($jambuAndroidSdk)) {
    $jambuAndroidSdk = $env:ANDROID_HOME
}

$jambuAndroidJava = [Environment]::GetEnvironmentVariable('JAMBU_ANDROID_JAVA_HOME', 'User')
if ([string]::IsNullOrWhiteSpace($jambuAndroidJava)) {
    $jambuAndroidJava = $env:JAMBU_ANDROID_JAVA_HOME
}

if ([string]::IsNullOrWhiteSpace($jambuAndroidSdk) -or
    !(Test-Path -LiteralPath (Join-Path $jambuAndroidSdk 'platform-tools\adb.exe'))) {
    throw 'Configure ANDROID_HOME com o caminho do SDK Android instalado.'
}

if ([string]::IsNullOrWhiteSpace($jambuAndroidJava) -or
    !(Test-Path -LiteralPath (Join-Path $jambuAndroidJava 'bin\javac.exe'))) {
    throw 'Configure JAMBU_ANDROID_JAVA_HOME com o caminho do JDK Android instalado.'
}

$jambuAndroidBins = @(
    (Join-Path $jambuAndroidJava 'bin'),
    (Join-Path $jambuAndroidSdk 'platform-tools'),
    (Join-Path $jambuAndroidSdk 'emulator'),
    (Join-Path $jambuAndroidSdk 'cmdline-tools\latest\bin')
)
$jambuOtherPaths = @($env:Path -split ';' | Where-Object {
    ![string]::IsNullOrWhiteSpace($_) -and $_ -notin $jambuAndroidBins
})

$env:JAVA_HOME = $jambuAndroidJava
$env:ANDROID_HOME = $jambuAndroidSdk
$env:ANDROID_SDK_ROOT = $jambuAndroidSdk
$env:Path = ($jambuAndroidBins + $jambuOtherPaths) -join ';'

Write-Host 'Ambiente Android ativo neste terminal.'
Write-Host "JAVA_HOME: $env:JAVA_HOME"
Write-Host "ANDROID_HOME: $env:ANDROID_HOME"
