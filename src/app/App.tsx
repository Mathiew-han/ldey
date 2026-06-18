import { useEffect } from "react";
import { HashRouter, Routes, Route, useLocation } from "react-router";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./components/HomePage";
import { DataCenterPage } from "./components/DataCenterPage";
import { DatabasePage } from "./components/DatabasePage";
import { DiseaseDetailPage } from "./components/DiseaseDetailPage";
import { ExpertTeamPage } from "./components/ExpertTeamPage";
import { ResearchPage, ResearchProjectYearPage, ResearchPublicationsPage } from "./components/ResearchPage";
import { ContactPage } from "./components/ContactPage";

/* MARKER-MAKE-KIT-INVOKED */

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname, search]);

  return null;
}

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <ScrollToTop />
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/data-center" element={<DataCenterPage />} />
            <Route path="/database" element={<DatabasePage />} />
            <Route path="/disease-detail" element={<DiseaseDetailPage />} />
            <Route path="/experts" element={<ExpertTeamPage />} />
            <Route path="/research" element={<ResearchPage />} />
            <Route path="/research/projects/:year" element={<ResearchProjectYearPage />} />
            <Route path="/research/publications" element={<ResearchPublicationsPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}
