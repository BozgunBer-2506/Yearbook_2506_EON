"use client"

import { useState } from "react"
import { TeachersPage } from "./yearbook/teachers-page"
import { ProfilePage } from "./yearbook/profile-page"
import { PageFlipButton } from "./yearbook/page-flip-button"

const students = [
  {
    id: 1,
    name: "Barış Akyüz",
    email: "b.akyuz@email.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    messages: [
      { id: 1, author: "Ayşe", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", text: "Mükemmel proje! 2026's bekle bizi!", date: "27/03/2026, 14:32", isOwn: false },
      { id: 2, author: "Barış Akyüz", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", text: "Seninle çalışmak harikaydı!", date: "27/03/2026, 14:32", isOwn: true },
      { id: 3, author: "Can", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", text: "Seninle çalışmak harikaydı!", date: "27/03/2026, 14:32", isOwn: false },
      { id: 4, author: "Barış Akyüz", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", text: "Harika bir yıldı!", date: "27/03/2026, 14:32", isOwn: true },
    ]
  },
  {
    id: 2,
    name: "Elif Demir",
    email: "e.demir@email.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    messages: [
      { id: 1, author: "Mehmet", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", text: "En iyi takım arkadaşı!", date: "28/03/2026, 10:15", isOwn: false },
      { id: 2, author: "Elif Demir", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", text: "Teşekkürler dostum!", date: "28/03/2026, 10:20", isOwn: true },
    ]
  },
  {
    id: 3,
    name: "Ahmet Yıldız",
    email: "a.yildiz@email.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    messages: [
      { id: 1, author: "Zeynep", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face", text: "Kod yazma konusunda bir dahisin!", date: "29/03/2026, 09:00", isOwn: false },
      { id: 2, author: "Ahmet Yıldız", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", text: "Birlikte öğrendik!", date: "29/03/2026, 09:05", isOwn: true },
    ]
  },
]

const teachers = [
  { id: 1, name: "Hoca Ahmet Yılmaz", role: "Direktör", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face" },
  { id: 2, name: "Hoca Ahmet Yılmaz", role: "Direktör", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face" },
  { id: 3, name: "Hoca Bels Vrlez", role: "Direktör", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face" },
  { id: 4, name: "Hoca Ahmet Yılmaz", role: "Direktör", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" },
]

export function HolographicYearbook() {
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next")

  const handlePageFlip = (direction: "next" | "prev") => {
    if (isFlipping) return
    
    setFlipDirection(direction)
    setIsFlipping(true)
    
    setTimeout(() => {
      if (direction === "next") {
        setCurrentStudentIndex((prev) => (prev + 1) % students.length)
      } else {
        setCurrentStudentIndex((prev) => (prev - 1 + students.length) % students.length)
      }
      setIsFlipping(false)
    }, 600)
  }

  const currentStudent = students[currentStudentIndex]

  return (
    <div className="relative w-full max-w-6xl mx-auto perspective-[2000px]">
      {/* Book container */}
      <div className="relative flex flex-col lg:flex-row gap-1 transform-style-3d">
        {/* Left Page - Teachers */}
        <div className="relative flex-1 min-h-[600px] lg:min-h-[700px]">
          {/* Holographic border glow */}
          <div className="absolute -inset-[2px] bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 rounded-l-lg opacity-75 blur-sm animate-border-glow" />
          
          {/* Corner brackets */}
          <CornerBrackets />
          
          {/* Glass panel */}
          <div className="relative h-full bg-slate-900/80 backdrop-blur-xl rounded-l-lg border border-cyan-500/30 overflow-hidden">
            {/* Scan line effect */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,255,0.03)_2px,rgba(0,255,255,0.03)_4px)] pointer-events-none" />
            
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
            
            <TeachersPage teachers={teachers} />
          </div>
        </div>

        {/* Book spine */}
        <div className="hidden lg:block w-4 bg-gradient-to-b from-cyan-900/50 via-slate-800/50 to-purple-900/50 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
        </div>

        {/* Right Page - Profile */}
        <div className={`relative flex-1 min-h-[600px] lg:min-h-[700px] transform-style-3d ${isFlipping ? (flipDirection === "next" ? "animate-page-flip-out" : "animate-page-flip-in") : ""}`}>
          {/* Holographic border glow */}
          <div className="absolute -inset-[2px] bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 rounded-r-lg opacity-75 blur-sm animate-border-glow" />
          
          {/* Corner brackets */}
          <CornerBrackets />
          
          {/* Glass panel */}
          <div className="relative h-full bg-slate-900/80 backdrop-blur-xl rounded-r-lg border border-purple-500/30 overflow-hidden">
            {/* Scan line effect */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(147,51,234,0.03)_2px,rgba(147,51,234,0.03)_4px)] pointer-events-none" />
            
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/5 via-transparent to-cyan-500/5" />
            
            <ProfilePage 
              student={currentStudent} 
              studentNumber={currentStudentIndex + 1}
              totalStudents={students.length}
            />
            
            {/* Page flip button */}
            <PageFlipButton 
              onFlipNext={() => handlePageFlip("next")}
              onFlipPrev={() => handlePageFlip("prev")}
            />
          </div>
          
          {/* Page curl effect */}
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-slate-800/80 to-transparent rounded-tl-full pointer-events-none" />
        </div>
      </div>
    </div>
  )
}

function CornerBrackets() {
  return (
    <>
      {/* Top left */}
      <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-cyan-400/70 z-10" />
      {/* Top right */}
      <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-cyan-400/70 z-10" />
      {/* Bottom left */}
      <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-cyan-400/70 z-10" />
      {/* Bottom right */}
      <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-cyan-400/70 z-10" />
    </>
  )
}
