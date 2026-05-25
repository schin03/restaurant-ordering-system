import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Drawer backdrop used `z-index: var(--z-index)` with no variable set → stacks below `sticky` (1100); use `modal` (1400).
// Widen backdrop/positioner with `width: auto` + inline insets instead of `100vw` to avoid edge clipping.
const system = createSystem(defaultConfig, {
  theme: {
    slotRecipes: {
      drawer: {
        base: {
          backdrop: {
            zIndex: 'modal',
            w: 'auto',
            insetInlineEnd: 0,
          },
          positioner: {
            width: 'auto',
            insetInlineEnd: 0,
          },
        },
      },
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider value={system}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>,
)
