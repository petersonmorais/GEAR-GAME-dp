# Classificação de Cartas - Gear Perks

## Tipos de Cartas

### 1. Unit Cards (Cartas de Unidade)
**Tipo:** `type: "unit"`  
**Zona de Jogo:** Unit Zone (Zona de Unidades - 5 espaços amarelos)

Cartas de unidade são personagens que combatem diretamente no campo de batalha. Elas podem atacar, defender e usar habilidades. Algumas unidades podem **equipar** Ultimate Guardians para ganhar bônus adicionais.

**Exemplos:**
- **Hrotti LR** - Scandinavian Angel Hrotti (Aquos)
- **Jaden LR** - Jaden Hainaegi (Pyrus)
- **Arthur LR** - Rei Arthur (Darkus)
- **Arthur UR** - Rei Arthur (Darkus)
- Fehnon Hoskie
- Morgana Pendragon
- E todas as outras unidades de combate

**Características:**
- Possuem DP (Defense Points)
- Podem atacar e defender
- Ocupam a zona de unidades durante o jogo
- Algumas podem equipar Ultimate Guardians ou Ultimate Gears

---

### 2. Ultimate Guardian Cards
**Tipo:** `type: "ultimateGuardian"`  
**Zona de Jogo:** Ultimate Zone (Zona Ultimate - espaço verde único)

Ultimate Guardians são **equipamentos especiais** que se ligam a unidades específicas, fornecendo bônus de DP permanentes e habilidades únicas ativáveis. Eles NÃO são unidades - são cartas de suporte que potencializam unidades existentes.

**Cartas Ultimate Guardian:**

1. **MEFISTO FÓLES** (Darkus - LR)
   - Equipa em: Rei Arthur
   - Bônus: +2 DP permanente
   - Habilidade: Destruir 1 carta do oponente (uma vez por duelo)

2. **KENSEI IFRAID** (Pyrus - LR)
   - Equipa em: Jaden Hainaegi
   - Bônus: +3 DP permanente
   - Habilidade: Destruir 1 carta do oponente; se for unidade, causa 4 DP de dano direto aos LP

3. **NIGHTMARE ARMAGEDDON** (Darkus - LR)
   - Equipa em: Lil-Laep
   - Bônus: +7 DP permanente
   - Habilidade: Destruir 1 unidade inimiga com 3 DP ou menos

4. **ÍSGRIMM FENRIR** (Ventus - LR)
   - Equipa em: Qualquer unidade Ventus
   - Bônus: +2 DP permanente
   - Habilidade Passiva: Quando a unidade equipada ataca, outra unidade Ventus aliada ganha +2 DP até o fim da fase de batalha

**Características:**
- **Não possuem DP próprio** (dp: 0)
- **Não podem atacar ou defender sozinhos**
- Ocupam a zona ultimate (espaço verde)
- Requerem uma unidade específica no campo para ativar seus efeitos
- Fornecem bônus de DP permanente à unidade equipada
- Possuem habilidades únicas ativáveis (exceto Fenrir que é passiva)

---

### 3. Ultimate Gear Cards
**Tipo:** `type: "ultimateGear"`  
**Zona de Jogo:** Ultimate Zone (Zona Ultimate - espaço verde único)

Similar aos Ultimate Guardians, mas são uma categoria diferente de equipamentos ultimates.

**Exemplos:**
- ODEN SWORD
- TWILIGH AVALON
- PROTONIX SWORD
- ULLRBOGI
- FORNBRENNA

---

## Diferenças Importantes

| Aspecto | Unit Cards | Ultimate Guardian | Ultimate Gear |
|---------|-----------|-------------------|---------------|
| **Tipo** | `unit` | `ultimateGuardian` | `ultimateGear` |
| **Zona de Jogo** | Unit Zone (amarelo) | Ultimate Zone (verde) | Ultimate Zone (verde) |
| **Pode Atacar?** | ✅ Sim | ❌ Não | ❌ Não |
| **DP Próprio** | ✅ Sim (3-6 DP) | ❌ Não (dp: 0) | ❌ Não (dp: 0) |
| **Função** | Combater | Equipar unidades | Equipar unidades |
| **Coleção** | Aba "Units" | Aba "Ultimate Guardian" | Aba "Ultimate Gear" |

---

