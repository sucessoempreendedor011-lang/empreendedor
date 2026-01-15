import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Address from "./pages/Address";
import CPF from "./pages/CPF";
import CreditAnalysis from "./pages/CreditAnalysis";
import Result from "./pages/Result";
import WaitingAgent from "./pages/WaitingAgent";
import Chat from "./pages/Chat";
import Payment from "./pages/Payment";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/catalogo" component={Home} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/carrinho" component={Cart} />
      <Route path="/endereco" component={Address} />
      <Route path="/cpf" component={CPF} />
      <Route path="/analise" component={CreditAnalysis} />
      <Route path="/resultado" component={Result} />
      <Route path="/aguardando" component={WaitingAgent} />
      <Route path="/chat" component={Chat} />
      <Route path="/pagamento" component={Payment} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
