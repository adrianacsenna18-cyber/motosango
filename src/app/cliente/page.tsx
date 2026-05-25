import Link from "next/link";

export default function ClienteHome() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6">
      <header className="flex items-center gap-4 mb-8 pt-4">
        <Link href="/" className="text-gray-500 hover:text-dark">
          ← Voltar
        </Link>
        <h1 className="text-2xl font-bold text-dark">Área do Cliente</h1>
      </header>

      <div className="flex-1 flex flex-col justify-center gap-4">
        <p className="text-center text-gray-600 mb-8">
          Para solicitar uma corrida, identifique-se de forma rápida e segura.
        </p>

        <Link 
          href="/cliente/login" 
          className="w-full py-4 bg-primary text-dark font-bold text-center rounded-lg text-lg shadow-sm hover:bg-yellow-400"
        >
          Entrar com Telefone
        </Link>
      </div>
    </div>
  );
}
