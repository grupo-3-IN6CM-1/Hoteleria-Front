import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import {App} from './App.jsx'
import { DarkModeProvider } from "./shared/context/DarkModeContext.jsx";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
   <DarkModeProvider>
       <App />
   </DarkModeProvider> 
  </BrowserRouter>,
)
