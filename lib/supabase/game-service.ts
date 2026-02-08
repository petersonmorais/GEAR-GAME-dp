import { createClient } from '@/lib/supabase/client'
import type { Card } from '@/contexts/game-context'

export interface Profile {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  coins: number
  gems: number
  level: number
  experience: number
  created_at: string
  updated_at: string
}

export interface CardCollection {
  id: string
  user_id: string
  card_id: string
  quantity: number
  acquired_at: string
}

export interface Deck {
  id: string
  user_id: string
  name: string
  cards: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MatchHistory {
  id: string
  player_id: string
  opponent_id: string | null
  opponent_type: 'bot' | 'player'
  result: 'win' | 'loss' | 'draw'
  player_deck: string[] | null
  opponent_deck: string[] | null
  duration: number | null
  played_at: string
}

export interface GachaHistory {
  id: string
  user_id: string
  pack_type: string
  cards_obtained: string[]
  cost: number
  currency: 'coins' | 'gems'
  pulled_at: string
}

export interface Achievement {
  id: string
  user_id: string
  achievement_id: string
  achievement_name: string
  achievement_description: string | null
  progress: number
  target: number
  completed: boolean
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface LeaderboardEntry {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  level: number
  experience: number
  total_matches: number
  wins: number
  losses: number
  win_rate: number
}

export class GameService {
  private supabase = createClient()

  // Profile operations
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('[v0] Error fetching profile:', error)
      return null
    }
    return data
  }

