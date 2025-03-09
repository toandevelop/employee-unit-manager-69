
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import EmployeesPage from "./pages/Employees";
import DepartmentsPage from "./pages/Departments";
import PositionsPage from "./pages/Positions";
import ContractsPage from "./pages/Contracts";
import AddContractPage from "./pages/AddContract";
import EditContractPage from "./pages/EditContract";
import ContractTypesPage from "./pages/ContractTypes";
import AcademicDegreesPage from "./pages/AcademicDegrees";
import AcademicTitlesPage from "./pages/AcademicTitles";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" />
      <BrowserRouter>
        <Layout>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/departments" element={<DepartmentsPage />} />
              <Route path="/positions" element={<PositionsPage />} />
              <Route path="/contracts" element={<ContractsPage />} />
              <Route path="/contracts/add" element={<AddContractPage />} />
              <Route path="/contracts/edit/:id" element={<EditContractPage />} />
              <Route path="/contract-types" element={<ContractTypesPage />} />
              <Route path="/academic-degrees" element={<AcademicDegreesPage />} />
              <Route path="/academic-titles" element={<AcademicTitlesPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
