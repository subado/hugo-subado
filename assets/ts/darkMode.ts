function toggleTheme() {
  const classList = document.documentElement.classList
  if (classList.contains('dark')) {
    document.documentElement.classList.remove('dark')
  } else {
    document.documentElement.classList.add('dark')
  }
}

document.querySelector('.theme-switcher').addEventListener('click', toggleTheme)
