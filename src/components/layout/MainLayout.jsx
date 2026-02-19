// src/components/layout/AppLayout.jsx
import Container from "../ui/Container";
import MobileFooter from "./MobileFooter";
import MobileBottomNav from "./MobileBottomNav";
import { useTranslation } from "react-i18next";

function Header() {
  const { t } = useTranslation();

  return (
    <header className="top-0 z-50 px-2 bg-[#2B4168]">
      <Container className="flex md:h-16 h-12 items-center justify-center text-white text-center">
        <h1 className="md:text-[16px] text-[13px] font-bold">
          {t("layout.freeShipping")}
        </h1>
      </Container>
    </header>
  );
}

function Footer() {
  return <footer className="py-8"></footer>;
}

export default function AppLayout({ children }) {
  return (
    <div className="min-h-dvh bg-[#f2f3f5] text-gray-900">
      <Header />

      <main className="py-2">
        <Container>{children}</Container>
      </main>

      <Footer />
      <MobileFooter />
      <MobileBottomNav />
    </div>
  );
}
