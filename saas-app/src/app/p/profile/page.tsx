'use client';

import { useEffect, useState } from 'react';
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
        <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
            {/* Sidebar - Fixe à gauche */}
            <Sidebar profile={profile} isAdmin={false} />

            {/* Contenu principal - Grille défilante */}
            <main className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-8 md:p-12 lg:p-16 max-w-[1600px] mx-auto">
                    <PortfolioGrid initialItems={mediaItems} isAdmin={false} />
                </div>
            </main>
        </div>
    );
}
