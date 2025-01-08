import HeaderHomePage from "../components/homepage/Header";
import FooterHomePage from "../components/homepage/Footer";

export default function HomePageLayout({ children }) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <HeaderHomePage />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-black">
        <div className="container mx-auto px-6 py-8">{children}</div>
      </main>
      <FooterHomePage />
    </div>
  );
}
