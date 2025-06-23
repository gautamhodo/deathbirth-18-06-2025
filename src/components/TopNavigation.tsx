import { Settings, Bell, Search, User, Plus, Calendar, Clock, CreditCard, ChevronDown, FileText, ScrollText, Award } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faBell, faGear, faCalendarDays, faClock, faCalculator, faCaretDown } from "@fortawesome/free-solid-svg-icons";

interface TopNavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function TopNavigation({ activeSection, setActiveSection }: TopNavigationProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "birth-records", label: "Birth List" },
    { id: "death-records", label: "Death List" },
  ];

  const [showShortcuts, setShowShortcuts] = useState(false);

  const navigate = useNavigate();
  const { toggleSidebar, state } = useSidebar();

  const moreMenuItems = [
    { id: "birth-registration", label: "Birth Registration", icon: ScrollText },
    { id: "death-registration", label: "Death Registration", icon: ScrollText },
    { 
      id: "certificates", 
      label: "Death Certificate", 
      icon: Award,
      onClick: () => {
        setActiveSection("certificates");
        localStorage.setItem("certificateType", "death");
      }
    },
    { 
      id: "certificates", 
      label: "Birth Certificate", 
      icon: Award,
      onClick: () => {
        setActiveSection("certificates");
        localStorage.setItem("certificateType", "birth");
      }
    },
    { id: "settings", label: "Settings", icon: Settings },
    { 
      id: "shortcuts", 
      label: "Shortcuts", 
      icon: Plus,
      onClick: () => setShowShortcuts(true)
    },
  ];

  const shortcutSections = [
    {
      title: 'GENERAL SHORTCUTS',
      shortcuts: [
        { keys: 'ALT+CTRL+L', desc: 'Log out or login' },
        { keys: 'ALT+S', desc: 'Search Patient (Clear and search if patient selected)' },
        { keys: 'ALT+R', desc: 'Register patient' },
        { keys: 'ALT+H', desc: 'Visit History (After patient selected)' },
        { keys: 'ALT+A', desc: 'Assign Doctor/Lab Tests (After patient selected)' },
        { keys: 'ALT+F', desc: 'Add Pending Lab Result' },
        { keys: 'ALT+J', desc: 'Add Pending Radiology Result (After patient selected)' },
        { keys: 'ALT+U', desc: 'Add Pending Procedure Result (After patient selected)' },
        { keys: 'ALT+Z', desc: 'View Lab Entered Results' },
        { keys: 'ALT+Y', desc: 'Home collection registration' },
        { keys: 'F1', desc: 'Search' },
        { keys: 'F2', desc: 'Todays Bills' },
        { keys: 'F3', desc: 'Todays Visits' },
        { keys: 'CTRL + F2', desc: 'Collect Sample' },
        { keys: 'F4', desc: 'Appointments' },
        { keys: 'F6', desc: 'Drug Stocks' },
        { keys: 'ALT + F6', desc: 'Brand Name wise Stock' },
        { keys: 'CTRL + F6', desc: 'Stock transfer' },
        { keys: 'F7', desc: 'Pharmacy Sale' },
        { keys: 'CTRL+F7', desc: 'Pharmacy Sale Return' },
        { keys: 'F8', desc: 'Register Patient' },
        { keys: 'F9', desc: 'New Visit?' },
        { keys: 'ALT+M', desc: 'Search Menu' },
        { keys: 'ALT+B', desc: 'Bills' },
        { keys: 'ALT+K', desc: 'Bookings' },
        { keys: 'ALT+N', desc: 'Next Patient' },
        { keys: 'ALT+Q', desc: 'Lab pending' },
        { keys: 'ALT+W', desc: 'Radiology pending' },
        { keys: 'ALT+E', desc: 'Procedure pending' },
        { keys: 'ALT+D', desc: 'Drug pharmacy pending' },
        { keys: 'CTRL+ALT+P', desc: 'Printer Settings' },
        { keys: 'CTRL+ALT+C', desc: 'Calculator ( Contact HODO if not working )' },
      ],
    },
    {
      title: 'ADD CONSULTATION PAGE SHORTCUTS',
      shortcuts: [
        { keys: 'ALT+C', desc: 'Chief Complaint' },
        { keys: 'ALT+I', desc: 'Clinical Notes' },
        { keys: 'ALT+O', desc: 'On Examination' },
        { keys: 'ALT+M', desc: 'Symptoms' },
        { keys: 'ALT+G', desc: 'Diagnosis' },
        { keys: 'ALT+V', desc: 'Vitals' },
        { keys: 'ALT+T', desc: 'Treatment Plan' },
        { keys: 'ALT+L', desc: 'Lab Test' },
        { keys: 'ALT+Y', desc: 'Radiology' },
        { keys: 'ALT+P', desc: 'Procedure' },
        { keys: 'ALT+X', desc: 'Common Remarks' },
      ],
    },
  ];

  const [notifications, setNotifications] = useState<any[]>([]);
  const [currentProfile, setCurrentProfile] = useState<any>(null);
  const [allProfiles, setAllProfiles] = useState<any[]>([]);
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    // Load notifications from localStorage - showing newest registrations first
    const birthRecords = JSON.parse(localStorage.getItem('birthRecords') || '[]');
    const deathRecords = JSON.parse(localStorage.getItem('deathRecords') || '[]');
    
    const allNotifications = [
      ...birthRecords.map((record: any) => ({
        id: record.id,
        type: 'birth',
        message: `New birth registration: ${record.firstName} ${record.lastName}`,
        time: new Date(record.registrationDate),
        profile: record
      })),
      ...deathRecords.map((record: any) => ({
        id: record.id,
        type: 'death',
        message: `New death registration: ${record.firstName} ${record.lastName}`,
        time: new Date(record.registrationDate),
        profile: record
      }))
    ].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 10);

    setNotifications(allNotifications);

    // Load all profiles
    const profiles = [
      ...birthRecords.map((record: any) => ({ ...record, type: 'birth' })),
      ...deathRecords.map((record: any) => ({ ...record, type: 'death' }))
    ];
    setAllProfiles(profiles);

    // Update date and time every second
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSettingsClick = (setting: string) => {
    console.log(`Opening ${setting} settings`);
    setActiveSection('settings');
    localStorage.setItem('selectedSetting', setting);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const birthRecords = JSON.parse(localStorage.getItem('birthRecords') || '[]');
      const deathRecords = JSON.parse(localStorage.getItem('deathRecords') || '[]');
      const allProfiles = [
        ...birthRecords.map((record: any) => ({ ...record, type: 'birth' })),
        ...deathRecords.map((record: any) => ({ ...record, type: 'death' }))
      ];
      
      const results = allProfiles.filter(profile => 
        profile.firstName?.toLowerCase().includes(query.toLowerCase()) ||
        profile.lastName?.toLowerCase().includes(query.toLowerCase()) ||
        profile.id?.toString().includes(query)
      ).slice(0, 5); // Limit to 5 results
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleProfileSelect = (profile: any) => {
    setCurrentProfile(profile);
    setActiveSection(profile.type === 'birth' ? 'birth-records' : 'death-records');
    toast({
      title: "Profile Selected",
      description: `Viewing details for ${profile.firstName} ${profile.lastName}`,
    });
  };

  const handleLogout = () => {
    setCurrentProfile(null);
    toast({
      title: "Logged Out",
      description: "Successfully logged out from profile",
    });
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <>
      <nav className="bg-black border-b border-gray-800 w-full fixed top-0 left-0 z-50 shadow-lg font-poppins">
        {/* <div className="flex items-center justify-between h-16 px-6 font-poppins"> */}
        <div className="flex items-center justify-between h-12 px-6 font-poppins">
          {/* Left side - Logo and navigation */}
          <div className="flex items-center gap-3 font-poppins">
            <div className="w-10 h-14 flex items-center justify-center font-poppins">
              <img 
                src="src/assets/hodo.png" 
                alt="HODO Hospital Logo" 
                className="w-10 h-14 object-contain"
              />
            </div>
          </div>
          
          {/* Navigation items */}
          <div className="flex items-center gap-2 "style={{fontWeight:"300" ,fontFamily:"Poppins,sans-serif"}}>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`px-4 py-2 text-[16px] transition-colors mr-2 font-poppins ${
                  activeSection === item.id
                    ? "text-white text-hover:[#038ba4] border-primary"
                    : "text-gray-300 hover:text-[#038ba4]"
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {/* More Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`px-4 py-2 text-[16px] transition-colors mr-2 flex items-center gap-1 font-poppins ${
                    moreMenuItems.some(item => activeSection === item.id)
                      ? "text-[#038ba4] border-b-2 border-[#038ba4]"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  More
                  <FontAwesomeIcon icon={faCaretDown} className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-white border border-gray-200 shadow-lg font-poppins">
                {moreMenuItems.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    onClick={item.onClick || (() => setActiveSection(item.id))}
                    className="flex items-center gap-2 font-poppins"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Center - Search Bar */}
          <div className="flex-1 max-w-md relative ml-auto flex items-center gap-2 font-poppins">
            {/* <FontAwesomeIcon icon={faMagnifyingGlass} style={{color: "#ffffff"}} className="absolute left-5 top-1/2 transform -translate-y-1/2 w-4 h-4" /> */}
            <Input
              type="text"
              placeholder="Search Patient with Name or Card No"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-1 bg-white text-black placeholder-gray-500 focus:border-primary font-poppins"
            />
            <button
              className="ml-3 flex items-center gap-2 px-4 py-1 text-sm font-medium text-white transition-colors"
              style={{
                background: 'linear-gradient(135deg, rgb(5, 130, 172), rgb(16, 85, 97))',
                borderRadius: "3px",
                height: "30px",
                minWidth: "120px"
              }}
              onClick={() => setActiveSection('certificates')}
            >
              New Report
            </button>
          </div>
          
          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto z-50">
              {searchResults.map((profile, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setShowSearchResults(false);
                    setSearchQuery("");
                    setActiveSection(profile.type === 'birth' ? 'birth-records' : 'death-records');
                  }}
                >
                  <div>
                    <div className="font-medium text-sm">{profile.firstName} {profile.lastName}</div>
                    <div className="text-xs text-gray-500">
                      {profile.type} record - ID: {profile.id}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Right side - New Register, Notifications, Profile, Settings */}
          <div className="flex items-center gap-2">
            {/* New Register Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-3 flex items-center gap-2 px-4 py-1 text-sm font-medium text-white transition-colors" style={{background: 'linear-gradient(135deg, rgb(5, 130, 172), rgb(16, 85, 97))',borderRadius:"3PX"}}>
                  <Plus className="w-4 h-4" />
                  Add Patient
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">
                <DropdownMenuItem onClick={() => setActiveSection("birth-registration")}>
                  Birth Registration
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveSection("death-registration")}>
                  Death Registration
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile (replace with search icon) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 bg-black border border-black squared-full hover:border-white flex items-center justify-center">
                  {/* <FontAwesomeIcon icon={faMagnifyingGlass} style={{color: "#ffffff"}} className="w-4 h-4" /> */}
                  <FontAwesomeIcon icon={faMagnifyingGlass} size="2xs" style={{color: "#ffffff",}} className="w-4 h-4"  />                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-white border border-gray-200 shadow-lg max-h-96 overflow-y-auto">
                <DropdownMenuLabel>Search</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* Add search functionality or leave empty */}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 bg-black border border-black squared-full hover:border-white flex items-center justify-center relative">
                  <FontAwesomeIcon icon={faBell} style={{color: "#ffffff"}} className="w-4 h-4" />
                  {notifications.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                      {notifications.length}
                    </Badge>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-white border border-gray-200 shadow-lg">
                <DropdownMenuLabel>Recent Registrations</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <DropdownMenuItem 
                      key={index} 
                      className="flex flex-col items-start p-3 cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        setActiveSection(notification.type === 'birth' ? 'birth-records' : 'death-records');
                      }}
                    >
                      <span className="font-medium text-sm">{notification.message}</span>
                      <span className="text-xs text-gray-500">{formatTimeAgo(notification.time)}</span>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem>No new registrations</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Settings */}
      
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 bg-black border border-black squared-full hover:border-white flex items-center justify-center">
                  <FontAwesomeIcon icon={faGear} style={{color: "#ffffff"}} className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border border-[#038ba4] shadow-lg">
                <DropdownMenuLabel>Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleSettingsClick("dashboard")}>Dashboard Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSettingsClick("birth-registration")}>Birth Registration Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSettingsClick("death-registration")}>Death Registration Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSettingsClick("certificates")}>Certificate Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleSettingsClick("user-management")}>User Management</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSettingsClick("system")}>System Settings</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
      {/* Date and Time Display */}
      <div className="bg-#e5e7eb border-none border-#e5e7eb w-full mt-6">
        <div className="flex items-center justify-between gap-4 px-3">
          <div className="flex items-center">
            <img 
              src={state === "expanded" ? "/src/assets/lefthand.png" : "/src/assets/righthand.png"} 
              alt={state === "expanded" ? "Left Hand" : "Right Hand"} 
              className="h-6 w-auto cursor-pointer" 
              onClick={toggleSidebar}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 border-2 border-white bg-white mr-2" style={{borderRadius:"9px"}}>
                <FontAwesomeIcon icon={faCalendarDays} className="w-4 h-4 text-black" />
              </div>
              <span className="text-sm"  style={{fontSize:"16x" ,fontWeight:"700" ,color:"#888888" }}>
                {currentDateTime.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <div className="flex items-center  text-black">
              <div className="flex items-center justify-center w-7 h-7 border-2 border-white bg-white mr-2" style={{borderRadius:"9px"}}>
                <FontAwesomeIcon icon={faClock} className="w-4 h-4 text-black" />
              </div>
              <span className="text-sm" style={{fontSize:"16px" ,fontWeight:"500" ,color:"#888888" }}>
                {currentDateTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit', 
                  second: '2-digit',
                  hour12: true 
                })}
              </span>
            </div>
            <div className="flex items-center  text-black">
              <div className="flex items-center justify-center w-7 h-7  border-2 border-white bg-white mr-2" style={{borderRadius:"9px"}}>
                <FontAwesomeIcon icon={faCalculator}  className="w-4 h-4 text-black"/>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shortcuts Dialog */}
      <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
            <DialogDescription>
              Use these shortcuts to quickly navigate and perform actions in the portal.
            </DialogDescription>
          </DialogHeader>
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {shortcutSections.map(section => (
              <div key={section.title} className="mb-4">
                <h3 className="text-base font-semibold mb-2">{section.title}</h3>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <table style={{ width: '100%' }}>
                    <tbody>
                      {section.shortcuts.map((sc, idx) => (
                        <tr key={sc.keys + idx}>
                          <td style={{ fontFamily: 'monospace', fontWeight: 600, padding: '4px 8px', whiteSpace: 'nowrap' }}>{sc.keys}</td>
                          <td style={{ padding: '4px 8px' }}>{sc.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
          <DialogClose asChild>
            <button className="mt-2 w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
              Close
            </button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}