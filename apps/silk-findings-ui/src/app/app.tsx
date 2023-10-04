import { useMediaQuery, CssBaseline } from '@mui/material'
import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material/styles'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { Findings } from './views'

export function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  let theme = createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light'
    },
    typography: {
      h1: { fontSize: '3rem' },
    }
  })
  theme = responsiveFontSizes(theme)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Findings />
    </ThemeProvider>
  )
}

export default App
