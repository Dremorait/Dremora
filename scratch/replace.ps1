$projectsPath = "c:\xampp\htdocs\Dremora\projects.html"
$cafePath = "c:\xampp\htdocs\Dremora\scratch\prototype_cafe.html"
$projectsContent = Get-Content $projectsPath
$cafeContent = Get-Content $cafePath

$newContent = @()
$newContent += $projectsContent[0..78]
$newContent += $cafeContent
$newContent += $projectsContent[202..($projectsContent.Length - 1)]

Set-Content -Path $projectsPath -Value $newContent -Encoding UTF8
