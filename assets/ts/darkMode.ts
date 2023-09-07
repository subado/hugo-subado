if (localStorage.theme == undefined) {
  if (window.matchMedia('(prefers-color-scheme: dark)')) {
    localStorage.theme = 'dark'
  } else {
    localStorage.theme = 'light'
  }
}

function applyTheme() {
  if (localStorage.theme == 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
function toggleTheme() {
  if (localStorage.theme == 'dark') localStorage.theme = 'light'
  else localStorage.theme = 'dark'
  applyTheme()
}

applyTheme()
document.querySelector('.theme-switcher').addEventListener('click', toggleTheme)
