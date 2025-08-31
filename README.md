# Éden Frontend 🌱

Sistema de irrigação inteligente com monitoramento climático em tempo real.

## Funcionalidades

- **Dashboard de Clima**: Dados meteorológicos em tempo real da API Open-Meteo
- **Recomendações de Irrigação**: Cálculo automático baseado em temperatura do solo e umidade
- **Gestão de Setores**: Controle individual de áreas de irrigação com cálculo de ML/dia
- **Autenticação**: Sistema completo com Supabase Auth
- **Interface Responsiva**: Design moderno com Tailwind CSS e shadcn/ui

## Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou pnpm

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/Eden-front.git

# Navegue para o diretório
cd Eden-front

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.development .env

# Inicie o servidor de desenvolvimento
npm run dev
```

### Variáveis de Ambiente

Configure no arquivo `.env`:

```env
VITE_API_URL=https://eden-backend-vv5e.vercel.app
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/abab82a8-b027-4d30-8ab0-abe1877aafd4) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
