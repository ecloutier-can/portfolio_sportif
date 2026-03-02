'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import Sidebar from '@/components/layout/Sidebar';
import PortfolioGrid from '@/components/layout/PortfolioGrid';
import AddMediaModal from '@/components/ui/AddMediaModal';
import EditProfileModal from '@/components/ui/EditProfileModal';
import { LogOut, ExternalLink, Plus, UserCircle } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [mediaItems, setMediaItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                await fetchUserData(user.uid);
            } else {
                router.push('/login');
            }
        });

        return () => unsubscribe();
    }, [router]);

    const fetchUserData = async (uid: string) => {
        setLoading(true);
        try {
            // Fetch Profile
            const profileRef = doc(db, 'profiles', uid);
            const profileSnap = await getDoc(profileRef);

            if (profileSnap.exists()) {
                const profileData = { id: profileSnap.id, ...profileSnap.data() };
                setProfile(profileData);

                // Fetch Media Items
                const mediaRef = collection(db, 'media_items');
                const q = query(mediaRef, where('profile_id', '==', uid), orderBy('created_at', 'desc'));
                const mediaSnap = await getDocs(q);

                const items = mediaSnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setMediaItems(items);
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#136dec]/20 border-t-[#136dec] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
            {/* Sidebar - Fixe à gauche */}
            {profile && <Sidebar profile={profile} isAdmin={true} onRefresh={() => fetchUserData(user.uid)} />}

            {/* Contenu principal - Grille défilante */}
            <main className="flex-1 overflow-y-auto custom-scrollbar relative">
                {/* Header Dashboard */}
                <div className="sticky top-0 z-30 bg-black/50 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-black uppercase tracking-tighter">Tableau de Bord</h1>
                        <Link
                            href={`/p/${profile?.username}`}
                            target="_blank"
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#a0a0a0] hover:text-[#136dec] transition-colors"
                        >
                            Voir mon profil public <ExternalLink size={12} />
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsEditProfileOpen(true)}
                            className="flex items-center gap-2 text-xs font-bold bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl transition-all"
                        >
                            <UserCircle size={16} /> Éditer Profil
                        </button>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-[#444] hover:text-red-500 transition-colors"
                            title="Déconnexion"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>

                <div className="p-8 md:p-12 max-w-[1400px] mx-auto space-y-12">
                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black uppercase tracking-tighter">Votre Portfolio</h2>
                            <p className="text-[#a0a0a0] text-sm font-light">Gérez vos photos, vidéos et liens sociaux en un seul endroit.</p>
                        </div>

                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-[#136dec] text-white flex items-center gap-2 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_10px_30px_rgba(19,109,236,0.3)] hover:scale-105 transition-all active:scale-95"
                        >
                            <Plus size={18} /> Ajouter un Média
                        </button>
                    </div>

                    {/* Grille de médias */}
                    <PortfolioGrid
                        initialItems={mediaItems}
                        isAdmin={true}
                        onRefresh={() => fetchUserData(user.uid)}
                    />
                </div>

                {/* Modals */}
                {isAddModalOpen && user && (
                    <AddMediaModal
                        userId={user.uid}
                        onClose={() => setIsAddModalOpen(false)}
                        onSuccess={() => {
                            setIsAddModalOpen(false);
                            fetchUserData(user.uid);
                        }}
                    />
                )}

                {isEditProfileOpen && profile && (
                    <EditProfileModal
                        profile={profile}
                        onClose={() => setIsEditProfileOpen(false)}
                        onSuccess={() => {
                            setIsEditProfileOpen(false);
                            fetchUserData(user.uid);
                        }}
                    />
                )}
            </main>
        </div>
    );
}
