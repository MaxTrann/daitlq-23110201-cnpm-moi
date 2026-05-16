import { Outlet } from "react-router-dom";
import Header from "./components/layout/header";
import Footer from "./components/layout/Footer";

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f4f6f8]">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
