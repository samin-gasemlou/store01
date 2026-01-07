import Container from "../ui/Container";

export default function MainLayout({ children }) {
  return (
    <main className="w-full">
      <Container>
        {children}
      </Container>
    </main>
  );
}
