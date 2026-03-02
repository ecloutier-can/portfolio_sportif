'use client';

import React from 'react';
import ProfilePicUpload from '@/components/ui/ProfilePicUpload';

interface SidebarProps {
    profile: {
        id: string;
        username: string;
        full_name: string;
        bio: string;
        clubs: string;
        profile_picture_url: string;
        position: string;
        number: string;
    };
    isAdmin?: boolean;
    onRefresh?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ profile, isAdmin = false, onRefresh }) => {
    return (
        <aside className="w-[320px] h-full bg-[#080808] border-r border-white/5 flex flex-col hidden md:flex">
            {/* Profile Picture Section */}
            <div className="p-8 pb-4 flex justify-center relative group">
                <div className="w-48 h-48 rounded-full overflow-hidden border-2 border-[#136dec] shadow-[0_0_50px_rgba(19,109,236,0.2)]">
                    {isAdmin ? (
                        <ProfilePicUpload
                            userId={profile.id}
                            currentUrl={profile.profile_picture_url}
                            onSuccess={onRefresh || (() => { })}
                        />
                    ) : (
                        <img
                            src={profile.profile_picture_url || '/default-avatar.png'}
                            alt={profile.full_name}
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
            </div>

            {/* Info Section */}
            <div className="p-8 pt-4 flex-1 space-y-8 overflow-y-auto custom-scrollbar">
                <div className="space-y-1 text-center font-black">
                    <h1 className="text-2xl uppercase tracking-tighter text-white">
                        {profile.full_name || profile.username}
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-[#136dec] uppercase tracking-[4px] text-[10px]">
                        <span>{profile.position || "Athlète"}</span>
                        {profile.number && (
                            <>
                                <span className="w-1 h-1 bg-[#136dec] rounded-full opacity-50" />
                                <span>#{profile.number}</span>
                            </>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <h3 className="text-[10px] uppercase tracking-[3px] text-[#333] font-black border-b border-white/5 pb-2">Bio:</h3>
                        <div
                            className="text-white/70 text-sm leading-relaxed font-light"
                            dangerouslySetInnerHTML={{ __html: profile.bio || "Aucune biographie disponible." }}
                        />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-[10px] uppercase tracking-[3px] text-[#333] font-black border-b border-white/5 pb-2">Clubs:</h3>
                        <div
                            className="text-white/70 text-sm leading-relaxed font-light clubs-list"
                            dangerouslySetInnerHTML={{ __html: profile.clubs || "Historique des clubs non renseigné." }}
                        />
                    </div>
                </div>
            </div>

            {/* Footer Branding */}
            <div className="p-8 border-t border-white/5">
                <div className="flex items-center gap-2 opacity-30 grayscale">
                    <div className="w-6 h-6 bg-[#136dec] rounded shadow-sm" />
                    <span className="font-black tracking-tighter text-[10px] uppercase">ProAthlete Platform</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
