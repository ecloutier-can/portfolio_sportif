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
        <aside className="w-[320px] h-full bg-black border-r border-white/5 flex flex-col hidden lg:flex shrink-0">
            {/* Profile Header Block */}
            <div className="p-10 pb-6 space-y-8 flex flex-col items-center">
                <div className="relative group">
                    {/* Glowing background for profile pic */}
                    <div className="absolute inset-[-10px] bg-blue-600/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                    <div className="relative w-40 h-40 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
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

                <div className="text-center space-y-3">
                    <h2 className="font-display text-2xl font-black uppercase tracking-tighter text-white leading-tight">
                        {profile.full_name || profile.username}
                    </h2>
                    <div className="flex items-center justify-center gap-3">
                        <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em]">
                            {profile.position || "Elite Pro"}
                        </span>
                        {profile.number && (
                            <span className="text-slate-700 text-[10px] font-black tracking-widest">
                                #{profile.number}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation / Info Section */}
            <div className="flex-1 px-8 py-4 overflow-y-auto custom-scrollbar no-scrollbar space-y-10">
                <div className="space-y-6">
                    <div className="space-y-3">
                        <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 px-2">À Propos</h3>
                        <div
                            className="text-slate-400 text-xs leading-relaxed font-medium bg-white/[0.02] p-4 rounded-2xl border border-white/5"
                            dangerouslySetInnerHTML={{ __html: profile.bio || "Pas de bio." }}
                        />
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 px-2">Expérience</h3>
                        <div
                            className="text-slate-400 text-xs leading-relaxed font-medium bg-white/[0.02] p-4 rounded-2xl border border-white/5"
                            dangerouslySetInnerHTML={{ __html: profile.clubs || "Libre." }}
                        />
                    </div>
                </div>
            </div>

            {/* Footer / Branding */}
            <div className="p-8 mt-auto">
                <div className="p-6 bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-600/20 rounded-3xl space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-600 rounded-sm rotate-45" />
                        <span className="font-display font-black text-[10px] uppercase tracking-widest text-white">ProAthlete</span>
                    </div>
                    <p className="text-[9px] text-slate-500 font-bold leading-tight">Accès Privilégié - Dashboard v2.0</p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
