'use client';

import ProfilePicUpload from '@/components/ui/ProfilePicUpload';

interface SidebarProps {
    athlete: {
        name: string;
        position: string;
        number: string;
        bio: string;
        clubs: string;
        profilePicture: string;
        id?: string;
    };
    isAdmin?: boolean;
    onRefresh?: () => void;
}

export default function Sidebar({ athlete, isAdmin, onRefresh }: SidebarProps) {
    return (
        <aside className="w-full md:w-[300px] bg-white/[0.02] backdrop-blur-xl border-r border-white/10 p-10 flex flex-col items-center md:fixed md:h-screen z-10 overflow-y-auto">
            <div className="mb-6">
                {isAdmin && athlete.id ? (
                    <ProfilePicUpload
                        userId={athlete.id}
                        currentPic={athlete.profilePicture}
                        onSuccess={onRefresh || (() => { })}
                    />
                ) : (
                    <div className="w-36 h-36 rounded-full overflow-hidden border-2 border-[#136dec] shadow-[0_0_20px_rgba(19,109,236,0.3)] bg-[#111]">
                        <img
                            src={athlete.profilePicture || '/default-avatar.png'}
                            alt={athlete.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
            </div>

            <div className="text-center mb-10 w-full">
                <h1 className="text-xl font-black tracking-tight line-clamp-2">{athlete.name}</h1>
                <p className="text-[#a0a0a0] text-[10px] font-bold uppercase tracking-[2px] mt-2 text-[#136dec]">{athlete.position}</p>
            </div>

            <div className="w-full space-y-8">
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-3">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                        <span className="text-[#444]">Numéro</span>
                        <span className="text-[#136dec]">{athlete.number}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                        <span className="text-[#444]">Position</span>
                        <span className="text-[#136dec]">{athlete.position}</span>
                    </div>
                </div>

                <div>
                    <h3 className="text-[#136dec] text-[10px] font-black uppercase tracking-[3px] mb-4 ml-1 opacity-50">Bio</h3>
                    <div
                        className="text-[#a0a0a0] text-sm leading-relaxed px-1 prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: athlete.bio || "Aucune bio renseignée." }}
                    />
                </div>

                <div>
                    <h3 className="text-[#136dec] text-[10px] font-black uppercase tracking-[3px] mb-4 ml-1 opacity-50">Parcours</h3>
                    <div
                        className="text-[#a0a0a0] text-sm leading-relaxed px-1 prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: athlete.clubs || "Aucun club renseigné." }}
                    />
                </div>
            </div>
        </aside>
    );
}
