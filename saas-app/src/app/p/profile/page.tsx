'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import Sidebar from '@/components/layout/Sidebar';
import PortfolioGrid from '@/components/layout/PortfolioGrid';

export default function PublicPortfolio() {
    const [profile, setProfile] = useState<any>(null);
    const [mediaItems, setMediaItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        // Manually extract username from URL: /p/username
        const pathParts = window.location.pathname.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        const username = lastPart === 'profile'
            ? new URLSearchParams(window.location.search).get('u') // Fallback dev mode
            : lastPart;

        if (!username || username === 'p' || username === '') {
            setLoading(false);
            setError(true);
            return;
        }

        const targetUsername = username.toLowerCase();

        async function fetchData() {
            try {
                // Fetch Profile
                const profilesRef = collection(db, 'profiles');
                const qProfile = query(profilesRef, where('username', '==', targetUsername));
                const profileSnapshot = await getDocs(qProfile);

                if (!profileSnapshot.empty) {
                    const profileDoc = profileSnapshot.docs[0];
                    const profileData = { id: profileDoc.id, ...profileDoc.data() };
                    setProfile(profileData);

                    // Fetch Media
                    const mediaRef = collection(db, 'media_items');
                    const qMedia = query(mediaRef, where('profile_id', '==', profileData.id), orderBy('created_at', 'desc'));
                    const mediaSnapshot = await getDocs(qMedia);

                    setMediaItems(mediaSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    })));
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Error fetching portfolio data:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#136dec]/20 border-t-[#136dec] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || (!profile && !loading)) {
        return (
            <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-8 text-center space-y-6">
                <h1 className="text-4xl font-black uppercase tracking-tighter">Profil Introuvable</h1>
                <p className="text-[#a0a0a0] max-w-md">L'athlète que vous recherchez n'existe pas ou son portfolio a été désactivé.</p>
                <a href="/" className="text-[#136dec] font-black uppercase tracking-widest text-xs border-b border-[#136dec] pb-1">Retour à l'accueil</a>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-blue-600/30">
            {/* Immersive Header / Hero */}
            <section className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src={profile.profile_picture_url || '/default-avatar.png'}
                        alt={profile.full_name}
                        className="w-full h-full object-cover object-center scale-105 animate-slow-zoom"
                    />
                    {/* Multi-layered gradients for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
                    <div className="absolute inset-0 hero-gradient opacity-40" />
                </div>

                {/* Top Nav (Public view) */}
                <div className="relative z-20 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
                    <Link href="/" className="btn-glass p-3 rounded-full flex items-center justify-center border-white/10">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <div className="flex gap-4">
                        <button className="btn-glass py-2 px-6 rounded-full text-xs font-black uppercase tracking-widest border-white/10">Partager</button>
                        <button className="btn-primary py-2 px-8 rounded-full text-xs font-black uppercase tracking-widest">Connect</button>
                    </div>
                </div>

                {/* Athlete Identity Overlay */}
                <div className="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-16">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-10">
                        <div className="space-y-4 md:space-y-6 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <span className="px-3 py-1 bg-blue-600 rounded text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_var(--accent-glow)]">
                                    {profile.position || 'Elite Athlete'}
                                </span>
                                {profile.number && (
                                    <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded text-[8px] md:text-[10px] font-black uppercase tracking-widest border border-white/10">
                                        #{profile.number}
                                    </span>
                                )}
                            </div>
                            <h1 className="font-display text-4xl sm:text-5xl md:text-9xl font-black uppercase leading-none tracking-tighter text-glow break-words">
                                {profile.full_name || profile.username.toUpperCase()}
                            </h1>
                            <div className="flex items-center justify-center md:justify-start gap-6 text-slate-400 font-bold uppercase tracking-widest text-[10px] md:text-sm">
                                <div className="flex items-center gap-2">
                                    <svg className="w-3 h-3 md:w-4 md:h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{profile.clubs || 'France / Europe'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 w-full md:w-auto">
                            {[
                                { label: 'Vigueur', value: 'Elite' },
                                { label: 'Position', value: profile.position || 'Pro' },
                                { label: 'Expérience', value: '4 Ans' },
                            ].map((stat, i) => (
                                <div key={i} className={`btn-glass flex flex-col items-center justify-center p-4 md:p-6 rounded-2xl md:rounded-3xl border-white/5 hover:border-blue-600/30 transition-all group ${i === 2 ? 'col-span-2 md:col-span-1' : ''}`}>
                                    <span className="text-[8px] md:text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">{stat.label}</span>
                                    <span className="text-lg md:text-xl font-display font-black group-hover:text-blue-500 transition-colors uppercase">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Media Highlights Grid */}
            <main className="max-w-7xl mx-auto px-6 py-16 md:py-24 animate-fade-in-up">
                <div className="flex flex-col md:flex-row items-center md:items-baseline justify-between gap-6 mb-12 md:mb-16">
                    <h2 className="font-display text-3xl md:text-4xl font-black uppercase tracking-tighter italic text-center md:text-left">
                        Performance <span className="text-blue-600">Galerie</span>
                    </h2>
                    <div className="h-px flex-1 bg-white/5 mx-6 hidden md:block" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Highlights & Matchs ({mediaItems.length})</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {mediaItems.length > 0 ? (
                        <PortfolioGrid initialItems={mediaItems} isAdmin={false} />
                    ) : (
                        <div className="col-span-full py-32 md:py-40 border-2 border-dashed border-white/5 rounded-[32px] md:rounded-[40px] flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/20 flex items-center justify-center">
                                <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="font-display font-black uppercase tracking-widest text-xs md:text-sm">Aucun contenu média disponible</p>
                        </div>
                    )}
                </div>

                {/* Bio / About Section Section */}
                {profile.bio && (
                    <section className="mt-24 md:mt-32 p-8 md:p-20 bg-white/[0.02] border border-white/5 rounded-[32px] md:rounded-[40px] space-y-6 md:space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />
                        <h2 className="font-display text-2xl md:text-3xl font-black uppercase tracking-widest text-blue-600 text-center md:text-left">À propos de l'athlète</h2>
                        <div
                            className="text-base md:text-2xl text-slate-400 font-medium leading-[1.6] max-w-4xl text-center md:text-left"
                            dangerouslySetInnerHTML={{ __html: profile.bio }}
                        />
                    </section>
                )}
            </main>

            <footer className="py-20 text-center border-t border-white/5 mt-20">
                <div className="flex items-center justify-center gap-3 opacity-20 grayscale mb-6">
                    <div className="relative w-6 h-6 bg-blue-600 rounded-lg shadow-[0_0_15px_rgba(31,104,249,0.4)]" />
                    <span className="font-display font-black tracking-tighter text-sm uppercase">PROATHLETE PLATFORM</span>
                </div>
                <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em]">Propulsé par la vitrine sportive d'élite</p>
            </footer>
        </div>
    );
}
