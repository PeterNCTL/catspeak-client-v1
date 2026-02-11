# PowerShell script to update all imports to new feature-based structure

$replacements = @(
    # Messages
    @{Old = '@/components/messages'; New = '@/features/messages'},
    @{Old = '@/hooks/useConversationSignalR'; New = '@/features/messages'},
    
    # Video Call
    @{Old = '@/components/video-call'; New = '@/features/video-call'},
    @{Old = '@/hooks/useVideoCall'; New = '@/features/video-call'},
    @{Old = '@/hooks/useAudioLevel'; New = '@/features/video-call'},
    
    # Waiting Room
    @{Old = '@/components/waiting-room'; New = '@/features/waiting-room'},
    
    # Queue
    @{Old = '@/components/queue'; New = '@/features/queue'},
    @{Old = '@/hooks/useQueueSignaling'; New = '@/features/queue'},
    
    # Auth
    @{Old = '@/components/Auth'; New = '@/features/auth/components'},
    @{Old = '@/hooks/useAuth'; New = '@/features/auth'},
    @{Old = '@/store/api/authApi'; New = '@/features/auth'}
)

$files = Get-ChildItem -Path "src" -Include *.js,*.jsx -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $modified = $false
    
    foreach ($replacement in $replacements) {
        if ($content -match [regex]::Escape($replacement.Old)) {
            $content = $content -replace [regex]::Escape($replacement.Old), $replacement.New
            $modified = $true
        }
    }
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Updated: $($file.FullName)"
    }
}

Write-Host "Import path updates complete!"
