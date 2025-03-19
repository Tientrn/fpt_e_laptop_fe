import HomeIcon from "@mui/icons-material/Home";
import BarChartIcon from "@mui/icons-material/BarChart";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import DescriptionIcon from "@mui/icons-material/Description";
import ReportIcon from "@mui/icons-material/Report";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ReuseSidebar from "../reuse/sidebar/Sidebar";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Analytic", href: "/analytic", icon: BarChartIcon },
  { name: "History", href: "/history", icon: PeopleAltIcon },
  { name: "Content", href: "/content", icon: DescriptionIcon },
  { name: "Report", href: "/report", icon: ReportIcon },
  { name: "Account ", href: "/account", icon: AccountBoxIcon },
];

export default function Sidebar() {
  return <ReuseSidebar navItems={navItems} />;
}
