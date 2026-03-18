"use client"

interface Teacher {
  id: number
  name: string
  role: string
  avatar: string
}

interface TeachersPageProps {
  teachers: Teacher[]
}

export function TeachersPage({ teachers }: TeachersPageProps) {
  return (
    <div className="relative z-10 p-6 lg:p-8 h-full flex flex-col">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-300 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
          KURSKADRO & LEHRER 2026
        </h1>
        <div className="mt-2 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
      </div>

      {/* Teachers grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {teachers.map((teacher) => (
          <TeacherCard key={teacher.id} teacher={teacher} />
        ))}
      </div>

      {/* Graduation message section */}
      <div className="flex-1 mt-auto">
        <h2 className="text-xl lg:text-2xl font-bold text-center mb-4 tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
          MEZUNİYET MESAJI
        </h2>
        
        {/* Message box with glassmorphism */}
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg blur" />
          
          <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 lg:p-6 border border-cyan-500/20">
            <h3 className="text-sm font-semibold text-cyan-300 mb-3 tracking-wide">
              MEZUNİYET MESAJI
            </h3>
            <p className="text-slate-300/90 text-sm lg:text-base leading-relaxed italic font-light">
              Sevgili mezunlarımız, bu consecetin haretlelitin adipiscing elit, 
              sed ciusmod tempor incidudunt ald humilant dulare Magna aliqua. 
              Ut enam dolore magan har alique. Ut will kuismad mecralamasinin 
              onck har malum hustensler gerfallanddır. Barin dr gunis badenin, 
              dir cancuin tanye ve hatlam gelatumu kunuisum.
            </p>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-20 left-8 w-32 h-32 border border-cyan-500/10 rounded-full animate-pulse" />
      <div className="absolute top-40 right-8 w-24 h-24 border border-purple-500/10 rounded-full animate-pulse delay-500" />
    </div>
  )
}

function TeacherCard({ teacher }: { teacher: Teacher }) {
  return (
    <div className="flex flex-col items-center group">
      {/* Avatar with glow ring */}
      <div className="relative mb-3">
        {/* Animated glow ring */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 rounded-full opacity-75 blur-sm group-hover:opacity-100 transition-opacity animate-spin-slow" />
        
        {/* Inner glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full opacity-50" />
        
        {/* Avatar */}
        <div className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden border-2 border-cyan-400/50">
          <img
            src={teacher.avatar}
            alt={teacher.name}
            className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-300"
          />
          {/* Holographic overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 mix-blend-overlay" />
        </div>
      </div>

      {/* Name and role */}
      <p className="text-xs lg:text-sm font-semibold text-cyan-100 text-center leading-tight">
        {teacher.name}
      </p>
      <p className="text-xs text-purple-300/70 mt-0.5">
        {teacher.role}
      </p>
    </div>
  )
}
