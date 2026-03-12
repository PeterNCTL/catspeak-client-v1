import { Provider } from "react-redux"
import AppRouter from "@routes"
import { store } from "@store"
import "@styles/app.css"
import { Toaster } from "react-hot-toast"
import "@/styles/theme.css"

import { ConversationSignalRProvider } from "@/features/messages/context/ConversationSignalRContext"

function App() {
  return (
    <Provider store={store}>
      <ConversationSignalRProvider>
        <Toaster position="top-center" limit={1} />
        <AppRouter />
      </ConversationSignalRProvider>
    </Provider>
  )
}

export default App
