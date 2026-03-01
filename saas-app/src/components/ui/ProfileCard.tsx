import Link from 'next/link';

interface ProfileCardProps {
    profile: {
        username: string;
        full_name: string;
        position: string;
        profile_picture_url: string;
        bio: string;
    };
}

export default function ProfileCard({ profile }: ProfileCardProps) {
    return (
        <Link
            href={`/p/${profile.username}`}
            className="group relative bg-white/[0.03] border border-white/10 rounded-3xl p-6 flex flex-col items-center gap-6 transition-all duration-500 hover:scale-[1.02] hover:border-[#136dec]/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer"
        >
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#136dec] transition-colors shadow-xl">
                <img
                    src={profile.profile_picture_url || '/default-avatar.png'}
                    alt={profile.full_name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
            </div>

            <div className="text-center space-y-2">
                <h3 className="text-lg font-black tracking-tight group-hover:text-[#136dec] transition-colors">{profile.full_name || profile.username}</h3>
                <p className="text-[#136dec] text-[10px] font-black uppercase tracking-[2px]">{profile.position || 'Athlète'}</p>
            </div>

            <div className="w-full h-px bg-white/5" />

            <p className="text-[#a0a0a0] text-xs leading-relaxed line-clamp-3 text-center px-2" dangerouslySetInnerHTML={{ __html: profile.bio || "Aucune bio disponible." }} />

            <div className="mt-auto pt-4 text-[10px] font-black uppercase tracking-widest text-[#444] group-hover:text-white transition-colors">
                VOIR LE PORTFOLIO ↗
            </div>
        </Link>
    );
}
