# Supabase Integration - Gear Perks

## Visão Geral

Este documento detalha a implementação completa do Supabase no jogo Gear Perks, incluindo autenticação, banco de dados, e todas as funcionalidades backend necessárias para um servidor funcionando.

## 📋 Sumário

1. [Configuração Inicial](#configuração-inicial)
2. [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados)
3. [Autenticação](#autenticação)
4. [Operações do Banco de Dados](#operações-do-banco-de-dados)
5. [Integração com o Jogo](#integração-com-o-jogo)
6. [Testes](#testes)

---

## Configuração Inicial

### Variáveis de Ambiente

As seguintes variáveis de ambiente já estão configuradas no projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Arquivos de Cliente Supabase

```
lib/supabase/
├── client.ts         # Cliente para uso no navegador
├── server.ts         # Cliente para uso no servidor
├── proxy.ts          # Proxy para gerenciar sessões
└── game-service.ts   # Serviço de operações do jogo
```

### Middleware

O arquivo `middleware.ts` na raiz do projeto gerencia a autenticação e refresh de tokens automaticamente.

---

## Estrutura do Banco de Dados

### Tabelas Criadas

#### 1. **profiles** - Perfis de Jogadores

```sql
id: UUID (PK, FK -> auth.users)
username: TEXT (UNIQUE, NOT NULL)
display_name: TEXT
avatar_url: TEXT
coins: INTEGER (default 1000)
gems: INTEGER (default 0)
level: INTEGER (default 1)
experience: INTEGER (default 0)
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

**RLS Policies:**
- Usuários podem ver seus próprios perfis
- Usuários podem atualizar seus próprios perfis
- Todos podem ver perfis públicos (para leaderboards)

#### 2. **card_collection** - Coleção de Cartas

```sql
id: UUID (PK)
user_id: UUID (FK -> profiles)
card_id: TEXT
quantity: INTEGER (default 1)
acquired_at: TIMESTAMP
UNIQUE(user_id, card_id)
```

**RLS Policies:**
- Usuários só podem ver/modificar sua própria coleção

#### 3. **decks** - Decks de Cartas

```sql
id: UUID (PK)
user_id: UUID (FK -> profiles)
name: TEXT
cards: JSONB (array of card IDs)
is_active: BOOLEAN (default false)
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

**RLS Policies:**
- Usuários só podem ver/modificar seus próprios decks

#### 4. **match_history** - Histórico de Partidas

```sql
id: UUID (PK)
player_id: UUID (FK -> profiles)
opponent_id: UUID (FK -> profiles, nullable)
opponent_type: TEXT ('bot' | 'player')
result: TEXT ('win' | 'loss' | 'draw')
player_deck: JSONB
opponent_deck: JSONB
duration: INTEGER (seconds)
played_at: TIMESTAMP
```

**RLS Policies:**
- Usuários só podem ver seu próprio histórico

#### 5. **gacha_history** - Histórico de Gacha

```sql
id: UUID (PK)
user_id: UUID (FK -> profiles)
pack_type: TEXT
cards_obtained: JSONB (array of card IDs)
cost: INTEGER
currency: TEXT ('coins' | 'gems')
pulled_at: TIMESTAMP
```

**RLS Policies:**
- Usuários só podem ver seu próprio histórico

#### 6. **achievements** - Conquistas

```sql
id: UUID (PK)
user_id: UUID (FK -> profiles)
achievement_id: TEXT
achievement_name: TEXT
achievement_description: TEXT
progress: INTEGER (default 0)
target: INTEGER
completed: BOOLEAN (default false)
completed_at: TIMESTAMP
created_at: TIMESTAMP
updated_at: TIMESTAMP
UNIQUE(user_id, achievement_id)
```

**RLS Policies:**
- Usuários só podem ver suas próprias conquistas

#### 7. **leaderboard** - View de Ranking

```sql
VIEW que calcula:
- username
- level
- experience
- total_matches
- wins
- losses
- win_rate
```

### Triggers Automáticos

#### handle_new_user()
Cria automaticamente um perfil quando um novo usuário se registra:
- Gera username baseado no metadata ou cria um default
- Inicializa com 1000 coins
- Level 1, 0 gems, 0 XP

#### handle_updated_at()
Atualiza automaticamente o campo `updated_at` em tabelas relevantes.

---

## Autenticação

### Páginas de Autenticação

```
app/auth/
├── login/page.tsx           # Página de login
├── sign-up/page.tsx         # Página de registro
├── sign-up-success/page.tsx # Confirmação de registro
└── error/page.tsx           # Página de erro
```

### AuthProvider

O componente `AuthProvider` gerencia o estado de autenticação globalmente:

```tsx
import { AuthProvider } from '@/components/auth/auth-provider'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

### Hook useAuth

```tsx
import { useAuth } from '@/components/auth/auth-provider'

function MyComponent() {
  const { user, profile, loading, signOut, refreshProfile } = useAuth()
  
  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please login</div>
  
  return <div>Welcome {profile?.username}!</div>
}
```

### Fluxo de Autenticação

1. **Registro:**
   - Usuário preenche formulário em `/auth/sign-up`
   - Cria conta com email/senha
   - Trigger `handle_new_user()` cria perfil automaticamente
   - Redirecionado para `/auth/sign-up-success`
   - Usuário confirma email

2. **Login:**
   - Usuário faz login em `/auth/login`
   - Session é criada e armazenada em cookies
   - Redirecionado para home `/`

3. **Logout:**
   - Usuário clica em "Sign Out"
   - Session é destruída
   - Redirecionado para `/auth/login`

---

## Operações do Banco de Dados

### GameService

O `GameService` é um singleton que fornece métodos para todas as operações do jogo:

```typescript
import { gameService } from '@/lib/supabase/game-service'

// Perfil
const profile = await gameService.getProfile(userId)
await gameService.updateCoins(userId, 100)
await gameService.updateGems(userId, -50)
await gameService.addExperience(userId, 50)

// Coleção de Cartas
const collection = await gameService.getCardCollection(userId)
await gameService.addCardToCollection(userId, 'card-id', 3)

// Decks
const decks = await gameService.getDecks(userId)
const newDeck = await gameService.createDeck(userId, 'My Deck', ['card1', 'card2'])
await gameService.updateDeck(deckId, { name: 'Updated Name' })
await gameService.deleteDeck(deckId)

// Histórico de Partidas
await gameService.addMatchResult(
  playerId,
  opponentId,
  'bot',
  'win',
  playerDeck,
  opponentDeck,
  120 // duration in seconds
)
const history = await gameService.getMatchHistory(userId, 10)

// Gacha
await gameService.addGachaPull(
  userId,
  'Premium Pack',
  ['card1', 'card2', 'card3'],
  500,
  'coins'
)
const gachaHistory = await gameService.getGachaHistory(userId)

// Leaderboard
const leaderboard = await gameService.getLeaderboard(100)

// Conquistas
const achievements = await gameService.getAchievements(userId)
await gameService.updateAchievementProgress(userId, 'first_win', 1)
```

### Exemplo de Uso Completo

```typescript
'use client'

import { useAuth } from '@/components/auth/auth-provider'
import { gameService } from '@/lib/supabase/game-service'
import { useEffect, useState } from 'react'

export function MyGameComponent() {
  const { user, profile } = useAuth()
  const [decks, setDecks] = useState([])

  useEffect(() => {
    if (user) {
      loadDecks()
    }
  }, [user])

  async function loadDecks() {
    const userDecks = await gameService.getDecks(user!.id)
    setDecks(userDecks)
  }

  async function handleWin() {
    if (!user) return
    
    await gameService.addMatchResult(
      user.id,
      null,
      'bot',
      'win',
      null,
      null,
      60
    )
    
    // Adiciona moedas como recompensa
    await gameService.updateCoins(user.id, 100)
    
    // Atualiza o perfil
    await refreshProfile()
  }

  return (
    <div>
      <p>Coins: {profile?.coins}</p>
      <p>Level: {profile?.level}</p>
      <p>Decks: {decks.length}</p>
    </div>
  )
}
```

---

## Integração com o Jogo

### 1. Adicionar AuthProvider ao Layout

```tsx
// app/layout.tsx
import { AuthProvider } from '@/components/auth/auth-provider'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

### 2. Proteger Rotas

```tsx
// app/game/page.tsx
'use client'

import { useAuth } from '@/components/auth/auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function GamePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading) return <div>Loading...</div>
  if (!user) return null

  return <div>Game Content</div>
}
```

### 3. Sincronizar Dados do Jogo

```tsx
// Salvar deck após construir
async function saveDeck(deckCards: Card[]) {
  if (!user) return
  
  const cardIds = deckCards.map(c => c.id)
  await gameService.createDeck(user.id, 'My New Deck', cardIds)
}

// Salvar resultado da partida
async function saveMatchResult(result: 'win' | 'loss') {
  if (!user) return
  
  await gameService.addMatchResult(
    user.id,
    null,
    'bot',
    result,
    playerDeckCards,
    opponentDeckCards,
    matchDuration
  )
}

// Salvar compra de pack
async function buyPack(packType: string, cost: number) {
  if (!user || !profile) return
  
  if (profile.coins < cost) {
    alert('Not enough coins!')
    return
  }
  
  const cards = pullRandomCards() // Sua lógica de gacha
  const cardIds = cards.map(c => c.id)
  
  await gameService.addGachaPull(
    user.id,
    packType,
    cardIds,
    cost,
    'coins'
  )
  
  await refreshProfile()
}
```

---

## Testes

### Teste de Autenticação

1. Acesse `/auth/sign-up`
2. Crie uma conta com email válido
3. Verifique que o perfil foi criado automaticamente
4. Confirme email (check inbox/spam)
5. Faça login em `/auth/login`

### Teste de Operações do Banco

```typescript
// Test script (executar no console do navegador após login)
import { gameService } from '@/lib/supabase/game-service'

// Teste 1: Verificar perfil
const profile = await gameService.getProfile(user.id)
console.log('Profile:', profile)

// Teste 2: Adicionar cartas
await gameService.addCardToCollection(user.id, 'test-card-1', 5)
const collection = await gameService.getCardCollection(user.id)
console.log('Collection:', collection)

// Teste 3: Criar deck
const deck = await gameService.createDeck(user.id, 'Test Deck', ['card1', 'card2'])
console.log('Deck created:', deck)

// Teste 4: Registrar vitória
await gameService.addMatchResult(user.id, null, 'bot', 'win')
const history = await gameService.getMatchHistory(user.id)
console.log('Match history:', history)

// Teste 5: Verificar leaderboard
const leaderboard = await gameService.getLeaderboard(10)
console.log('Leaderboard:', leaderboard)
```

### Verificar Row Level Security

```sql
-- No Supabase SQL Editor
-- Teste 1: Verificar que usuários só veem seus próprios dados
SELECT * FROM profiles WHERE id = auth.uid();

-- Teste 2: Tentar acessar dados de outro usuário (deve falhar)
SELECT * FROM card_collection WHERE user_id != auth.uid();

-- Teste 3: Verificar que leaderboard é visível para todos
SELECT * FROM leaderboard LIMIT 10;
```

---

## Próximos Passos

1. **Adicionar Storage:** Implementar upload de avatars usando Supabase Storage
2. **Real-time:** Adicionar funcionalidade de duelos em tempo real com Supabase Realtime
3. **Edge Functions:** Criar funções serverless para lógica complexa de jogo
4. **Analytics:** Implementar tracking de eventos de jogo
5. **Admin Dashboard:** Criar painel administrativo para gerenciar usuários e conteúdo

---

## Troubleshooting

### Erro: "Row Level Security is enabled"
- Verifique que as policies RLS estão aplicadas corretamente
- Certifique-se que o usuário está autenticado
- Use `auth.uid()` nas policies para verificar ownership

### Erro: "Invalid API key"
- Verifique as variáveis de ambiente
- Certifique-se que as keys estão corretas no dashboard do Supabase

### Perfil não é criado automaticamente
- Verifique que o trigger `handle_new_user()` está ativo
- Check logs no Supabase Dashboard > Database > Logs

### Session expira muito rápido
- Configure refresh token no middleware
- Verifique configurações de JWT no Supabase Dashboard

---

## Recursos Adicionais

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime](https://supabase.com/docs/guides/realtime)

---

**Implementação completa e funcionando! O servidor Supabase está operacional e todas as funcionalidades estão disponíveis para testes.**
