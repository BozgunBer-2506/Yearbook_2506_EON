"use client"

interface Message {
  id: number
  author: string
  avatar: string
  text: string
  date: string
  isOwn: boolean
}

interface Student {
  id: number
  name: string
  email: string
  avatar: string
  messages: Message[]
}

interface ProfilePageProps {
  student: Student
  studentNumber: number
  totalStudents: number
}

export function ProfilePage({ student, studentNumber, totalStudents }: ProfilePageProps) {
  return (
    <div className="relative z-10 p-6 lg:p-8 h-full flex flex-col">
      {/* Student counter badge */}
      <div className="absolute top-4 right-4 lg:top-6 lg:right-6">
        <div className="px-3 py-1 bg-slate-800/80 backdrop-blur-sm rounded-full border border-purple-500/30">
          <span className="text-xs text-purple-300 font-mono">
            {studentNumber} / {totalStudents} ÖĞRENCİ
          </span>
        </div>
      </div>

      {/* Profile header */}
      <div className="flex items-start gap-4 lg:gap-6 mb-6">
        {/* Avatar with glow */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg opacity-75 blur-sm animate-pulse" />
          <div className="relative w-20 h-20 lg:w-28 lg:h-28 rounded-lg overflow-hidden border-2 border-purple-400/50">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-full h-full object-cover"
            />
            {/* Holographic overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 mix-blend-overlay" />
            {/* Scan line */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_4px,rgba(255,255,255,0.03)_4px,rgba(255,255,255,0.03)_8px)]" />
          </div>
        </div>

        {/* Name and info */}
        <div className="flex-1 pt-2">
          <h2 className="text-2xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-cyan-200 drop-shadow-[0_0_10px_rgba(147,51,234,0.5)]">
            {student.name.toUpperCase()}
          </h2>
          <div className="flex items-center gap-2 mt-2 text-sm text-slate-400">
            <span className="text-purple-300 font-semibold">{student.name.toUpperCase()}</span>
            <span className="text-cyan-500">|</span>
            <span className="text-cyan-300">MAIL: {student.email}</span>
          </div>
          {/* Decorative line */}
          <div className="mt-3 h-px bg-gradient-to-r from-purple-500 via-cyan-500 to-transparent" />
        </div>
      </div>

      {/* Messages section */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <h3 className="text-xl lg:text-2xl font-bold text-center mb-4 tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300">
          DÜŞÜNCELER
        </h3>

        {/* Messages container */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {student.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ message }: { message: Message }) {
  return (
    <div className={`flex items-start gap-3 ${message.isOwn ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className={`absolute -inset-0.5 rounded-full opacity-50 ${message.isOwn ? "bg-purple-500" : "bg-cyan-500"}`} />
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20">
          <img
            src={message.avatar}
            alt={message.author}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Message content */}
      <div className={`flex-1 max-w-[80%] ${message.isOwn ? "text-right" : ""}`}>
        <div className={`relative inline-block ${message.isOwn ? "ml-auto" : ""}`}>
          {/* Glow effect */}
          <div className={`absolute -inset-0.5 rounded-lg blur-sm opacity-30 ${message.isOwn ? "bg-purple-500" : "bg-cyan-500"}`} />
          
          {/* Message box */}
          <div className={`relative px-4 py-2 rounded-lg backdrop-blur-sm border ${
            message.isOwn 
              ? "bg-purple-900/40 border-purple-500/30" 
              : "bg-slate-800/60 border-cyan-500/30"
          }`}>
            <p className={`text-xs font-semibold mb-1 ${message.isOwn ? "text-purple-300" : "text-cyan-300"}`}>
              {message.author.toUpperCase()}
            </p>
            <p className="text-sm text-white/90">
              {message.text}
            </p>
          </div>
        </div>
        
        {/* Timestamp */}
        <p className={`text-xs text-slate-500 mt-1 ${message.isOwn ? "text-right" : ""}`}>
          {message.date}
        </p>
      </div>
    </div>
  )
}
