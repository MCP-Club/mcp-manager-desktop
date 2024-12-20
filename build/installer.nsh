!macro customInit
  !define INSTALL_MUTEX "mcp-mananger-desktop-installer"
  System::Call 'kernel32::CreateMutexA(i 0, i 0, t "${INSTALL_MUTEX}")i .r1 ?e'
  Pop $0
  StrCmp $0 0 +3
    MessageBox MB_OK|MB_ICONEXCLAMATION "The installer is already running."
    Abort
!macroend
