import {
  Home,
  FileText,
  Users,
  ScrollText,
  Shield,
  Award,
  Search,
  ArrowRight,
  LucideSquareArrowUpRight,
  ArrowBigRight,
  ArrowRightIcon,
  ArrowRightSquare,
  ChevronRightIcon,
  CreditCard,
} from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface AppSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const menuItems = [
  {
    title: "Dashboard",
    icon: () => <FontAwesomeIcon icon={faCaretRight} className="w-5 h-5" />,
    id: "dashboard",
  },
  {
    title: "Birth Registration",
    icon: () => <FontAwesomeIcon icon={faCaretRight} className="w-5 h-5" />,
    id: "birth-registration",
  },
  {
    title: "Death Registration",
    icon: () => <FontAwesomeIcon icon={faCaretRight} className="w-5 h-5" />,
    id: "death-registration",
  },
  {
    title: "Birth Records",
    icon: () => <FontAwesomeIcon icon={faCaretRight} className="w-5 h-5" />,
    id: "birth-records",
  },
  {
    title: "Death Records",
    icon: () => <FontAwesomeIcon icon={faCaretRight} className="w-5 h-5" />,
    id: "death-records",
  },
  {
    title: "Certificates",
    icon: () => <FontAwesomeIcon icon={faCaretRight} className="w-5 h-5" />,
    id: "certificates",
  },
];

export function AppSidebar({ activeSection, setActiveSection }: AppSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [today, setToday] = useState("");

  useEffect(() => {
    const savedProfilePic = localStorage.getItem('profilePic');
    if (savedProfilePic) setProfilePic(savedProfilePic);
    // Set today's date in DD/MM/YYYY format
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    setToday(`${day}/${month}/${year}`);
  }, []);

  const filteredMenuItems = menuItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Sidebar className="border-r border-sidebar-border bg-black font-poppins">
      <SidebarHeader className="bg-black font-poppins">
        {/* Removed profile section from here */}
      </SidebarHeader>

      <SidebarContent className="bg-black font-poppins overflow-hidden">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white font-bold font-poppins">
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {/* Profile Section - moved here */}
            <div className="flex items-center gap-3 px-4 py-4 mb-2 font-poppins">
              <Avatar className="w-15 h-14 border-2 border-[#038ba4]">
                <AvatarImage src={profilePic || "src/assets/proimg.png"} alt="Profile" />
                <AvatarFallback>SA</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-left font-poppins">
                <span className="text-white font-bold mx-7 leading-tight text-[12px] font-poppins">System Admin</span>
                <span className="text-[#038ba4] text-[17px] mx-5 leading-tight font-poppins">HODO Hospital</span>
                <span className="text-[#038ba4] text-[17px] mx-6 leading-tight font-poppins">Kazhakkottam</span>
                <span className="text-[#038ba4] text-[14px] mx-8 leading-tight font-poppins">System Admin</span>
              </div>
            </div>
            {/* @Anchal and date */}
            <div className="flex items-center px-4 mx-6 mb-2 font-poppins">
              <span className="font-bold text-white mr-2 font-poppins">@Anchal</span>
              <span className="font-bold text-white font-poppins">{today}</span>
            </div>
            {/* Search Bar */}
            <div className="relative mb-4 px-3 font-poppins" style={{marginTop:"0px"}}>
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search Menu CTRL+M"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black border-primary text-white placeholder-white focus:border-[#80def7] font-poppins"
              />
            </div>

            <SidebarMenu >
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.id} style={{marginTop:"10px", height:"40px"}}>
                  <SidebarMenuButton asChild>
                    <button
                      style={{height:"50px" ,borderRadius:"0px"}}
                      onClick={() => setActiveSection(item.id)}
                      className={`flex items-center gap-3 w-full text-left p-3 transition-colors font-poppins ${
                        activeSection === item.id
                          ? "bg-[#80def7] text-black hover:bg-[#80def7]"
                          : "text-white hover:bg-[#b2e4f1] hover:text-black"
                      }`}
                    >
                      <item.icon />
                      <span className="font-semibold text-[14px] font-poppins">{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {filteredMenuItems.length === 0 && searchQuery && (
                <div className="text-gray-400 text-sm p-3 font-poppins">
                  No navigation items found for "{searchQuery}"
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
