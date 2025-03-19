import ReuseHeader from "../reuse/header/header";

const headerNavs = [
  {
    label: "Dashboard",
    link: "",
  },
  {
    label: "Home",
    link: "/home",
  },
  {
    label: "Logout",
    link: "/logout",
  },
];

export default function Header() {
  return <ReuseHeader name={"Admin"} navs={headerNavs} />;
}
