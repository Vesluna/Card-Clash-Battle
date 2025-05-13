import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "sonner";
import Game from "./components/game/Game";
import "@fontsource/inter";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Game />
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}

export default App;
