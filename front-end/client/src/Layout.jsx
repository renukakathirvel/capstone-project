import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="py-4 px-8 flex-grow">
        <Outlet />
      </main>
    </div>
  );
}
