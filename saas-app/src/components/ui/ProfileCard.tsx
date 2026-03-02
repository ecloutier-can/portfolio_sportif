import Link from 'next/link';

interface ProfileCardProps {
    profile: {
        username: string;
        full_name: string;
        position: string;
        profile_picture_url: string;
        bio: string;
        clubs: string;
    };
}

export default function ProfileCard({ profile }: ProfileCardProps) {
    return (
        <Link
            href={`/p/${profile.username}`}
            className="athlete-card group relative flex flex-col h-[400px] md:h-[480px] cursor-pointer overflow-hidden rounded-[32px] md:rounded-[40px] border border-white/5 hover:border-blue-600/30 transition-all duration-700 hover:shadow-[0_0_50px_rgba(31,104,249,0.15)]"
        >
            {/* Main Image Layer */}
            <div className="absolute inset-0 z-0">
                <img
                    src={profile.profile_picture_url || '/default-avatar.png'}
                    alt={profile.full_name}
                    className="w-full h-full object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-110"
                />
                {/* Advanced Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />
            </div>

            {/* Top Bar - Status & Badges */}
            <div className="relative z-10 p-6 md:p-8 flex justify-between items-start">
                <div className="flex flex-col gap-2">
                    <span className="px-3 py-1 bg-blue-600/20 backdrop-blur-md border border-blue-600/30 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] text-blue-400">
                        Top Prospect
                    </span>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                    <svg className="w-3 h-3 md:w-4 md:h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                </div>
            </div>

            {/* Bottom Content Area */}
            <div className="relative z-10 mt-auto p-6 md:p-8 space-y-4 md:space-y-5">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-blue-600 rounded-full animate-pulse shadow-[0_0_10px_#1f68f9]" />
                        <p className="text-slate-400 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em]">
                            {profile.position || 'Elite Athlete'}
                        </p>
                    </div>
                    <h3 className="font-display text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none group-hover:text-glow transition-all">
                        {profile.full_name || profile.username}
                    </h3>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="space-y-1">
                        <p className="text-[7px] md:text-[8px] text-slate-500 font-bold uppercase tracking-widest">Club Actuel</p>
                        <p className="text-[9px] md:text-[10px] text-white font-black uppercase tracking-tighter group-hover:text-blue-400 transition-colors">
                            {profile.clubs || 'Agent Libre'}
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="text-[10px] md:text-[12px] text-blue-500 font-black italic tracking-tighter">Elite 88</p>
                        <div className="w-10 md:w-12 h-0.5 md:h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                            <div className="w-[88%] h-full bg-blue-600 shadow-[0_0_10px_#1f68f9]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* View Profile Action on Hover */}
            <div className="absolute inset-x-6 md:inset-x-8 bottom-6 md:bottom-8 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                <div className="w-full py-3 md:py-4 px-4 md:px-6 bg-white text-black font-black uppercase tracking-widest text-[8px] md:text-[10px] text-center rounded-xl md:rounded-2xl shadow-2xl">
                    Voir Rapport Scout
                </div>
            </div>
        </Link>
    );
}
