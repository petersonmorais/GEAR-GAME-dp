"use client"

import { useState, useEffect } from "react"
import { useGame } from "@/contexts/game-context"
import { PlayerSetupScreen } from "./player-setup-screen"
import MainMenu from "./main-menu"
import GachaScreen from "./gacha-screen"
import CollectionScreen from "./collection-screen"
import DeckBuilderScreen from "./deck-builder-screen"
import DuelScreen from "./duel-screen"
import HistoryScreen from "./history-screen"
import SettingsScreen from "./settings-screen"
import FriendsScreen from "./friends-screen"

export type GameScreen =
  | "menu"
  | "gacha"
  | "collection"
  | "deck-builder"
  | "duel-bot"
  | "duel-player"
  | "history"
  | "settings"
  | "create-room"
  | "join-room"
  | "friends"

export function GameWrapper() {
  const { playerProfile } = useGame()
  const [currentScreen, setCurrentScreen] = useState<GameScreen>("menu")
  const [duelMode, setDuelMode] = useState<"bot" | "player">("bot")
  const [showSetup, setShowSetup] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Wait for profile to load from localStorage
    const timer = setTimeout(() => {
      setIsLoaded(true)
      // Check if player has completed setup
      if (!playerProfile.hasCompletedSetup) {
        setShowSetup(true)
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [playerProfile.hasCompletedSetup])

  const navigateTo = (screen: GameScreen) => {
    if (screen === "duel-bot") {
      setDuelMode("bot")
      setCurrentScreen("duel-bot")
    } else if (screen === "duel-player") {
      setDuelMode("player")
      setCurrentScreen("duel-player")
    } else {
      setCurrentScreen(screen)
    }
  }

  const handleSetupComplete = () => {
    setShowSetup(false)
  }

  // Show loading state briefly
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-cyan-400 animate-pulse">Carregando...</p>
        </div>
      </div>
    )
  }

  // Show setup screen for first-time players
  if (showSetup) {
    return <PlayerSetupScreen onComplete={handleSetupComplete} />
  }

  return (
    <>
      {currentScreen === "menu" && <MainMenu onNavigate={navigateTo} />}
      {currentScreen === "gacha" && <GachaScreen onBack={() => navigateTo("menu")} />}
      {currentScreen === "collection" && <CollectionScreen onBack={() => navigateTo("menu")} />}
      {currentScreen === "deck-builder" && <DeckBuilderScreen onBack={() => navigateTo("menu")} />}
      {(currentScreen === "duel-bot" || currentScreen === "duel-player") && (
        <DuelScreen mode={duelMode} onBack={() => navigateTo("menu")} />
      )}
      {currentScreen === "history" && <HistoryScreen onBack={() => navigateTo("menu")} />}
      {currentScreen === "settings" && <SettingsScreen onBack={() => navigateTo("menu")} />}
      {currentScreen === "friends" && <FriendsScreen onBack={() => navigateTo("menu")} />}
    </>
  )
}