## Como Funcionam os Ultimate Guardians no Jogo

### Passo 1: Colocar no Campo
Durante a **Main Phase**, o jogador pode colocar um Ultimate Guardian da mão na **Ultimate Zone** (espaço verde).

### Passo 2: Verificação de Unidade
O sistema verifica se a unidade requerida está no campo:
- **MEFISTO FÓLES** → Precisa de "Rei Arthur"
- **KENSEI IFRAID** → Precisa de "Jaden Hainaegi"
- **NIGHTMARE ARMAGEDDON** → Precisa de "Lil-Laep"
- **ÍSGRIMM FENRIR** → Precisa de qualquer unidade com elemento Ventus

### Passo 3: Aplicação de Bônus
Se a unidade estiver no campo, ela recebe **imediatamente** o bônus de DP:
- Mefisto Fóles: +2 DP para Arthur
- Kensei Ifraid: +3 DP para Jaden
- Nightmare Armageddon: +7 DP para Lil-Laep
- Ísgrimm Fenrir: +2 DP para a unidade Ventus

### Passo 4: Ativação de Habilidade
Durante a **Main Phase**, o jogador pode clicar no botão **"ATIVAR"** que aparece sobre o Ultimate Guardian para usar sua habilidade única. Esta habilidade só pode ser usada **uma vez por duelo**.

### Passo 5: Ísgrimm Fenrir - Caso Especial
Este Guardian possui uma habilidade **passiva** ao invés de ativável:
- Quando a unidade Ventus equipada **ataca**, o jogador automaticamente seleciona outra unidade Ventus aliada
- Essa unidade recebe +2 DP **temporários** até o fim da fase de batalha

---

## Regras de Deck Building

### Ultimate Guardians
- Máximo de **1 cópia** de cada Ultimate Guardian por deck
- Recomenda-se incluir a unidade correspondente no deck

### Unit Cards
- Máximo de **3 cópias** de cada unidade por deck (exceto se regras especiais aplicarem)
- Podem ser incluídas mesmo sem seus Ultimate Guardians correspondentes

---

## Exemplos de Deck Synergy

### Deck Arthur Dark Control
**Unidades:**
- 3x Rei Arthur (UR/LR mix)
- Outras unidades Darkus

**Ultimate Guardian:**
- 1x MEFISTO FÓLES

**Estratégia:** Arthur ganha +2 DP e pode destruir cartas críticas do oponente com a habilidade de Mefisto.

---

### Deck Jaden Pyrus Aggro
**Unidades:**
- 3x Jaden Hainaegi (UR/LR)
- Outras unidades Pyrus

**Ultimate Guardian:**
- 1x KENSEI IFRAID

**Estratégia:** Jaden ganha +3 DP e pode destruir defesas inimigas causando dano massivo aos LP.

---

### Deck Ventus Swarm
**Unidades:**
- Múltiplas unidades Ventus de baixo custo
- Foco em números

**Ultimate Guardian:**
- 1x ÍSGRIMM FENRIR

**Estratégia:** Fenrir equipa em qualquer Ventus, e cada ataque fortalece outra unidade aliada, criando um efeito cascata de poder.

---

## Verificação de Classificação

Para verificar se uma carta está corretamente classificada:

```typescript
// Código de verificação
const isUltimateGuardian = card.type === "ultimateGuardian"
const isUnit = card.type === "unit"

// Ultimate Guardians corretos:
// - mefisto-foles-lr
// - kensei-ifraid-lr
// - nightmare-armageddon-lr
// - isgrimm-fenrir-lr

// Units que USAM Ultimate Guardians:
// - arthur-lr, arthur-ur (equipam Mefisto Fóles)
// - jaden-lr (equipa Kensei Ifraid)
// - Qualquer unidade Ventus (equipa Ísgrimm Fenrir)
```

---

## Conclusão

A classificação está correta quando:
- ✅ Cartas de combate direto são `type: "unit"`
- ✅ Equipamentos Ultimate Guardian são `type: "ultimateGuardian"`
- ✅ Units aparecem na aba "Units" da coleção
- ✅ Ultimate Guardians aparecem na aba "Ultimate Guardian" da coleção
- ✅ Units vão para a zona amarela durante o jogo
- ✅ Ultimate Guardians vão para a zona verde durante o jogo
