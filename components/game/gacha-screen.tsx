"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useGame, type Card } from "@/contexts/game-context"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Heart, Sparkles, Star } from "lucide-react"
import Image from "next/image"

interface GachaScreenProps {
  onBack: () => void
}

type BannerType = "fsg" | "anl" | "friendship"

const BANNERS = {
  fsg: {
    name: "Fundadores da Santa Guerra",
    code: "FSG-01",
    packImage: "/images/gacha/pack-fsg.png",
    bannerImage: "/images/gacha/fsg-anuncio.png",
    color: "from-blue-600 to-purple-600",
    accentColor: "text-cyan-400",
  },
  anl: {
    name: "Ascensao Nordica: Legends",
    code: "ANL-01",
    packImage: "/images/gacha/pack-anl.png",
    bannerImage: "/images/gacha/anl-anuncio.png",
    color: "from-blue-600 to-red-600",
    accentColor: "text-orange-400",
  },
  friendship: {
    name: "Gacha de Amizade",
    code: "FP-01",
    packImage: "/images/gacha/pack-fsg.png",
    bannerImage: "/images/gacha/fsg-anuncio.png",
    color: "from-pink-600 to-rose-600",
    accentColor: "text-pink-400",
  },
}

export default function GachaScreen({ onBack }: GachaScreenProps) {
  const { t } = useLanguage()
  const { coins, setCoins, addToCollection, allCards, spendableFP, spendFriendPoints } = useGame()
  const [currentBanner, setCurrentBanner] = useState<BannerType>("fsg")
  const [isOpening, setIsOpening] = useState(false)
  const [openedCards, setOpenedCards] = useState<Card[]>([])
  const [showResults, setShowResults] = useState(false)
  const [rarityTier, setRarityTier] = useState<"normal" | "rare" | "epic" | "legendary">("normal")
  const [phase, setPhase] = useState(0)
  const [fpReward, setFpReward] = useState<number | null>(null)
  const [revealIndex, setRevealIndex] = useState(-1)
  const [screenShake, setScreenShake] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const containerRef = useRef<HTMLDivElement>(null)

  const COST_SINGLE = 1
  const COST_MULTI = 10
  const CARDS_PER_PACK = 4
  const FP_COST = 50

  const banner = BANNERS[currentBanner]

  const drawParticles = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    const colors: Record<string, string[]> = {
      normal: ["#64748b", "#94a3b8", "#cbd5e1"],
      rare: ["#8b5cf6", "#a78bfa", "#c4b5fd"],
      epic: ["#f59e0b", "#fbbf24", "#fcd34d"],
      legendary: ["#ef4444", "#f97316", "#fbbf24", "#eab308"],
    }

    const tierColors = colors[rarityTier]

    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      color: string
      alpha: number
      life: number
      type: "orb" | "spark" | "ring" | "meteor"
      angle?: number
      radius?: number
      speed?: number
    }

    const particles: Particle[] = []
    let portalRadius = 0
    let meteorY = -100
    let time = 0

    const animate = () => {
      time++

      // Clear with fade effect
      ctx.fillStyle = phase === 3 ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.08)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Phase 1: Portal opening with orbiting particles
      if (phase === 1) {
        portalRadius = Math.min(portalRadius + 2, 200)

        // Draw portal rings
        for (let i = 0; i < 3; i++) {
          const ringRadius = portalRadius - i * 30
          if (ringRadius > 0) {
            ctx.beginPath()
            ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2)
            ctx.strokeStyle = tierColors[i % tierColors.length]
            ctx.lineWidth = 3 - i
            ctx.globalAlpha = 0.6 - i * 0.15
            ctx.stroke()
          }
        }

        // Orbiting particles
        if (time % 2 === 0) {
          const angle = Math.random() * Math.PI * 2
          particles.push({
            x: centerX + Math.cos(angle) * (portalRadius + 50),
            y: centerY + Math.sin(angle) * (portalRadius + 50),
            vx: 0,
            vy: 0,
            size: 2 + Math.random() * 3,
            color: tierColors[Math.floor(Math.random() * tierColors.length)],
            alpha: 1,
            life: 80,
            type: "orb",
            angle: angle,
            radius: portalRadius + 50,
            speed: 0.03 + Math.random() * 0.02,
          })
        }

        particles.forEach((p, i) => {
          if (p.type === "orb" && p.angle !== undefined && p.radius !== undefined && p.speed !== undefined) {
            p.angle += p.speed
            p.radius -= 0.8
            p.x = centerX + Math.cos(p.angle) * p.radius
            p.y = centerY + Math.sin(p.angle) * p.radius
            p.life--

            if (p.radius < 20 || p.life <= 0) {
              particles.splice(i, 1)
            }
          }
        })
      }

      // Phase 2: Meteor descending
      if (phase === 2) {
        meteorY = Math.min(meteorY + 8, centerY)

        // Draw meteor trail
        const gradient = ctx.createLinearGradient(centerX, meteorY - 200, centerX, meteorY)
        gradient.addColorStop(0, "transparent")
        gradient.addColorStop(1, tierColors[0])

        ctx.beginPath()
        ctx.moveTo(centerX - 30, meteorY - 200)
        ctx.lineTo(centerX + 30, meteorY - 200)
        ctx.lineTo(centerX + 15, meteorY)
        ctx.lineTo(centerX - 15, meteorY)
        ctx.closePath()
        ctx.fillStyle = gradient
        ctx.globalAlpha = 0.8
        ctx.fill()

        // Meteor glow
        const glowGradient = ctx.createRadialGradient(centerX, meteorY, 0, centerX, meteorY, 80)
        glowGradient.addColorStop(0, tierColors[0])
        glowGradient.addColorStop(0.5, tierColors[1] || tierColors[0])
        glowGradient.addColorStop(1, "transparent")

        ctx.beginPath()
        ctx.arc(centerX, meteorY, 80, 0, Math.PI * 2)
        ctx.fillStyle = glowGradient
        ctx.globalAlpha = 0.9
        ctx.fill()

        // Meteor core
        ctx.beginPath()
        ctx.arc(centerX, meteorY, 25, 0, Math.PI * 2)
        ctx.fillStyle = "#fff"
        ctx.globalAlpha = 1
        ctx.fill()

        // Sparks from meteor
        if (time % 2 === 0) {
          for (let i = 0; i < 3; i++) {
            particles.push({
              x: centerX + (Math.random() - 0.5) * 40,
              y: meteorY,
              vx: (Math.random() - 0.5) * 8,
              vy: -Math.random() * 5 - 2,
              size: 2 + Math.random() * 3,
              color: tierColors[Math.floor(Math.random() * tierColors.length)],
              alpha: 1,
              life: 30,
              type: "spark",
            })
          }
        }
      }

      // Phase 3: Impact explosion
      if (phase === 3) {
        // Massive explosion
        if (time < 15) {
          for (let i = 0; i < 40; i++) {
            const angle = Math.random() * Math.PI * 2
            const speed = 5 + Math.random() * 20
            particles.push({
              x: centerX,
              y: centerY,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              size: 3 + Math.random() * 10,
              color: tierColors[Math.floor(Math.random() * tierColors.length)],
              alpha: 1,
              life: 50,
              type: "spark",
            })
          }
        }

        // Expanding shockwave rings
        if (time < 30) {
          const ringRadius = time * 20
          ctx.beginPath()
          ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2)
          ctx.strokeStyle = tierColors[0]
          ctx.lineWidth = Math.max(1, 20 - time * 0.5)
          ctx.globalAlpha = Math.max(0, 1 - time * 0.03)
          ctx.stroke()
        }
      }

      // Phase 4+: Ambient particles floating up
      if (phase >= 4) {
        if (particles.length < 60 && time % 5 === 0) {
          particles.push({
            x: Math.random() * canvas.width,
            y: canvas.height + 10,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -1.5 - Math.random() * 2,
            size: 2 + Math.random() * 4,
            color: tierColors[Math.floor(Math.random() * tierColors.length)],
            alpha: 0.7,
            life: 150,
            type: "spark",
          })
        }
      }

      // Update and draw all particles
      particles.forEach((p, i) => {
        if (p.type === "spark") {
          p.x += p.vx
          p.y += p.vy
          p.vx *= 0.98
          p.vy *= 0.98
          p.alpha -= 0.015
          p.life--
        }

        if (p.life <= 0 || p.alpha <= 0) {
          particles.splice(i, 1)
          return
        }

        const safeSize = Math.max(0.1, p.size)

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, safeSize, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0, p.alpha)
        ctx.fill()

        const glowSize = safeSize * 3
        if (glowSize > 0) {
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize)
          glow.addColorStop(0, p.color)
          glow.addColorStop(1, "transparent")
          ctx.beginPath()
          ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2)
          ctx.fillStyle = glow
          ctx.globalAlpha = Math.max(0, p.alpha * 0.4)
          ctx.fill()
        }
      })

      ctx.globalAlpha = 1
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()
  }, [phase, rarityTier])

  useEffect(() => {
    if (phase >= 1 && phase <= 5) {
      drawParticles()
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [phase, drawParticles])

  useEffect(() => {
    if (phase === 5 && revealIndex < openedCards.length) {
      const timer = setTimeout(() => {
        setRevealIndex((prev) => prev + 1)
      }, 120)
      return () => clearTimeout(timer)
    }
  }, [phase, revealIndex, openedCards.length])

  useEffect(() => {
    if (phase === 3) {
      setScreenShake(true)
      const timer = setTimeout(() => setScreenShake(false), 500)
      return () => clearTimeout(timer)
    }
  }, [phase])

  const pullGacha = (count: number) => {
    const totalCost = count === 1 ? COST_SINGLE : COST_MULTI
    if (coins < totalCost) return

    setCoins(coins - totalCost)
    setIsOpening(true)
    setPhase(1)
    setRevealIndex(-1)

    const totalCards = count === 1 ? CARDS_PER_PACK : CARDS_PER_PACK * 10
    const pulledCards: Card[] = []

    for (let i = 0; i < totalCards; i++) {
      const rand = Math.random() * 100
      let targetRarity: "R" | "SR" | "UR" | "LR"

      if (rand < 0.5) targetRarity = "LR"
      else if (rand < 5) targetRarity = "UR"
      else if (rand < 30) targetRarity = "SR"
      else targetRarity = "R"

      let availableCards = allCards.filter((c) => c.rarity === targetRarity)
      if (availableCards.length === 0) {
        availableCards = allCards
      }

      const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)]
      pulledCards.push({ ...randomCard, id: `${randomCard.id}-${Date.now()}-${i}` })
    }

    const hasLR = pulledCards.some((c) => c.rarity === "LR")
    const hasUR = pulledCards.some((c) => c.rarity === "UR")
    const hasSR = pulledCards.some((c) => c.rarity === "SR")

    if (hasLR) setRarityTier("legendary")
    else if (hasUR) setRarityTier("epic")
    else if (hasSR) setRarityTier("rare")
    else setRarityTier("normal")

    setOpenedCards(pulledCards)

    setTimeout(() => setPhase(2), 1800)
    setTimeout(() => setPhase(3), 3200)
    setTimeout(() => setPhase(4), 4000)
    setTimeout(() => {
      setPhase(5)
      setShowResults(true)
      setIsOpening(false)
      addToCollection(pulledCards)
    }, 4800)
  }

  const pullFriendshipGacha = () => {
    if (spendableFP < FP_COST) return
    if (!spendFriendPoints(FP_COST)) return

    setIsOpening(true)
    setPhase(1)

    const isLucky = Math.random() < 0.2
    const reward = isLucky ? 3000 : 300

    setRarityTier(isLucky ? "legendary" : "rare")

    setTimeout(() => setPhase(2), 1200)
    setTimeout(() => setPhase(3), 2400)
    setTimeout(() => {
      setPhase(4)
      setShowResults(true)
      setIsOpening(false)
      setFpReward(reward)
      setCoins(coins + reward)
    }, 3200)
  }

  const skipToResults = () => {
    setRevealIndex(openedCards.length)
  }

  const closeResults = () => {
    setShowResults(false)
    setOpenedCards([])
    setFpReward(null)
    setPhase(0)
    setRevealIndex(-1)
    setRarityTier("normal")
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "LR":
        return "from-red-500 via-amber-500 to-red-500"
      case "UR":
        return "from-amber-400 to-yellow-500"
      case "SR":
        return "from-purple-500 to-pink-500"
      default:
        return "from-slate-500 to-slate-600"
    }
  }

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case "LR":
        return "0 0 30px rgba(239,68,68,0.8), 0 0 60px rgba(251,191,36,0.5)"
      case "UR":
        return "0 0 25px rgba(251,191,36,0.7)"
      case "SR":
        return "0 0 20px rgba(168,85,247,0.6)"
      default:
        return "none"
    }
  }

  const getRarityText = () => {
    if (rarityTier === "legendary") return "LENDARIO!"
    if (rarityTier === "epic") return "ULTRA RARO!"
    return null
  }

  const getTierColor = () => {
    if (rarityTier === "legendary") return "from-red-500 via-amber-400 to-yellow-400"
    if (rarityTier === "epic") return "from-amber-400 via-yellow-400 to-amber-300"
    if (rarityTier === "rare") return "from-purple-400 to-pink-400"
    return "from-slate-400 to-slate-300"
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-b from-slate-900 via-purple-900/20 to-black">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4 bg-gradient-to-r from-black/80 via-purple-900/50 to-black/80 border-b border-cyan-500/30 backdrop-blur-sm">
        <Button onClick={onBack} variant="ghost" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10">
          <ArrowLeft className="mr-2 h-5 w-5" />
          {t("back")}
        </Button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
          GACHA
        </h1>
        <div className="flex items-center gap-3">
  <div className="flex items-center gap-2 bg-gradient-to-r from-slate-800/90 to-slate-700/90 px-4 py-2 rounded-full border border-cyan-400/30 shadow-lg">
  <div className="w-10 h-10 relative -my-1">
    <Image src="/images/icons/gacha-coin.png" alt="Gacha Coin" width={40} height={40} className="w-full h-full object-contain drop-shadow-lg" />
  </div>
  <span className="font-bold text-white text-lg">{coins}</span>
  </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-pink-600/90 to-rose-500/90 px-4 py-2 rounded-full border border-pink-400/50 shadow-lg shadow-pink-500/20">
            <Heart className="w-5 h-5 text-white fill-white" />
            <span className="font-bold text-white">{spendableFP} FP</span>
          </div>
        </div>
      </div>

      {/* Banner tabs */}
      <div className="relative z-10 flex justify-center gap-2 p-4">
        {(["fsg", "anl", "friendship"] as BannerType[]).map((bannerKey) => (
          <Button
            key={bannerKey}
            onClick={() => setCurrentBanner(bannerKey)}
            className={`px-6 py-3 font-bold transition-all duration-300 ${
              currentBanner === bannerKey
                ? `bg-gradient-to-r ${BANNERS[bannerKey].color} scale-110 shadow-lg border-2 border-white/30`
                : "bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600/50"
            }`}
          >
            {bannerKey === "friendship" && <Heart className="w-4 h-4 mr-1 fill-current" />}
            {bannerKey === "fsg" && <Star className="w-4 h-4 mr-1" />}
            {bannerKey === "anl" && <Sparkles className="w-4 h-4 mr-1" />}
            {bannerKey.toUpperCase()}
          </Button>
        ))}
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
        {currentBanner !== "friendship" ? (
          <>
            {/* Normal Banner */}
            <div className="relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-cyan-500/30 mb-6 group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
              <Image
                src={banner.bannerImage || "/placeholder.svg"}
                alt={banner.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>

            <div className="text-center mb-4">
              <h2 className={`text-3xl font-bold ${banner.accentColor} drop-shadow-lg`}>{banner.name}</h2>
              <p className="text-white/70 text-sm mt-2 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />4 cartas por pack - Todas as raridades disponiveis
                <Sparkles className="w-4 h-4" />
              </p>
              <p className="text-slate-500 text-xs mt-1">Codigo: {banner.code}</p>
            </div>

            <div className="flex gap-4 mt-4">
              <Button
                onClick={() => pullGacha(1)}
                disabled={coins < COST_SINGLE || isOpening}
                className="group relative px-10 py-5 text-lg font-bold bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 disabled:opacity-50 border-2 border-amber-400/50 shadow-lg shadow-amber-500/30 transition-all hover:scale-105 hover:shadow-amber-500/50"
              >
  <span className="relative z-10 flex items-center gap-2">
  {t("gacha1")}
  <Image src="/images/icons/gacha-coin.png" alt="Coin" width={32} height={32} className="w-8 h-8 object-contain" />
  {COST_SINGLE}
  </span>
              </Button>
              <Button
                onClick={() => pullGacha(10)}
                disabled={coins < COST_MULTI || isOpening}
                className="group relative px-10 py-5 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 disabled:opacity-50 border-2 border-purple-400/50 shadow-lg shadow-purple-500/30 transition-all hover:scale-105 hover:shadow-purple-500/50"
              >
  <span className="relative z-10 flex items-center gap-2">
  {t("gacha10")}
  <Image src="/images/icons/gacha-coin.png" alt="Coin" width={32} height={32} className="w-8 h-8 object-contain" />
  {COST_MULTI}
  </span>
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                  HOT
                </span>
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Friendship Gacha */}
            <div className="relative w-full max-w-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-rose-500/20 blur-3xl" />
              <div className="relative bg-gradient-to-br from-pink-900/60 to-rose-900/60 rounded-3xl p-8 border-2 border-pink-500/40 text-center backdrop-blur-sm shadow-2xl shadow-pink-500/20">
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-pink-400/20 blur-2xl rounded-full" />
                  <Heart className="relative w-24 h-24 mx-auto text-pink-400 fill-pink-400 animate-pulse drop-shadow-lg" />
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-rose-300 to-pink-400 bg-clip-text text-transparent mb-3">
                  Gacha de Amizade
                </h2>
                <p className="text-pink-200/80 mb-6 text-lg">Use seus Pontos de Afinidade para ganhar Moedas!</p>
                <div className="bg-black/40 rounded-2xl p-5 mb-6 border border-pink-500/20">
                  <p className="text-slate-300 text-sm mb-3 font-medium">Recompensas possiveis:</p>
                  <div className="flex justify-center gap-8">
  <div className="text-center">
  <div className="flex items-center justify-center gap-1">
  <Image src="/images/icons/gacha-coin.png" alt="Coin" width={32} height={32} className="w-8 h-8 object-contain" />
  <p className="text-amber-400 font-bold text-2xl">300</p>
  </div>
  <p className="text-xs text-slate-400 mt-1">Sorte Normal (80%)</p>
  </div>
  <div className="text-center relative">
  <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full" />
  <div className="relative flex items-center justify-center gap-1">
  <Image src="/images/icons/gacha-coin.png" alt="Coin" width={36} height={36} className="w-9 h-9 object-contain" />
  <p className="text-yellow-300 font-bold text-2xl animate-pulse">3.000</p>
  </div>
  <p className="text-xs text-slate-400 mt-1">Sorte Grande (20%)</p>
  </div>
                  </div>
                </div>
                <p className="text-xs text-pink-300/60 mb-6">
                  * Os FP gastos aqui nao afetam sua barra de afinidade com amigos
                </p>
                <Button
                  onClick={pullFriendshipGacha}
                  disabled={spendableFP < FP_COST || isOpening}
                  className="px-10 py-5 text-lg font-bold bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 disabled:opacity-50 border-2 border-pink-400/50 shadow-lg shadow-pink-500/30 transition-all hover:scale-105"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Puxar
                  <Heart className="w-5 h-5 ml-2 fill-white" />
                  {FP_COST} FP
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Cinematic Opening Overlay */}
      {(isOpening || showResults) && (
        <div ref={containerRef} className={`fixed inset-0 z-50 bg-black ${screenShake ? "animate-shake" : ""}`}>
          {/* Canvas for particle system */}
          <canvas ref={canvasRef} className="absolute inset-0" />

          {/* Phase 1: Portal with pack */}
          {phase === 1 && currentBanner !== "friendship" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-48 h-72" style={{ animation: "floatSlow 3s ease-in-out infinite" }}>
                {/* Glow behind pack */}
                <div
                  className={`absolute inset-0 rounded-xl blur-3xl bg-gradient-to-r ${getTierColor()}`}
                  style={{ opacity: 0.5, transform: "scale(1.2)" }}
                />
                <Image
                  src={banner.packImage || "/placeholder.svg"}
                  alt="Pack"
                  fill
                  className="object-contain relative z-10"
                  style={{
                    filter: `drop-shadow(0 0 30px ${rarityTier === "legendary" ? "#fbbf24" : rarityTier === "epic" ? "#f59e0b" : "#8b5cf6"})`,
                  }}
                />
              </div>
              <p className="absolute bottom-40 text-xl text-white/80 tracking-widest">ABRINDO PORTAL...</p>
            </div>
          )}

          {/* Phase 1: Friendship heart */}
          {phase === 1 && currentBanner === "friendship" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div
                  className={`absolute inset-0 blur-3xl ${rarityTier === "legendary" ? "bg-amber-500" : "bg-pink-500"}`}
                  style={{ opacity: 0.5, transform: "scale(2)" }}
                />
                <Heart
                  className={`relative w-32 h-32 ${
                    rarityTier === "legendary" ? "text-amber-400 fill-amber-400" : "text-pink-400 fill-pink-400"
                  }`}
                  style={{
                    animation: "heartbeat 1s ease-in-out infinite",
                    filter: `drop-shadow(0 0 40px currentColor)`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Phase 2: Meteor descending with pack */}
          {phase === 2 && currentBanner !== "friendship" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-56 h-80" style={{ animation: "descendFast 0.8s ease-in forwards" }}>
                <div
                  className={`absolute inset-0 rounded-xl blur-3xl bg-gradient-to-r ${getTierColor()}`}
                  style={{ opacity: 0.8, transform: "scale(1.5)" }}
                />
                <Image
                  src={banner.packImage || "/placeholder.svg"}
                  alt="Pack"
                  fill
                  className="object-contain relative z-10"
                  style={{
                    filter: `drop-shadow(0 0 50px ${rarityTier === "legendary" ? "#fbbf24" : "#f59e0b"})`,
                  }}
                />
              </div>
              <p className="absolute bottom-40 text-2xl font-bold text-white tracking-widest animate-pulse">
                PREPARANDO...
              </p>
            </div>
          )}

          {/* Phase 2: Friendship intensify */}
          {phase === 2 && currentBanner === "friendship" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div
                  className={`absolute inset-0 blur-3xl ${rarityTier === "legendary" ? "bg-amber-500" : "bg-pink-500"}`}
                  style={{ opacity: 0.9, transform: "scale(2.5)" }}
                />
                <Heart
                  className={`relative w-40 h-40 ${
                    rarityTier === "legendary" ? "text-amber-400 fill-amber-400" : "text-pink-400 fill-pink-400"
                  }`}
                  style={{
                    animation: "heartPound 0.15s infinite",
                    filter: `drop-shadow(0 0 60px currentColor)`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Phase 3: Explosion with rarity text */}
          {phase === 3 && (
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              {/* White flash */}
              <div className="absolute inset-0 bg-white" style={{ animation: "flashOut 0.5s ease-out forwards" }} />

              {/* Radial burst lines */}
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(16)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute h-[200vh] w-2 bg-gradient-to-t from-transparent ${
                      rarityTier === "legendary"
                        ? "via-amber-400"
                        : rarityTier === "epic"
                          ? "via-yellow-400"
                          : "via-purple-400"
                    } to-transparent`}
                    style={{
                      transform: `rotate(${i * 22.5}deg)`,
                      animation: "burstLine 0.8s ease-out forwards",
                      opacity: 0,
                      animationDelay: `${i * 0.02}s`,
                    }}
                  />
                ))}
              </div>

              {/* Rarity announcement */}
              {getRarityText() && (
                <div
                  className="relative z-20"
                  style={{ animation: "slamIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}
                >
                  <h1
                    className={`text-6xl md:text-8xl font-black tracking-tighter bg-gradient-to-r ${getTierColor()} bg-clip-text text-transparent`}
                    style={{
                      textShadow: "0 0 80px currentColor",
                      WebkitTextStroke: "2px rgba(255,255,255,0.3)",
                    }}
                  >
                    {getRarityText()}
                  </h1>
                </div>
              )}
            </div>
          )}

          {/* Phase 4: Transition / FP Result */}
          {phase === 4 && fpReward && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center" style={{ animation: "scaleIn 0.4s ease-out forwards" }}>
                <p className={`text-5xl font-black mb-8 ${fpReward >= 3000 ? "text-amber-400" : "text-pink-400"}`}>
                  {fpReward >= 3000 ? "SORTE GRANDE!" : "Voce ganhou:"}
                </p>
                <div className="relative inline-block">
                  <div
                    className={`absolute inset-0 blur-3xl ${
                      fpReward >= 3000 ? "bg-amber-500" : "bg-amber-600"
                    } opacity-60`}
                  />
                  <div
                    className={`relative flex items-center gap-6 px-16 py-10 rounded-3xl border-4 ${
                      fpReward >= 3000
                        ? "bg-gradient-to-r from-amber-500 to-yellow-500 border-yellow-300"
                        : "bg-gradient-to-r from-amber-600 to-yellow-600 border-amber-400"
                    }`}
                  >
                    <Image src="/images/icons/gacha-coin.png" alt="Coin" width={96} height={96} className="w-24 h-24 object-contain drop-shadow-2xl" />
                    <span className="text-6xl font-black text-white">+{fpReward.toLocaleString()}</span>
                  </div>
                </div>
                <p className="mt-6 text-2xl font-bold text-white">Moedas de Gacha!</p>
                <Button
                  onClick={closeResults}
                  className="mt-10 px-12 py-4 text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 border-2 border-green-400/50"
                >
                  CONFIRMAR
                </Button>
              </div>
            </div>
          )}

          {/* Phase 5: Card results */}
          {phase === 5 && !fpReward && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              {/* Skip button */}
              {revealIndex < openedCards.length && (
                <Button
                  onClick={skipToResults}
                  className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 border border-white/30"
                >
                  Pular
                </Button>
              )}

              {/* Cards grid */}
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 max-h-[70vh] overflow-y-auto p-4">
                {openedCards.map((card, index) => {
                  const isRevealed = index <= revealIndex
                  return (
                    <div
                      key={`${card.id}-${index}`}
                      className="relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group"
                      style={{
                        opacity: isRevealed ? 1 : 0,
                        transform: isRevealed ? "scale(1) rotateY(0deg)" : "scale(0.5) rotateY(180deg)",
                        transition: `all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${Math.min(index * 0.08, 0.8)}s`,
                        boxShadow: isRevealed ? getRarityGlow(card.rarity) : "none",
                      }}
                    >
                      {/* Shine effect */}
                      {isRevealed && (
                        <div
                          className="absolute inset-0 z-20 bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none"
                          style={{
                            transform: "translateX(-100%)",
                            animation: "shineAcross 0.6s ease-out forwards",
                            animationDelay: `${Math.min(index * 0.08, 0.8) + 0.2}s`,
                          }}
                        />
                      )}

                      <Image src={card.image || "/placeholder.svg"} alt={card.name} fill className="object-cover" />

                      {/* Rarity bar */}
                      <div
                        className={`absolute bottom-0 left-0 right-0 py-1 text-center text-xs font-bold bg-gradient-to-r ${getRarityColor(card.rarity)} text-white`}
                      >
                        {card.rarity}
                      </div>

                      {/* LR rainbow border */}
                      {card.rarity === "LR" && isRevealed && (
                        <div
                          className="absolute inset-0 rounded-xl pointer-events-none"
                          style={{
                            background:
                              "linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6, #ef4444)",
                            backgroundSize: "200% 100%",
                            animation: "rainbowShift 2s linear infinite",
                            padding: "3px",
                            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                            WebkitMaskComposite: "xor",
                            maskComposite: "exclude",
                          }}
                        />
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Confirm button */}
              {revealIndex >= openedCards.length - 1 && (
                <Button
                  onClick={closeResults}
                  className="mt-8 px-12 py-4 text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 border-2 border-green-400/50"
                  style={{ animation: "scaleIn 0.3s ease-out forwards" }}
                >
                  CONFIRMAR
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-20px) rotate(1deg); }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.1); }
          50% { transform: scale(1); }
          75% { transform: scale(1.05); }
        }
        @keyframes heartPound {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        @keyframes descendFast {
          0% { transform: translateY(-100px) scale(0.8); opacity: 0; }
          100% { transform: translateY(0) scale(1.1); opacity: 1; }
        }
        @keyframes flashOut {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes burstLine {
          0% { opacity: 0; transform: rotate(var(--r, 0deg)) scaleY(0); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: rotate(var(--r, 0deg)) scaleY(1); }
        }
        @keyframes slamIn {
          0% { transform: scale(3) translateY(-30px); opacity: 0; }
          60% { transform: scale(0.95); opacity: 1; }
          80% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        @keyframes scaleIn {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes shineAcross {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes rainbowShift {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}
