# Ultimate Guardian Cards

## Visão Geral

As cartas **Ultimate Guardian** são um novo tipo de carta introduzido no jogo Gear Perks. Elas funcionam de forma similar às cartas **Ultimate Gear**, sendo jogadas na mesma **zona verde (zona de Ultimate)** do campo de batalha.

## Características

- **Tipo**: `ultimateGuardian`
- **Zona de Jogo**: Zona de Ultimate (zona verde) - mesma zona das Ultimate Gears
- **Raridade**: LR (Legendary Rare)
- **Elemento**: Variam conforme a carta (Aquos, Ventus, Pyrus, Darkus)
- **DP Base**: 0 (concedem bônus de DP à unidade equipada)

## Mecânica de Jogo

### Como Jogar
1. As cartas Ultimate Guardian são jogadas na **zona de Ultimate** (zona verde)
2. Elas funcionam como equipamentos para unidades específicas
3. Concedem bônus de DP e habilidades especiais à unidade equipada
4. Seguem as mesmas regras de Ultimate Gears:
   - Só podem ser jogadas na zona de Ultimate
   - Não podem ser jogadas em outras zonas do campo

### Na Coleção
- Aparecem com o filtro "Ultimate Guardian"
- São classificadas separadamente das Ultimate Gears
- Podem ser adicionadas aos decks através do Deck Builder

### No Deck Builder
- Disponíveis no filtro de tipo "Ultimate Guardian"
- Seguem as mesmas regras de limite de cartas do deck
- Máximo de 4 cópias por carta (regra padrão)

## Cartas Ultimate Guardian Disponíveis

### 1. MEFISTO FÓLES
**Ultimate Guardian de Arthur**

![Mefisto Fóles](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MEFISTO%20F%C3%93LES-8c33opXwUKH0bR3TfPPUdvoF7oiwwY.png)

- **Elemento**: Darkus (Trevas)
- **Raridade**: LR
- **Equipável em**: Arthur
- **Efeitos**:
  - Arthur ganha +2 DP
  - Você pode selecionar 1 Card no campo do seu oponente e destruí-lo
  - Esta habilidade de controle pode ser ativada somente uma única vez por duelo

---

### 2. KENSEI IFRAID
**Ultimate Guardian de Jaden**

![Kensei Ifraid](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/KENSEI%20IFRAID-7z0k9ejgnCcGlEs8anbb6chFPqmQE3.png)

- **Elemento**: Pyrus (Fogo)
- **Raridade**: LR
- **Equipável em**: Jaden
- **Efeitos**:
  - Jaden ganha +3 DP
  - Você pode selecionar e destruir 1 Card no campo do seu oponente
  - Se o Card destruído for uma unidade, cause 4 DP de dano direto aos LP do oponente

---

### 3. NIGHTMARE ARMAGEDDON
**Ultimate Guardian de Lil-Laep**

![Nightmare Armageddon](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NIGHTMARE%20ARMAGEDDON-SDfihFDEFWNKjp8FwnAIJgiACOCIt7.png)

- **Elemento**: Darkus (Trevas)
- **Raridade**: LR
- **Equipável em**: Lil-Laep
- **Efeitos**:
  - Lil-Laep ganha +7 DP
  - Você pode selecionar 1 Card de unidade com 3 ou menos de DP no campo do seu oponente e destruí-lo
  - Esta habilidade só pode ser ativada somente uma única vez

---

### 4. ÍSGRIMM FENRIR
**Ultimate Guardian de Ventus**

![Ísgrimm Fenrir](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%C3%8DSGRIMM%20FENRIR-E5yR5B9SKnEenoPCDqA8uvKwOHkRrG.png)

- **Elemento**: Ventus (Vento)
- **Raridade**: LR
- **Equipável em**: Unidades Ventus
- **Efeitos**:
  - Unidade Ventus ganha +2 DP
  - Quando a Unidade Ventus ataca: Você pode selecionar uma Carta de Unidade Ventus do seu campo e ela ganha +2 DP
  - Este efeito não pode ser aplicado na Unidade que esse Guardião está equipado

---

## Diferenças entre Ultimate Guardian e Ultimate Gear

| Característica | Ultimate Guardian | Ultimate Gear |
|----------------|-------------------|---------------|
| **Zona de Jogo** | Zona de Ultimate (verde) | Zona de Ultimate (verde) |
| **Função** | Equipamento para unidades específicas | Equipamento para unidades específicas |
| **Raridade Comum** | LR | SR, UR, LR |
| **Categoria na Coleção** | "Ultimate Guardian" | "Ultimate Gear" |
| **Efeitos** | Bônus de DP + habilidades de controle | Varia por carta |

## Implementação Técnica

### Tipo de Carta
```typescript
type: "ultimateGuardian"
```

### Estrutura de Dados
```typescript
{
  id: string
  name: string
  image: string
  rarity: "LR"
  type: "ultimateGuardian"
  element: "Aquos" | "Ventus" | "Pyrus" | "Darkus"
  dp: 0
  ability: string
  abilityDescription: string
  attack: ""
  category: string // e.g., "Darkness Ultimate Guardian"
  requiresEquip?: string // Nome da unidade requerida
}
```

### Zonas e Gameplay
- As cartas Ultimate Guardian são detectadas pela função `isUltimateCard()` no duel-screen
- São tratadas como cartas de unidade pela função `isUnitCard()` para certos efeitos
- Só podem ser jogadas na `ultimateZone` do campo de batalha
- Funcionam tanto no modo VS Bot quanto no modo Multiplayer Online

## Obtenção das Cartas

As cartas Ultimate Guardian podem ser obtidas através:
1. **Sistema Gacha** - Disponíveis nos banners de gacha com raridade LR
2. **Gift Box** - Podem ser adicionadas como recompensas especiais
3. **Promoções e Eventos** - Futuras implementações

## Compatibilidade

- ✅ Sistema de Coleção
- ✅ Deck Builder
- ✅ Duelo VS Bot
- ✅ Duelo Online Multiplayer
- ✅ Sistema Gacha
- ✅ Filtros e Busca
- ✅ Traduções (PT, EN, JA)

## Roadmap Futuro

- [ ] Animações especiais ao equipar Ultimate Guardians
- [ ] Efeitos visuais únicos para cada Guardian
- [ ] Sons e vozes para ativação de habilidades
- [ ] Mais cartas Ultimate Guardian de outros elementos
- [ ] Synergy effects entre Guardians
