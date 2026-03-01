import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ProfileCard from '@/components/ui/ProfileCard';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch all profiles
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('updated_at', { ascending: false });

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#050505] text-white overflow-x-hidden">
      {/* Navbar / Header */}
      <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#136dec] rounded-lg shadow-[0_0_15px_rgba(19,109,236,0.5)]" />
          <span className="font-black tracking-tighter text-xl uppercase">ProAthlete</span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-xs font-bold uppercase tracking-widest text-[#a0a0a0] hover:text-white transition-colors px-4 py-2"
          >
            Connexion
          </Link>
          <Link
            href="/signup"
            className="bg-[#136dec] text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-full shadow-[0_5px_15px_rgba(19,109,236,0.3)] hover:scale-105 transition-all"
          >
            Créer mon Portfolio
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-16 space-y-24">
        {/* Intro Section */}
        <section className="text-center space-y-8 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#136dec] opacity-5 blur-[120px] rounded-full pointer-events-none" />

          <div className="space-y-4">
            <h2 className="text-[#136dec] text-xs font-black uppercase tracking-[4px]">Découvrez les talents</h2>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight uppercase">
              LES VITRINES DU<br />
              <span className="text-[#136dec]">SPORT DE HAUT NIVEAU</span>
            </h1>
          </div>
          <p className="text-lg md:text-xl text-[#a0a0a0] max-w-2xl mx-auto font-light leading-relaxed">
            La plateforme premium où les athlètes de demain brillent aujourd'hui. Explorez les portfolios et trouvez votre prochaine recrue.
          </p>
        </section>

        {/* Discovery Grid */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black tracking-tight uppercase">Talents à la une</h2>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {profiles && profiles.length > 0 ? (
              profiles.map((profile: any) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center space-y-4 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
                <p className="text-[#a0a0a0] font-medium italic">Aucun profile n'est encore disponible sur la plateforme.</p>
                <Link href="/signup" className="text-[#136dec] font-bold underline">Soyez le premier à créer le vôtre !</Link>
              </div>
            )}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="bg-gradient-to-br from-[#136dec]/10 to-transparent border border-[#136dec]/20 rounded-[40px] p-12 md:p-20 text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">PRÊT À FAIRE<br />BOUGER LES LIGNES ?</h2>
          <p className="text-[#a0a0a0] max-w-xl mx-auto">Rejoignez la communauté ProAthlete et donnez à votre carrière digitale l'excellence qu'elle mérite.</p>
          <Link
            href="/signup"
            className="inline-block px-12 py-5 bg-[#136dec] text-white font-black rounded-full text-lg transition-all hover:scale-110 hover:shadow-[0_0_40px_rgba(19,109,236,0.6)] active:scale-95"
          >
            LANCER MON PORTFOLIO MAINTENANT
          </Link>
        </section>
      </main>

      <footer className="py-12 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#136dec]/50 rounded shadow-sm" />
            <span className="font-black tracking-tighter text-sm uppercase opacity-50">ProAthlete © 2026</span>
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-[#444]">
            <a href="#" className="hover:text-white transition-colors">Conditions d'utilisation</a>
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
