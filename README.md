# 🏥 BELUTI CLINIC - Sistema de Gestão Estética Médica

Sistema completo e integrado para clínicas de estética médica, desenvolvido com React + TypeScript + Vite.

## 🚀 Stack Tecnológico

- **Frontend**: React 18 + TypeScript + Vite
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **Hosting**: Vercel
- **Version Control**: GitHub

## 📋 Módulos Implementados

- ✅ Dashboard com estatísticas
- ✅ Gestão de Pacientes (CRUD)
- ✅ Agenda de Agendamentos
- ✅ Relatórios e Analytics
- ✅ Autenticação Supabase
- ✅ Interface Responsiva

## 🔧 Setup Local

```bash
# Instalar dependências
npm install

# Criar arquivo .env
cp .env.example .env

# Adicionar suas credenciais Supabase
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_ANON_KEY=...

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📊 Banco de Dados Supabase

Crie as seguintes tabelas no Supabase:

### Tabela: pacientes
```sql
create table pacientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text,
  telefone text,
  data_nascimento date,
  status text default 'Ativa',
  created_at timestamp default now()
);
```

### Tabela: agendamentos
```sql
create table agendamentos (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid references pacientes(id),
  data_hora timestamp not null,
  procedimento text,
  profissional_id text,
  status text default 'Agendado',
  created_at timestamp default now()
);
```

## 🔐 Variáveis de Ambiente

Obtenha no [Supabase Dashboard](https://app.supabase.com):
- `VITE_SUPABASE_URL`: URL do seu projeto
- `VITE_SUPABASE_ANON_KEY`: Chave anônima

## 🚢 Deploy Vercel

1. Conecte seu repositório GitHub no Vercel
2. Adicione as variáveis de ambiente
3. Deploy automático a cada push!

## 👨‍💻 Desenvolvido por

**Claude** - Assistant IA

---

**BELUTI - Estética Médica** © 2026
