'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import PortfolioGrid from '@/components/layout/PortfolioGrid';
import AddMediaModal from '@/components/ui/AddMediaModal';
import EditProfileModal from '@/components/ui/EditProfileModal';
import Link from 'next/link';

export default function Dashboard() {
    const [profile, setProfile] = useState<any>(null);
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const router = useRouter();

    const getDashboardData = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            router.push('/login');
            return;
        }

        const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        const { data: itemsData } = await supabase
            .from('media_items')
            .select('*')
            .eq('profile_id', user.id)
            .order('created_at', { ascending: false });

        setProfile(profileData);
        setItems(itemsData || []);
        setLoading(false);
    };

    useEffect(() => {
        getDashboardData();
    }, [router]);

    if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">CHARGEMENT...</div>;

    const athlete = {
        id: profile?.id,
        name: profile?.full_name || '',
        position: profile?.position || 'Athlète',
        number: profile?.number || '-',
        bio: profile?.bio || '',
        clubs: profile?.clubs || '',
        profilePicture: profile?.profile_picture_url || '',
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-[#050505] text-white">
            <Sidebar athlete={athlete} isAdmin={true} onRefresh={getDashboardData} />

            <main className="flex-1 md:ml-[300px] p-6 md:p-12 space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">GESTION DU PORTFOLIO</h2>
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-1 bg-[#2ed573] rounded-full" />
                            <Link
                                href={`/p/${profile.username}`}
                                target="_blank"
                                className="text-[10px] font-black uppercase tracking-widest text-[#a0a0a0] hover:text-[#136dec] border border-white/10 px-3 py-1 rounded-full transition-all"
                            >
                                VOIR MON PROFIL PUBLIC ↗
                            </Link>
                        </div>
                    </div>
                    <button
                        onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
                        className="bg-red-500/10 text-red-500 border border-red-500/20 px-6 py-2 rounded-full text-xs font-bold uppercase transition-all hover:bg-red-500 hover:text-white"
                    >
                        Déconnexion
                    </button>
                </div>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 space-y-6">
                        <h3 className="text-xl font-bold tracking-tight text-[#2ed573]">VOTRE CONTENU</h3>
                        <p className="text-[#a0a0a0] text-sm leading-relaxed">
                            Ajoutez des vidéos YouTube ou des photos Cloudinary à votre galerie publique.
                        </p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="w-full py-4 bg-[#2ed573] text-white font-bold rounded-2xl transition-all hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(46,213,115,0.3)]"
                        >
                            + AJOUTER UN EXTRAIT
                        </button>
                    </div>

                    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 space-y-6">
                        <h3 className="text-xl font-bold tracking-tight text-[#136dec]">VOTRE PROFIL</h3>
                        <p className="text-[#a0a0a0] text-sm leading-relaxed">
                            Mettez à jour vos informations personnelles, votre bio et votre parcours en club.
                        </p>
                        <button
                            onClick={() => setShowEditModal(true)}
                            className="w-full py-4 bg-[#136dec] text-white font-bold rounded-2xl transition-all hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(19,109,236,0.3)]"
                        >
                            MODIFIER LE PROFIL
                        </button>
                    </div>
                </section>

                <PortfolioGrid items={items} isAdmin={true} />

                {showAddModal && (
                    <AddMediaModal
                        userId={profile.id}
                        onClose={() => setShowAddModal(false)}
                        onSuccess={getDashboardData}
                    />
                )}

                {showEditModal && (
                    <EditProfileModal
                        profile={profile}
                        onClose={() => setShowEditModal(false)}
                        onSuccess={getDashboardData}
                    />
                )}
            </main>
        </div>
    );
}
