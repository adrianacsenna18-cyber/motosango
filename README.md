# MotoSango - Mototáxi Regional

Este é o projeto **MotoSango**, um PWA leve para mototáxi regional construído com **Next.js**, **Supabase** e **TailwindCSS**.

## 🚀 Como iniciar

1. Certifique-se de ter o **Node.js** instalado em seu sistema (versão 18+).
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente:
   - Copie o arquivo `.env.example` para `.env.local`
   - Preencha com as credenciais do seu projeto Supabase.
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## 🛠️ Stack Tecnológica
- **Framework:** Next.js (App Router)
- **Estilização:** TailwindCSS
- **Banco de Dados/Auth:** Supabase
- **Ícones:** Lucide React

## 🗄️ Estrutura do Banco de Dados (Supabase)
Você precisará criar as seguintes tabelas no seu Supabase:
- `users` (clientes)
- `drivers` (mototaxistas)
- `rides` (corridas)
- `payments` (pagamentos)
- `admin` (administrador)
- `cities` (cidades atendidas)
- `settings` (configurações gerais)
