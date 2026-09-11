export default function MototaxistaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="max-w-md mx-auto min-h-screen bg-black shadow-lg relative overflow-hidden">
      {children}
    </main>
  );
}
