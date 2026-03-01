import { supabase } from '@/lib/supabase';
import Sidebar from '@/components/layout/Sidebar';
import PortfolioGrid from '@/components/layout/PortfolioGrid';
import { notFound } from 'next/navigation';

interface ProfilePageProps {
    params: {
        username: string;
    };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const { username } = params;

    // 1. Fetch profile
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username.toLowerCase())
        .single();

    if (profileError || !profile) {
        notFound();
    }

    // 2. Fetch media items
    const { data: items, error: itemsError } = await supabase
        .from('media_items')
        .select('*')
        .eq('profile_id', profile.id)
        .order('created_at', { ascending: false });

    if (itemsError) {
        console.error('Error fetching media items:', itemsError);
    }

    const athlete = {
        name: profile.full_name || username,
        position: profile.position || 'Athlète',
        number: profile.number || '-',
        bio: profile.bio || '',
        clubs: profile.clubs || '',
        profilePicture: profile.profile_picture_url || '',
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-[#050505] text-white">
            <Sidebar athlete={athlete} />

            <main className="flex-1 md:ml-[300px] p-6 md:p-12">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">Séquences & Moments</h2>
                        <div className="w-20 h-1 bg-[#136dec] rounded-full" />
                    </div>

                    <PortfolioGrid items={items || []} />
                </div>
            </main>
        </div>
    );
}
