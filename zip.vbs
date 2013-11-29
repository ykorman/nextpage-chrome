'Get command-line arguments.
Set objArgs = WScript.Arguments
InputFolder = objArgs(0)
ZipFile = objArgs(1)

'Create empty ZIP file.
CreateObject("Scripting.FileSystemObject").CreateTextFile(ZipFile, True).Write "PK" & Chr(5) & Chr(6) & String(18, vbNullChar)

Set objShell = CreateObject("Shell.Application")

Set source = objShell.NameSpace(InputFolder).Items

objShell.NameSpace(ZipFile).CopyHere(source)

Do Until objShell.NameSpace(ZipFile).Items.Count = objShell.NameSpace(InputFolder).Items.Count
    WScript.Sleep 200
Loop