  async updateProfile(
    userId: string,
    updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('[v0] Error updating profile:', error)
      return null
    }
    return data
  }

  async updateCoins(userId: string, amount: number): Promise<boolean> {
    const profile = await this.getProfile(userId)
    if (!profile) return false

    const newCoins = Math.max(0, profile.coins + amount)
    const updated = await this.updateProfile(userId, { coins: newCoins })
    return updated !== null
  }

  async updateGems(userId: string, amount: number): Promise<boolean> {
    const profile = await this.getProfile(userId)
    if (!profile) return false

    const newGems = Math.max(0, profile.gems + amount)
    const updated = await this.updateProfile(userId, { gems: newGems })
    return updated !== null
  }

  async addExperience(userId: string, exp: number): Promise<boolean> {
    const profile = await this.getProfile(userId)
    if (!profile) return false

    const newExp = profile.experience + exp
    const newLevel = Math.floor(newExp / 100) + 1 // Simple leveling formula
    const updated = await this.updateProfile(userId, {
      experience: newExp,
      level: newLevel,
    })
    return updated !== null
  }

  // Card Collection operations
  async getCardCollection(userId: string): Promise<CardCollection[]> {
    const { data, error } = await this.supabase
      .from('card_collection')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error('[v0] Error fetching card collection:', error)
      return []
    }
    return data || []
  }

  async addCardToCollection(
    userId: string,
    cardId: string,
    quantity: number = 1
  ): Promise<boolean> {
    // Check if card already exists
    const { data: existing } = await this.supabase
      .from('card_collection')
      .select('*')
      .eq('user_id', userId)
      .eq('card_id', cardId)
      .single()

    if (existing) {
      // Update quantity
      const { error } = await this.supabase
        .from('card_collection')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)

      if (error) {
        console.error('[v0] Error updating card quantity:', error)
        return false
      }
    } else {
      // Insert new card
      const { error } = await this.supabase
        .from('card_collection')
        .insert({ user_id: userId, card_id: cardId, quantity })

      if (error) {
        console.error('[v0] Error adding card to collection:', error)
        return false
      }
    }
    return true
  }

  // Deck operations
  async getDecks(userId: string): Promise<Deck[]> {
    const { data, error } = await this.supabase
      .from('decks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[v0] Error fetching decks:', error)
      return []
    }
    return data || []
  }

  async createDeck(
    userId: string,
    name: string,
    cards: string[]
  ): Promise<Deck | null> {
    const { data, error } = await this.supabase
      .from('decks')
      .insert({ user_id: userId, name, cards })
      .select()
      .single()

    if (error) {
      console.error('[v0] Error creating deck:', error)
      return null
    }
    return data
  }

  async updateDeck(
    deckId: string,
    updates: { name?: string; cards?: string[]; is_active?: boolean }
  ): Promise<Deck | null> {
    const { data, error } = await this.supabase
      .from('decks')
      .update(updates)
      .eq('id', deckId)
      .select()
      .single()

    if (error) {
      console.error('[v0] Error updating deck:', error)
      return null
    }
    return data
  }

  async deleteDeck(deckId: string): Promise<boolean> {
    const { error } = await this.supabase.from('decks').delete().eq('id', deckId)

    if (error) {
      console.error('[v0] Error deleting deck:', error)
      return false
    }
    return true
  }

  // Match History operations
  async addMatchResult(
    playerId: string,
    opponentId: string | null,
    opponentType: 'bot' | 'player',
    result: 'win' | 'loss' | 'draw',
    playerDeck: string[] | null = null,
    opponentDeck: string[] | null = null,
    duration: number | null = null
  ): Promise<boolean> {
    const { error } = await this.supabase.from('match_history').insert({
      player_id: playerId,
      opponent_id: opponentId,
      opponent_type: opponentType,
      result,
      player_deck: playerDeck,
      opponent_deck: opponentDeck,
      duration,
    })

    if (error) {
      console.error('[v0] Error adding match result:', error)
      return false
    }

    // Award experience based on result
    const expGain = result === 'win' ? 50 : result === 'draw' ? 20 : 10
    await this.addExperience(playerId, expGain)

    return true
  }

  async getMatchHistory(
    userId: string,
    limit: number = 10
  ): Promise<MatchHistory[]> {
    const { data, error } = await this.supabase
      .from('match_history')
      .select('*')
      .eq('player_id', userId)
      .order('played_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('[v0] Error fetching match history:', error)
      return []
    }
    return data || []
  }

  // Gacha History operations
  async addGachaPull(
    userId: string,
    packType: string,
    cardsObtained: string[],
    cost: number,
    currency: 'coins' | 'gems'
  ): Promise<boolean> {
    const { error } = await this.supabase.from('gacha_history').insert({
      user_id: userId,
      pack_type: packType,
      cards_obtained: cardsObtained,
      cost,
      currency,
    })

    if (error) {
      console.error('[v0] Error adding gacha pull:', error)
      return false
    }

    // Deduct currency
    if (currency === 'coins') {
      await this.updateCoins(userId, -cost)
    } else {
      await this.updateGems(userId, -cost)
    }

    // Add cards to collection
    for (const cardId of cardsObtained) {
      await this.addCardToCollection(userId, cardId)
    }

    return true
  }

  async getGachaHistory(
    userId: string,
    limit: number = 10
  ): Promise<GachaHistory[]> {
    const { data, error } = await this.supabase
      .from('gacha_history')
      .select('*')
      .eq('user_id', userId)
      .order('pulled_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('[v0] Error fetching gacha history:', error)
      return []
    }
    return data || []
  }

  // Leaderboard operations
  async getLeaderboard(limit: number = 100): Promise<LeaderboardEntry[]> {
    const { data, error } = await this.supabase
      .from('leaderboard')
      .select('*')
      .limit(limit)

    if (error) {
      console.error('[v0] Error fetching leaderboard:', error)
      return []
    }
    return data || []
  }

  // Achievement operations
  async getAchievements(userId: string): Promise<Achievement[]> {
    const { data, error } = await this.supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error('[v0] Error fetching achievements:', error)
      return []
    }
    return data || []
  }

  async updateAchievementProgress(
    userId: string,
    achievementId: string,
    progress: number
  ): Promise<boolean> {
    const { data: existing } = await this.supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .single()

    if (existing) {
      const completed = progress >= existing.target
      const { error } = await this.supabase
        .from('achievements')
        .update({
          progress,
          completed,
          completed_at: completed ? new Date().toISOString() : null,
        })
        .eq('id', existing.id)

      if (error) {
        console.error('[v0] Error updating achievement:', error)
        return false
      }
    }

    return true
  }
}

// Singleton instance
export const gameService = new GameService()
