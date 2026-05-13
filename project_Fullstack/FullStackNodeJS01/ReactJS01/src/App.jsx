import { Outlet } from "react-router-dom";
import Header from "./components/layout/header";

function App() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default App
