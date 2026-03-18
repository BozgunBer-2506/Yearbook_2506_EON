import { useState } from 'react';

interface Message {
  id: number;
  author_id?: number;
  author_name: string;
  content: string;
  created_at: string;
}

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  bio?: string;
  profile_picture_url?: string;
  messages?: Message[];
}

interface ProfilePageProps {
  student: Student;
  studentNumber: number;
  totalStudents: number;
  onFlipNext: () => void;
  onFlipPrev: () => void;
}

export function ProfilePage({ student, studentNumber, totalStudents, onFlipNext, onFlipPrev }: ProfilePageProps) {
  const getInitials = (first: string, last: string) => `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase();

  return (
    <div className="relative z-10 p-6 lg:p-8 h-full flex flex-col">
      {/* Student counter badge */}
      <div className="absolute top-4 right-4 lg:top-6 lg:right-6">
        <div className="px-3 py-1 bg-slate-800/80 backdrop-blur-sm rounded-full border border-purple-500/30">
          <span className="text-xs text-purple-300 font-mono">
            {studentNumber} / {totalStudents} OGRENCI
          </span>
        </div>
      </div>

      {/* Profile header */}
      <div className="flex items-start gap-4 lg:gap-6 mb-6">
        {/* Avatar with glow */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg opacity-75 blur-sm animate-pulse" />
          <div className="relative w-20 h-20 lg:w-28 lg:h-28 rounded-lg overflow-hidden border-2 border-purple-400/50">
            {student.profile_picture_url ? (
              <img
                src={`/images/${student.profile_picture_url}`}
                alt={student.first_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                <span className="text-purple-400 font-bold text-2xl lg:text-3xl">
                  {getInitials(student.first_name, student.last_name)}
                </span>
              </div>
            )}
            {/* Holographic overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 mix-blend-overlay" />
          </div>
        </div>

        {/* Name and info */}
        <div className="flex-1 pt-2">
          <h2 className="text-2xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-cyan-200 drop-shadow-[0_0_10px_rgba(147,51,234,0.5)]">
            {student.first_name.toUpperCase()} {student.last_name.toUpperCase()}
          </h2>
          <div className="flex items-center gap-2 mt-2 text-sm text-slate-400">
            <span className="text-purple-300 font-semibold">{student.first_name.toUpperCase()} {student.last_name.toUpperCase()}</span>
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
          DUSUNCELER
        </h3>

        {/* Messages container */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {student.messages && student.messages.length > 0 ? (
            student.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          ) : (
            <div className="text-center text-slate-500 py-8">
              Henuz mesaj yok
            </div>
          )}
        </div>
      </div>

      {/* Page flip buttons */}
      <div className="absolute bottom-6 right-6 flex items-center gap-4">
        <button
          onClick={onFlipPrev}
          className="p-2 rounded-full bg-slate-800/80 backdrop-blur-sm border border-cyan-500/30 hover:border-cyan-400/60 transition-colors"
        >
          <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={onFlipNext}
          className="p-2 rounded-full bg-slate-800/80 backdrop-blur-sm border border-purple-500/30 hover:border-purple-400/60 transition-colors"
        >
          <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isOwn = false; // You can determine this from author_id

  return (
    <div className={`flex items-start gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className={`absolute -inset-0.5 rounded-full opacity-50 ${isOwn ? "bg-purple-500" : "bg-cyan-500"}`} />
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-slate-800 flex items-center justify-center">
          <span className="text-cyan-400 text-xs font-bold">
            {message.author_name.substring(0, 2).toUpperCase()}
          </span>
        </div>
      </div>

      {/* Message content */}
      <div className={`flex-1 max-w-[80%] ${isOwn ? "text-right" : ""}`}>
        <div className={`relative inline-block ${isOwn ? "ml-auto" : ""}`}>
          {/* Glow effect */}
          <div className={`absolute -inset-0.5 rounded-lg blur-sm opacity-30 ${isOwn ? "bg-purple-500" : "bg-cyan-500"}`} />
          
          {/* Message box */}
          <div className={`relative px-4 py-2 rounded-lg backdrop-blur-sm border ${
            isOwn 
              ? "bg-purple-900/40 border-purple-500/30" 
              : "bg-slate-800/60 border-cyan-500/30"
          }`}>
            <p className={`text-xs font-semibold mb-1 ${isOwn ? "text-purple-300" : "text-cyan-300"}`}>
              {message.author_name.toUpperCase()}
            </p>
            <p className="text-sm text-white/90">
              {message.content}
            </p>
          </div>
        </div>
        
        {/* Timestamp */}
        <p className={`text-xs text-slate-500 mt-1 ${isOwn ? "text-right" : ""}`}>
          {new Date(message.created_at).toLocaleDateString('de-DE')}
        </p>
      </div>
    </div>
  );
}
