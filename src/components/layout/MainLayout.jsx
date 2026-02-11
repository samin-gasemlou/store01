import Container from "../ui/Container";
import MobileFooter from "./MobileFooter";
import MobileBottomNav from "./MobileBottomNav";

function Header() {
  return (
    <header className=" top-0 z-50 bg-[#2B4168]">
      <Container className="flex md:h-16 h-12 items-center justify-center text-white text-center ">
        <h1 className="md:text-[16px] text-[13px] font-bold">Free shiping fot purchasing more than two items for all over iraq</h1>
      </Container>
    </header>
  );
}

function Footer() {
  return (
    <footer className=" py-8">
     
    </footer>
  );
}

export default function AppLayout({ children }) {
  return (
    <div className="min-h-dvh bg-gray-50 text-gray-900">
      <Header />
     

      {/* main area */}
      <main className="py-2">
        <Container>
          {children}
        </Container>
      </main>

      <Footer />
    <MobileFooter />
 <MobileBottomNav />
    </div>
  );
}
