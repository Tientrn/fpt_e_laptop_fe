import HeaderHomePage from "../components/homepage/Header";
import FooterHomePage from "../components/homepage/Footer";

export default function HomePageLayout({ children }) {
  return (
    <div className="flex flex-col overflow-hidden">
      <HeaderHomePage />
      <main className="w-screen">{children}</main>
      <FooterHomePage />
    </div>
  );
}
