import Link from "next/link";

export default function MototaxistaHome() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 p-6 text-white">
      <header className="flex items-center gap-4 mb-8 pt-4">
        <Link href="/" className="text-gray-400 hover:text-white">
          ← Voltar
        </Link>
        <h1 className="text-2xl font-bold">Área do Mototaxista</h1>
      </header>

      <div className="flex-1 flex flex-col justify-center gap-4">
        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-dark text-3xl mx-auto mb-6">
          🏍️
        </div>
        
        <p className="text-center text-gray-300 mb-8">
          Acesse seu painel para receber corridas e gerenciar seus ganhos.
        </p>

        <Link 
          href="/mototaxista/login" 
          className="w-full py-4 bg-primary text-dark font-bold text-center rounded-lg text-lg shadow-sm hover:bg-yellow-400"
        >
          Entrar no Painel
        </Link>
        
        <Link 
          href="/mototaxista/cadastro"
          className="w-full py-4 bg-transparent border border-gray-600 text-white font-bold text-center rounded-lg text-lg hover:bg-gray-800 mt-2 block"
        >
          Quero me cadastrar
        </Link>
      </div>
    </div>
  );
}
