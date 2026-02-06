"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useGame } from "@/contexts/game-context"
import type { GameScreen } from "@/components/game/game-wrapper"
import {
  Swords,
  Bot,
  Users,
  Gift,
  BookOpen,
  Hammer,
  History,
  Settings,
  Coins,
  X,
  Sparkles,
  Star,
} from "lucide-react"
import Image from "next/image"

interface MainMenuProps {
  onNavigate: (screen: GameScreen) => void
}

export default function MainMenu({ onNavigate }: MainMenuProps) {
  const { t } = useLanguage()
  const { coins, giftBoxes, claimGift, hasUnclaimedGifts, playerProfile } = useGame()
  const [showPlayMenu, setShowPlayMenu] = useState(false)
  const [showGiftBox, setShowGiftBox] = useState(false)
  const [claimedCard, setClaimedCard] = useState<ReturnType<typeof claimGift>>(null)
  const [claimedCoins, setClaimedCoins] = useState<number | null>(null)
  const [isOpening, setIsOpening] = useState(false)
  const [isClaimingAll, setIsClaimingAll] = useState(false)
  const [claimAllResults, setClaimAllResults] = useState<{ cards: any[]; coins: number } | null>(null)
  // Falling card color configs - more vibrant and visible
  const CARD_COLORS = [
    { gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)", border: "#60a5fa", glow: "0 0 12px rgba(59,130,246,0.5)" },
    { gradient: "linear-gradient(135deg, #ef4444, #b91c1c)", border: "#f87171", glow: "0 0 12px rgba(239,68,68,0.5)" },
    { gradient: "linear-gradient(135deg, #f59e0b, #d97706)", border: "#fbbf24", glow: "0 0 12px rgba(245,158,11,0.5)" },
    { gradient: "linear-gradient(135deg, #a855f7, #7c3aed)", border: "#c084fc", glow: "0 0 12px rgba(168,85,247,0.5)" },
    { gradient: "linear-gradient(135deg, #10b981, #059669)", border: "#34d399", glow: "0 0 12px rgba(16,185,129,0.5)" },
    { gradient: "linear-gradient(135deg, #cbd5e1, #94a3b8)", border: "#e2e8f0", glow: "0 0 12px rgba(203,213,225,0.5)" },
  ]

  const [fallingCards, setFallingCards] = useState<Array<{
    id: number
    x: number
    delay: number
    duration: number
    width: number
    height: number
    colorIndex: number
    initialRotate: number
    swayDirection: number
  }>>([])

  useEffect(() => {
    const cards = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: (i * 4.3) % 100 + (Math.random() * 6 - 3), // spread evenly then jitter
      delay: (i * 0.8) % 16 + Math.random() * 2,
      duration: 14 + Math.random() * 8,
      width: 40 + Math.random() * 20,
      height: 56 + Math.random() * 28,
      colorIndex: i % CARD_COLORS.length,
      initialRotate: -15 + Math.random() * 30,
      swayDirection: Math.random() > 0.5 ? 1 : -1,
    }))
    setFallingCards(cards)
  }, [])

  const handleOpenGift = (giftId: string) => {
    setIsOpening(true)
    const gift = giftBoxes.find((g) => g.id === giftId)
    setTimeout(() => {
      const card = claimGift(giftId)
      setClaimedCard(card)
      if (gift?.coinsReward && !card) {
        setClaimedCoins(gift.coinsReward)
      }
      setIsOpening(false)
    }, 1500)
  }

  const handleClaimAll = () => {
    setIsClaimingAll(true)
    const cards: any[] = []
    let totalCoins = 0
    
    setTimeout(() => {
      giftBoxes.forEach((gift) => {
        if (!gift.claimed) {
          const card = claimGift(gift.id)
          if (card) {
            cards.push(card)
          } else if (gift.coinsReward) {
            totalCoins += gift.coinsReward
          }
        }
      })
      
      setClaimAllResults({ cards, coins: totalCoins })
      setIsClaimingAll(false)
    }, 1500)
  }

  const unclaimedGifts = giftBoxes.filter((g) => !g.claimed)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-cyan-900/20 animate-gradient" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        
        {/* Subtle radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.5)_100%)]" />
      </div>

      {/* Falling glowing cards */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
        {fallingCards.map((card) => {
          const color = CARD_COLORS[card.colorIndex]
          const swayDuration = 4 + (card.id % 5) * 0.5
          const flipDuration = 7 + (card.id % 6) * 1.2
          const shimmerDuration = 3 + (card.id % 4) * 0.8
          return (
            <div
              key={card.id}
              className="absolute falling-card-wrapper"
              style={{
                left: `${card.x}%`,
                animation: `fallingCard ${card.duration}s linear infinite`,
                animationDelay: `${card.delay}s`,
              }}
            >
              {/* Sway wrapper - horizontal drift */}
              <div
                style={{
                  animation: `cardSway ${swayDuration}s ease-in-out infinite`,
                  animationDelay: `${card.delay * 0.4}s`,
                }}
              >
                {/* Flip/Rotate wrapper - 3D rotation */}
                <div
                  style={{
                    animation: `cardFlipSpin ${flipDuration}s ease-in-out infinite`,
                    animationDelay: `${card.delay * 0.7}s`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Card element */}
                  <div
                    style={{
                      width: `${card.width}px`,
                      height: `${card.height}px`,
                      background: color.gradient,
                      border: `1.5px solid ${color.border}`,
                      boxShadow: `${color.glow}, inset 0 1px 0 rgba(255,255,255,0.15)`,
                      borderRadius: "7px",
                      animation: `cardShimmer ${shimmerDuration}s ease-in-out infinite`,
                      animationDelay: `${card.delay * 0.2}s`,
                      backfaceVisibility: "hidden",
                    }}
                  >
                    {/* Card face details */}
                    <div style={{ padding: "4px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "hidden", borderRadius: "6px" }}>
                      {/* Card art area */}
                      <div style={{
                        width: "100%",
                        height: "52%",
                        borderRadius: "4px",
                        background: "rgba(255,255,255,0.13)",
                        boxShadow: "inset 0 1px 2px rgba(0,0,0,0.2)",
                      }} />
                      {/* Card text lines */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "3px", marginTop: "auto" }}>
                        <div style={{ width: "80%", height: "3px", borderRadius: "2px", background: "rgba(255,255,255,0.18)" }} />
                        <div style={{ width: "60%", height: "3px", borderRadius: "2px", background: "rgba(255,255,255,0.12)" }} />
                        <div style={{ width: "45%", height: "3px", borderRadius: "2px", background: "rgba(255,255,255,0.07)" }} />
                      </div>
                    </div>
                  </div>
                  {/* Card back (when flipped) */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: `${card.width}px`,
                      height: `${card.height}px`,
                      background: `linear-gradient(135deg, #1e293b, #334155)`,
                      border: `1.5px solid ${color.border}`,
                      boxShadow: color.glow,
                      borderRadius: "7px",
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <div style={{ 
                      width: "100%", height: "100%", 
                      display: "flex", alignItems: "center", justifyContent: "center",
                      borderRadius: "6px",
                      background: `repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.03) 4px, rgba(255,255,255,0.03) 8px)`,
                    }}>
                      <div style={{
                        width: "60%", height: "60%",
                        borderRadius: "4px",
                        border: `1px solid rgba(255,255,255,0.1)`,
                        background: "rgba(255,255,255,0.04)",
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Ambient light orbs for depth */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[0]">
        <div className="absolute top-[10%] left-[15%] w-72 h-72 bg-blue-500/[0.07] rounded-full blur-[80px] animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute top-[55%] right-[10%] w-56 h-56 bg-purple-500/[0.08] rounded-full blur-[60px] animate-pulse" style={{ animationDuration: "11s" }} />
        <div className="absolute bottom-[15%] left-[25%] w-64 h-64 bg-cyan-500/[0.07] rounded-full blur-[70px] animate-pulse" style={{ animationDuration: "9s" }} />
      </div>

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 p-4 flex justify-end items-center z-40">
        {/* Coins and Player Profile display */}
        <div className="flex flex-col items-end gap-2">
          {/* Coins */}
          <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
            <div className="w-12 h-12 relative -my-1">
              <Image
                src="/images/icons/gacha-coin.png"
                alt="Gacha Coin"
                width={48}
                height={48}
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </div>
            <span className="font-bold text-white text-xl">{coins.toLocaleString()}</span>
          </div>
          {/* Player Profile */}
          <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-full">
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-cyan-400/50 shadow-lg">
              {playerProfile.avatarUrl ? (
                <Image
                  src={playerProfile.avatarUrl || "/placeholder.svg"}
                  alt={playerProfile.name}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{playerProfile.name.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>
            <span className="font-medium text-white text-sm max-w-24 truncate">{playerProfile.name}</span>
          </div>
        </div>
      </div>

      {/* Logo */}
      <div className="mb-10 relative z-10 text-center flex flex-col items-center">
        {/* Version number above logo */}
        <div className="text-cyan-400/70 text-sm font-mono tracking-wider mb-4">v1.1.5</div>
        
        <div className="relative inline-block">
          {/* Main pulsating glow */}
          <div 
            className="absolute inset-0 scale-150"
            style={{ animation: "logoGlowPulse 4s ease-in-out infinite" }}
          >
            <div className="w-full h-full bg-gradient-to-r from-cyan-500 via-blue-400 to-cyan-500 rounded-full" />
          </div>
          
          {/* Electric ray - top left */}
          <div 
            className="absolute -top-8 -left-12 w-40 h-24 pointer-events-none"
            style={{ animation: "logoRayPulse 3.5s ease-in-out infinite", animationDelay: "0s" }}
          >
            <div className="w-full h-full bg-gradient-to-br from-cyan-400/80 via-blue-500/40 to-transparent blur-[8px] rounded-full" />
          </div>
          
          {/* Electric ray - top right */}
          <div 
            className="absolute -top-6 -right-10 w-36 h-20 pointer-events-none"
            style={{ animation: "logoRayPulse 3.5s ease-in-out infinite", animationDelay: "1.2s" }}
          >
            <div className="w-full h-full bg-gradient-to-bl from-blue-400/80 via-cyan-500/40 to-transparent blur-[8px] rounded-full" />
          </div>
          
          {/* Electric ray - bottom center */}
          <div 
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-16 pointer-events-none"
            style={{ animation: "logoRayPulse 3.5s ease-in-out infinite", animationDelay: "0.6s" }}
          >
            <div className="w-full h-full bg-gradient-to-t from-cyan-400/70 via-blue-400/30 to-transparent blur-[10px] rounded-full" />
          </div>
          
          {/* Electric flicker - left side */}
          <div 
            className="absolute top-1/2 -left-6 w-20 h-1.5 -translate-y-1/2 pointer-events-none"
            style={{ animation: "logoElectricFlicker 4s ease-in-out infinite", animationDelay: "0.3s" }}
          >
            <div className="w-full h-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent blur-[2px] rounded-full" />
          </div>
          
          {/* Electric flicker - right side */}
          <div 
            className="absolute top-1/3 -right-5 w-16 h-1.5 pointer-events-none"
            style={{ animation: "logoElectricFlicker 4s ease-in-out infinite", animationDelay: "2s" }}
          >
            <div className="w-full h-full bg-gradient-to-r from-transparent via-blue-300 to-transparent blur-[2px] rounded-full" />
          </div>

          {/* Bright outline glow */}
          <div className="absolute inset-0 scale-105">
            <div 
              className="w-full h-full rounded-3xl"
              style={{
                boxShadow: "0 0 40px rgba(56,189,248,0.3), 0 0 80px rgba(59,130,246,0.15), 0 0 120px rgba(56,189,248,0.08)",
                animation: "logoGlowPulse 3s ease-in-out infinite",
              }}
            />
          </div>

          <Image
            src="/images/gp-cg-logo.png"
            alt="Gear Perks Card Game"
            width={600}
            height={600}
            className="relative w-80 h-auto sm:w-96 md:w-[28rem] lg:w-[32rem]"
            style={{
              filter: "drop-shadow(0 0 20px rgba(56,189,248,0.5)) drop-shadow(0 0 50px rgba(59,130,246,0.25))",
            }}
            priority
          />
        </div>

        <p className="text-slate-500 text-sm mt-3 tracking-wider">2025 Gear Perks Oficial Card Game, Made in BRAZIL</p>
      </div>

      {/* Menu buttons */}
      <div className="flex flex-col gap-3 w-full max-w-sm relative z-10">
        {!showPlayMenu ? (
          <>
            {/* Play button - larger and more prominent */}
            <button
              onClick={() => setShowPlayMenu(true)}
              className="gacha-btn w-full h-16 text-xl font-bold rounded-2xl menu-btn-play text-white flex items-center justify-center gap-3 transition-all duration-300"
            >
              <Swords className="h-7 w-7" />
              {t("play")}
              <Star className="h-5 w-5 opacity-60" />
            </button>

            {/* Other menu buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onNavigate("gacha")}
                className="gacha-btn h-14 font-bold rounded-xl menu-btn-gacha text-white flex items-center justify-center gap-2 transition-all duration-300"
              >
                <Sparkles className="h-5 w-5" />
                {t("gacha")}
              </button>

              <button
                onClick={() => onNavigate("collection")}
                className="gacha-btn h-14 font-bold rounded-xl menu-btn-collection text-white flex items-center justify-center gap-2 transition-all duration-300"
              >
                <BookOpen className="h-5 w-5" />
                {t("collection")}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onNavigate("deck-builder")}
                className="gacha-btn h-14 font-bold rounded-xl menu-btn-deck text-white flex items-center justify-center gap-2 transition-all duration-300"
              >
                <Hammer className="h-5 w-5" />
                {t("deckBuilder")}
              </button>

              <button
                onClick={() => onNavigate("friends")}
                className="gacha-btn h-14 font-bold rounded-xl menu-btn-friends text-white flex items-center justify-center gap-2 transition-all duration-300"
              >
                <Users className="h-5 w-5" />
                Amigos
              </button>
            </div>

            {/* Gift Box button */}
            <button
              onClick={() => setShowGiftBox(true)}
              className="gacha-btn w-full h-14 font-bold rounded-xl menu-btn-gift text-white flex items-center justify-center gap-2 transition-all duration-300 relative"
            >
              <Gift className="h-5 w-5" />
              Gift Box
              {unclaimedGifts.length > 0 && (
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white text-sm font-bold rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-red-500/50">
                  {unclaimedGifts.length}
                </span>
              )}
            </button>

            {/* Secondary buttons */}
            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                onClick={() => onNavigate("history")}
                className="gacha-btn h-12 font-medium rounded-xl glass text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-all duration-300"
              >
                <History className="h-4 w-4" />
                {t("history")}
              </button>

              <button
                onClick={() => onNavigate("settings")}
                className="gacha-btn h-12 font-medium rounded-xl glass text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-all duration-300"
              >
                <Settings className="h-4 w-4" />
                {t("settings")}
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <button
              onClick={() => onNavigate("duel-bot")}
              className="gacha-btn w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all duration-300"
            >
              <Bot className="h-5 w-5" />
              {t("vsBot")}
            </button>

            <button
              onClick={() => onNavigate("duel-player")}
              className="gacha-btn w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 transition-all duration-300"
            >
              <Users className="h-5 w-5" />
              {t("vsPlayer")}
            </button>

            <button
              onClick={() => setShowPlayMenu(false)}
              className="w-full h-12 font-medium rounded-xl glass text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-all duration-300"
            >
              {t("back")}
            </button>
          </div>
        )}
      </div>

      {/* Gift Box Modal */}
      {showGiftBox && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-dark rounded-3xl max-w-md w-full p-6 relative border border-amber-500/20 shadow-2xl shadow-amber-500/10">
            <button
              onClick={() => {
                setShowGiftBox(false)
                setClaimedCard(null)
                setClaimedCoins(null)
                setClaimAllResults(null)
              }}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>

            <div className="flex items-center justify-center gap-3 mb-6">
              <Gift className="w-8 h-8 text-amber-400" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                Caixa de Presentes
              </h2>
            </div>

            {!claimedCard && !claimedCoins && !claimAllResults ? (
              unclaimedGifts.length > 0 ? (
                <>
                  {/* Claim All Button */}
                  {unclaimedGifts.length > 1 && (
                    <button
                      onClick={handleClaimAll}
                      disabled={isClaimingAll}
                      className="w-full gacha-btn h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 mb-4"
                    >
                      {isClaimingAll ? (
                        <>
                          <Sparkles className="w-4 h-4 animate-spin" />
                          Coletando...
                        </>
                      ) : (
                        <>
                          <Gift className="w-4 h-4" />
                          Coletar Tudo ({unclaimedGifts.length})
                        </>
                      )}
                    </button>
                  )}
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                    {unclaimedGifts.map((gift) => (
                      <div
                        key={gift.id}
                        className="bg-gradient-to-r from-pink-900/30 to-rose-900/30 border border-pink-500/30 rounded-2xl p-4"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl shadow-lg shadow-pink-500/30">
                            <Gift className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="font-bold text-white">{gift.title}</h3>
                        </div>
                        <p className="text-slate-300 text-sm mb-4">{gift.message}</p>
                        {gift.coinsReward && (
                          <div className="flex items-center gap-2 mb-3 text-amber-400">
                            <Coins className="w-4 h-4" />
                            <span>+{gift.coinsReward} Moedas</span>
                          </div>
                        )}
                        <button
                          onClick={() => handleOpenGift(gift.id)}
                          disabled={isOpening}
                          className="gacha-btn w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30"
                        >
                          {isOpening ? (
                            <>
                              <Sparkles className="w-4 h-4 animate-spin" />
                              Abrindo...
                            </>
                          ) : (
                            "Abrir Presente"
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-8 h-8 text-slate-500" />
                  </div>
                  <p className="text-slate-400">Nenhum presente disponível no momento.</p>
                </div>
              )
            ) : claimedCard ? (
              <div className="flex flex-col items-center py-4">
                <p className="text-amber-400 font-bold text-lg mb-4">Você recebeu:</p>
                <div className="relative animate-float">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 blur-2xl opacity-50 animate-pulse" />
                  <div
                    className={`relative w-48 h-72 rounded-2xl overflow-hidden shadow-2xl ${
                      claimedCard.rarity === "LR"
                        ? "rarity-lr"
                        : claimedCard.rarity === "UR"
                          ? "rarity-ur"
                          : claimedCard.rarity === "SR"
                            ? "rarity-sr"
                            : "rarity-r"
                    }`}
                  >
                    <Image
                      src={claimedCard.image || "/placeholder.svg"}
                      alt={claimedCard.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <h3 className="mt-4 text-xl font-bold text-white text-center">{claimedCard.name}</h3>
                <span
                  className={`mt-2 px-4 py-1 rounded-full text-sm font-bold ${
                    claimedCard.rarity === "LR"
                      ? "bg-gradient-to-r from-red-500 to-amber-500 text-white"
                      : claimedCard.rarity === "UR"
                        ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-black"
                        : claimedCard.rarity === "SR"
                          ? "bg-purple-500 text-white"
                          : "bg-slate-500 text-white"
                  }`}
                >
                  {claimedCard.rarity}
                </span>
                <button
                  onClick={() => {
                    setShowGiftBox(false)
                    setClaimedCard(null)
                  }}
                  className="mt-6 gacha-btn px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold shadow-lg shadow-cyan-500/30"
                >
                  Fechar
                </button>
              </div>
            ) : claimAllResults ? (
              <div className="flex flex-col items-center py-4">
                <p className="text-amber-400 font-bold text-lg mb-4">Você recebeu:</p>
                
                <div className="w-full max-h-[50vh] overflow-y-auto space-y-3 mb-4">
                  {/* Display collected cards */}
                  {claimAllResults.cards.length > 0 && (
                    <div className="bg-slate-800/50 rounded-2xl p-4">
                      <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-400" />
                        Cartas ({claimAllResults.cards.length})
                      </h3>
                      <div className="grid grid-cols-3 gap-2">
                        {claimAllResults.cards.map((card, index) => (
                          <div key={index} className="relative group">
                            <div
                              className={`relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-lg ${
                                card.rarity === "LR"
                                  ? "rarity-lr"
                                  : card.rarity === "UR"
                                    ? "rarity-ur"
                                    : card.rarity === "SR"
                                      ? "rarity-sr"
                                      : "rarity-r"
                              }`}
                            >
                              <Image
                                src={card.image || "/placeholder.svg"}
                                alt={card.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-1">
                              <span className="text-white text-[10px] font-bold text-center px-1">
                                {card.name}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Display collected coins */}
                  {claimAllResults.coins > 0 && (
                    <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 rounded-2xl p-4">
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-10 h-10 relative">
                          <Image
                            src="/images/icons/gacha-coin.png"
                            alt="Gacha Coin"
                            width={40}
                            height={40}
                            className="w-full h-full object-contain drop-shadow-lg"
                          />
                        </div>
                        <span className="text-2xl font-bold text-amber-400">+{claimAllResults.coins}</span>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setShowGiftBox(false)
                    setClaimAllResults(null)
                  }}
                  className="gacha-btn px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold shadow-lg shadow-cyan-500/30"
                >
                  Fechar
                </button>
              </div>
            ) : claimedCoins ? (
              <div className="flex flex-col items-center py-8">
                <p className="text-amber-400 font-bold text-lg mb-4">Você recebeu:</p>
                <div className="relative animate-float">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-400 blur-2xl opacity-50 animate-pulse" />
                  <div className="relative flex items-center gap-3 bg-gradient-to-r from-amber-500 to-yellow-500 px-8 py-6 rounded-2xl shadow-2xl shadow-amber-500/30">
                    <Coins className="w-12 h-12 text-white" />
                    <span className="text-4xl font-bold text-white">+{claimedCoins}</span>
                  </div>
                </div>
                <p className="mt-4 text-xl font-bold text-white">Moedas de Gacha!</p>
                <button
                  onClick={() => {
                    setShowGiftBox(false)
                    setClaimedCoins(null)
                  }}
                  className="mt-6 gacha-btn px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold shadow-lg shadow-cyan-500/30"
                >
                  Fechar
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
