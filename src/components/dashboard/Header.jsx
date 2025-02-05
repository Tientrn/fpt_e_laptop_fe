import Button from "@mui/material/Button";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ReuseHeader from "../reuse/header/header";
import { LayoutGrid } from "lucide-react";

const headerNavs = [
  {
    label: "Dashboard",
    link: "dashboard",
  },
  {
    label: "Home",
    link: "/home",
  },
  {
    label: "Logout",
    link: "/login",
  },
];

export default function Header() {
  return <ReuseHeader name={"Admin"} navs={headerNavs} />;
}
