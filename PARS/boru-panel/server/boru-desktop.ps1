param(
  [Parameter(Mandatory=$true)][string]$Action,
  [string]$Match = "",
  [string]$Keys  = "",
  [string]$TextFile = ""
)

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName Microsoft.VisualBasic

function Get-TargetWindow($m) {
  $procs = Get-Process | Where-Object { $_.MainWindowHandle -ne 0 -and $_.MainWindowTitle }
  $hit = $procs | Where-Object {
    $_.ProcessName -like "*$m*" -or $_.MainWindowTitle -like "*$m*"
  } | Select-Object -First 1
  return $hit
}

switch ($Action) {
  "list" {
    Get-Process | Where-Object { $_.MainWindowHandle -ne 0 -and $_.MainWindowTitle } |
      Select-Object ProcessName, MainWindowTitle |
      ForEach-Object { $_.ProcessName + " :: " + $_.MainWindowTitle }
  }
  "keys" {
    $w = Get-TargetWindow $Match
    if (-not $w) { "[pencere bulunamadi] " + $Match; break }
    [Microsoft.VisualBasic.Interaction]::AppActivate($w.Id) | Out-Null
    Start-Sleep -Milliseconds 500
    [Microsoft.VisualBasic.Interaction]::AppActivate($w.Id) | Out-Null
    Start-Sleep -Milliseconds 400
    [System.Windows.Forms.SendKeys]::SendWait($Keys)
    Start-Sleep -Milliseconds 300
    "[tuslar gonderildi] " + $w.ProcessName + " (" + $w.MainWindowTitle + ") keys: " + $Keys
  }
  "readtitle" {
    $w = Get-TargetWindow $Match
    if (-not $w) { "[pencere bulunamadi] " + $Match }
    else { "[baslik] " + $w.MainWindowTitle }
  }
  "paste" {
    # VS Code icindeki TERMINALDE calisan Claude oturumuna metni aktar:
    # pencereyi aktive et -> komut paletiyle terminale odaklan -> yapistir -> Enter
    if (-not (Test-Path $TextFile)) { "[metin dosyasi yok] " + $TextFile; break }
    $text = Get-Content -Path $TextFile -Raw -Encoding UTF8
    if ([string]::IsNullOrWhiteSpace($Match)) { $Match = "Visual Studio Code" }
    $w = Get-TargetWindow $Match
    if (-not $w) { "[VS Code penceresi bulunamadi] " + $Match; break }
    Set-Clipboard -Value $text
    Start-Sleep -Milliseconds 200
    [Microsoft.VisualBasic.Interaction]::AppActivate($w.Id) | Out-Null
    Start-Sleep -Milliseconds 600
    [Microsoft.VisualBasic.Interaction]::AppActivate($w.Id) | Out-Null
    Start-Sleep -Milliseconds 500
    # Komut paleti ile aktif editor grubuna odaklan — Claude Code sohbeti editor sekmesinde
    # acik oldugunda giris kutusu odagi otomatik alir (klavye duzeninden bagimsiz)
    [System.Windows.Forms.SendKeys]::SendWait("^+p")
    Start-Sleep -Milliseconds 600
    [System.Windows.Forms.SendKeys]::SendWait("View: Focus Active Editor Group")
    Start-Sleep -Milliseconds 500
    [System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
    Start-Sleep -Milliseconds 900
    # Panoyu yapistir (Ctrl+V) sonra gonder (Enter)
    [System.Windows.Forms.SendKeys]::SendWait("^v")
    Start-Sleep -Milliseconds 900
    [System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
    Start-Sleep -Milliseconds 300
    "[yapistirildi] " + $w.ProcessName + " terminaline (" + $w.MainWindowTitle + ") | " + $text.Length + " karakter"
  }
  default { "[bilinmeyen eylem] " + $Action }
}
