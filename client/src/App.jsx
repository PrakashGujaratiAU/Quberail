import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import PurchaseForm from "./components/PurchaseForm";
import StockTable from "./components/StockTable";
import UsageForm from "./components/UsageForm";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="mx-auto p-2">
        <Routes>
          <Route path="/" element={<Navigate to="/purchase" replace />} />
          <Route path="/purchase" element={<PurchaseForm />} />
          <Route path="/usage" element={<UsageForm />} />
          <Route path="/stock" element={<StockTable />} />
          <Route
            path="*"
            element={<p className="text-center">Page not found</p>}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
