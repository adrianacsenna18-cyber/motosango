import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-dark text-white">
      <div className="flex items-center gap-2 mb-12">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-dark font-bold text-2xl">
          🏍️
        </div>
        <h1 className="text-4xl font-bold text-primary tracking-tight">MotoSango</h1>
      </div>

      <p className="text-center text-gray-300 mb-12 max-w-sm">
        Sistema completo de mototáxi regional. Conectando você ao seu destino com segurança e rapidez.
      </p>

      <div className="w-full space-y-4">
        <Link 
          href="/cliente" 
          className="block w-full py-4 text-center bg-primary text-dark font-bold rounded-lg text-lg hover:bg-yellow-400 transition-colors"
        >
          Sou Cliente
        </Link>
        
        <Link 
          href="/mototaxista" 
          className="block w-full py-4 text-center bg-gray-800 text-white font-semibold rounded-lg text-lg border border-gray-700 hover:bg-gray-700 transition-colors"
        >
          Sou Mototaxista
        </Link>
      </div>

      <div className="mt-auto pt-8">
        <Link href="/admin/login" className="text-sm text-gray-500 hover:text-white transition-colors">
          Acesso Administrativo
        </Link>
      </div>
    </div>
  );
}
