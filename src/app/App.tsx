import { HashRouter, Routes, Route } from "react-router";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./components/HomePage";
import { DataCenterPage } from "./components/DataCenterPage";
import { DatabasePage } from "./components/DatabasePage";
import { DiseaseDetailPage } from "./components/DiseaseDetailPage";
import { ExpertTeamPage } from "./components/ExpertTeamPage";
import { ResearchPage } from "./components/ResearchPage";
import { ContactPage } from "./components/ContactPage";

/* MARKER-MAKE-KIT-INVOKED */

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/data-center" element={<DataCenterPage />} />
            <Route path="/database" element={<DatabasePage />} />
            <Route path="/disease-detail" element={<DiseaseDetailPage />} />
            <Route path="/experts" element={<ExpertTeamPage />} />
            <Route path="/research" element={<ResearchPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}
