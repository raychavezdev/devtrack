import { Outlet } from "react-router-dom";
import Header from "./Header";


export default function AppLayout() {


  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      
      <Header/>
      <main className="max-w-5xl mx-auto p-8">
        <Outlet />
      </main>

     
    </div>
  );
}