# Komutu VS Code / Terminal penceresine otomatik yapistir ve calistir
$text = $env:BORU_CMD
if (-not $text) { exit 1 }

Set-Clipboard -Value $text

Add-Type -AssemblyName System.Windows.Forms
Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;
public class W32 {
    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
    [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int n);
    [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
}
'@

$order = @("Code","WindowsTerminal","pwsh","powershell")
$proc  = $null
foreach ($name in $order) {
    $p = Get-Process $name -ErrorAction SilentlyContinue |
         Where-Object { $_.MainWindowHandle -ne [IntPtr]::Zero } |
         Select-Object -First 1
    if ($p) { $proc = $p; break }
}

if (-not $proc) { exit 1 }

[W32]::ShowWindow($proc.MainWindowHandle, 9) | Out-Null
[W32]::SetForegroundWindow($proc.MainWindowHandle) | Out-Null
Start-Sleep -Milliseconds 350

if ($proc.ProcessName -eq "Code") {
    [System.Windows.Forms.SendKeys]::SendWait("^``")
    Start-Sleep -Milliseconds 250
}

[System.Windows.Forms.SendKeys]::SendWait("^v")
Start-Sleep -Milliseconds 120
[System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
