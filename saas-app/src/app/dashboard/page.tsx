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
        <div className="flex h-screen bg-black text-white overflow-hidden font-sans selection:bg-blue-600/30">
            {/* Sidebar - Sleek and integrated */}
            {profile && <Sidebar profile={profile} isAdmin={true} onRefresh={() => fetchUserData(user.uid)} />}

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto custom-scrollbar relative bg-[#050505]">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

                {/* Sticky Dashboard Header */}
                <header className="sticky top-0 z-40 bg-black/40 backdrop-blur-2xl border-b border-white/5 px-4 md:px-12 py-4 md:py-6 flex justify-between items-center translate-z-0">
                    <div className="flex items-center gap-3 md:gap-6">
                        <div className="space-y-0.5 md:space-y-1">
                            <h1 className="font-display text-lg md:text-2xl font-black uppercase tracking-tighter">Command Center</h1>
                            <div className="flex items-center gap-2 md:gap-3">
                                <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                <span className="text-[8px] md:text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Système Live</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        {/* Action Bar */}
                        <div className="hidden lg:flex items-center gap-4 pr-6 border-r border-white/10">
                            <Link
                                href={`/p/${profile?.username}`}
                                target="_blank"
                                className="btn-glass px-5 py-2.5 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border-white/5 hover:border-blue-600/30 transition-all"
                            >
                                Visionner Profil Public <ExternalLink size={14} className="text-blue-500" />
                            </Link>
                        </div>

                        <div className="flex items-center gap-2 md:gap-4">
                            <Link
                                href={`/p/${profile?.username}`}
                                target="_blank"
                                className="lg:hidden p-2.5 bg-white/5 rounded-xl border border-white/5 text-blue-500"
                            >
                                <ExternalLink size={18} />
                            </Link>
                            <button
                                onClick={() => setIsEditProfileOpen(true)}
                                className="p-2.5 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 group"
                                title="Paramètres Profil"
                            >
                                <UserCircle size={18} className="text-slate-400 group-hover:text-white" />
                            </button>
                            <button
                                onClick={handleLogout}
                                className="p-2.5 md:p-3 bg-red-600/10 hover:bg-red-600/20 rounded-xl transition-all border border-red-600/10 group"
                                title="Déconnexion"
                            >
                                <LogOut size={18} className="text-red-500" />
                            </button>
                        </div>
                    </div>
                </header>

                <div className="p-6 md:p-12 lg:p-16 max-w-[1400px] mx-auto space-y-12 md:space-y-16 animate-fade-in-up">
                    {/* Welcome Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-10">
                        <div className="space-y-3 md:space-y-4 max-w-2xl">
                            <h2 className="font-display text-3xl md:text-6xl font-black uppercase tracking-tighter leading-tight italic">
                                Prêt pour l'<span className="text-blue-600 text-glow">Action</span> ?
                            </h2>
                            <p className="text-slate-400 text-base md:text-lg font-medium leading-relaxed">
                                Gérez votre héritage digital. Ajoutez vos derniers exploits et laissez parler votre talent.
                            </p>
                        </div>

                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="btn-primary px-8 md:px-10 py-4 md:py-5 flex items-center justify-center gap-3 text-xs md:text-sm w-full md:w-auto"
                        >
                            <Plus size={18} strokeWidth={3} /> AJOUTER UN CLIPS / IMAGE
                        </button>
                    </div>

                    {/* Stats Dashboard Preview (Mockup for design) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                        {[
                            { label: 'Vues Profil', value: '1.2k', trend: '+12%' },
                            { label: 'Total Médias', value: mediaItems.length, trend: 'Updated' },
                            { label: 'Partages', value: '84', trend: '+5%' },
                        ].map((stat, i) => (
                            <div key={i} className={`btn-glass p-6 md:p-8 rounded-3xl md:rounded-[32px] border-white/5 flex items-end justify-between group hover:border-blue-600/30 transition-all ${i === 2 ? 'sm:col-span-2 md:col-span-1' : ''}`}>
                                <div className="space-y-0.5 md:space-y-1">
                                    <span className="text-[9px] md:text-[10px] text-slate-500 font-black uppercase tracking-widest">{stat.label}</span>
                                    <p className="text-3xl md:text-4xl font-display font-black group-hover:text-glow transition-all">{stat.value}</p>
                                </div>
                                <span className={`text-[9px] md:text-[10px] font-bold px-2 py-0.5 md:py-1 rounded bg-white/5 ${i === 1 ? 'text-blue-500' : 'text-green-500'}`}>
                                    {stat.trend}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Media Management Grid */}
                    <div className="space-y-10">
                        <div className="flex items-center gap-4">
                            <h3 className="font-display text-2xl font-black uppercase italic tracking-tighter">Votre Bibliothèque <span className="text-blue-600">Action</span></h3>
                            <div className="flex-1 h-px bg-white/5" />
                        </div>

                        <PortfolioGrid
                            initialItems={mediaItems}
                            isAdmin={true}
                            onRefresh={() => fetchUserData(user.uid)}
                        />
                    </div>
                </div>

                {/* Modals with updated styles handled in components */}
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
