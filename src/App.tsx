
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import SearchPage from "@/pages/SearchPage";
import ItemDetail from "@/pages/ItemDetail";
import CreateItem from "@/pages/CreateItem";
import UserItems from "@/pages/UserItems";
import ChatList from "@/pages/ChatList";
import ChatDetail from "@/pages/ChatDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/item/:id" element={<ItemDetail />} />
            <Route path="/novo-anuncio" element={<CreateItem />} />
            <Route path="/meus-anuncios" element={<UserItems />} />
            <Route path="/mensagens" element={<ChatList />} />
            <Route path="/mensagens/:id" element={<ChatDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
