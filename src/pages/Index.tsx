import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopNavigation } from "@/components/TopNavigation";
import { BirthRegistration } from "@/components/BirthRegistration";
import { DeathRegistration } from "@/components/DeathRegistration";
import { BirthRecords } from "@/components/BirthRecords";
import { DeathRecords } from "@/components/DeathRecords";
import { CertificateGenerator } from "@/components/CertificateGenerator";
import { Dashboard } from "@/components/Dashboard";
import { Settings } from "@/components/Settings";
import Footer from "@/components/Footer";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const isMobile = useIsMobile();

  const renderContent = () => {
    switch (activeSection) {
      case "birth-registration":
        return <BirthRegistration setActiveSection={setActiveSection} />;
      case "death-registration":
        return <DeathRegistration setActiveSection={setActiveSection} />;
      case "birth-records":
        return <BirthRecords setActiveSection={setActiveSection} />;
      case "death-records":
        return <DeathRecords setActiveSection={setActiveSection} />;
      case "certificates":
        return <CertificateGenerator setActiveSection={setActiveSection} />;
      case "settings":
        return <Settings setActiveSection={setActiveSection} />;
      default:
        return <Dashboard setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SidebarProvider>
        <div className="flex w-full bg-background pt-16 flex-1 flex-col md:flex-row mx-4">
          <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
          <main className="flex-1 overflow-auto">
            <TopNavigation activeSection={activeSection} setActiveSection={setActiveSection} />
            <div className="p-2 sm:p-4 md:p-6">
              <div className="bg-white shadow-md p-2 sm:p-4 md:p-6 min-h-[60vh] md:min-h-[80vh]" style={{borderTop:"5px solid #0d92ae"}}>
                {renderContent()}
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
      <div className="px-2 sm:px-4 md:px-6 mb-4 w-full">
        <Footer />
      </div>
    </div>
  );
};

export default Index;
