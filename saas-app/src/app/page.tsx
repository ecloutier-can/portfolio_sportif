'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import ProfileCard from '@/components/ui/ProfileCard';

export default function Home() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfiles() {
      try {
        const profilesRef = collection(db, 'profiles');
        const q = query(profilesRef, orderBy('updated_at', 'desc'));
        const querySnapshot = await getDocs(q);

        const fetchedProfiles = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProfiles(fetchedProfiles);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfiles();
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full bg-black text-white font-sans overflow-x-hidden selection:bg-blue-600/30">
      {/* Navbar / Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-black/40 backdrop-blur-2xl border-b border-white/5 px-4 md:px-12 py-4 md:py-5 flex justify-between items-center translate-z-0">
        <div className="flex items-center gap-2 md:gap-3 group cursor-pointer">
          <div className="relative w-8 h-8 md:w-9 md:h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(31,104,249,0.4)] group-hover:shadow-[0_0_30px_rgba(31,104,249,0.7)] transition-all duration-500">
            <div className="w-3 h-3 md:w-4 md:h-4 bg-white rounded-sm rotate-45 transform group-hover:rotate-180 transition-transform duration-700" />
          </div>
          <span className="font-display font-black tracking-tighter text-lg md:text-2xl uppercase">PROATHLETE</span>
        </div>

        <nav className="hidden lg:flex items-center gap-10">
          <a href="#explore" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors">Athlètes</a>
          <a href="#" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors">Médias</a>
          <a href="#" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors">À Propos</a>
        </nav>

        <div className="flex items-center gap-3 md:gap-6">
          <Link
            href="/login"
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-all"
          >
            Log
          </Link>
          <Link
            href="/signup"
            className="btn-primary text-[10px] py-3 px-6 md:scale-100"
          >
            S'inscrire
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden mesh-grid">
          {/* Background Image with Overlays */}
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10s] ease-linear scale-110"
              style={{ backgroundImage: "url('/images/hero_bg.png')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
            <div className="absolute inset-0 hero-gradient opacity-60" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 text-center space-y-8 md:space-y-10">
            <div className="space-y-4 inline-block">
              <span className="inline-block py-1.5 px-4 bg-blue-600/10 border border-blue-600/20 rounded-full text-blue-500 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-4 animate-fade-in">
                Plateforme d'élite pour athlètes pro
              </span>
              <h1 className="font-display text-5xl md:text-9xl font-black tracking-tighter leading-[0.9] uppercase pointer-events-none">
                <span className="block text-white opacity-40">Excellence</span>
                <span className="block text-glow">Sportive</span>
              </h1>
            </div>

            <p className="text-base md:text-2xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
              La vitrine digitale premium où la performance rencontre l'opportunité. <br className="hidden md:block" />
              Exposez vos highlights, connectez-vous aux recruteurs.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5 pt-4 md:pt-8">
              <Link
                href="/signup"
                className="btn-primary text-sm md:text-base px-8 md:px-10 py-4 md:py-5 w-full sm:w-auto"
              >
                Lancer mon Portfolio
              </Link>
              <Link
                href="#explore"
                className="btn-glass text-sm md:text-base px-8 md:px-10 py-4 md:py-5 w-full sm:w-auto"
              >
                Explorer les Talents
              </Link>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
            <div className="w-px h-12 bg-gradient-to-b from-blue-600 to-transparent opacity-50" />
          </div>
        </section>

        {/* Discovery Portal */}
        <section id="explore" className="relative py-24 md:py-48 bg-[#050505] overflow-hidden">
          {/* Subtle Background Elements */}
          <div className="absolute top-0 left-1/4 w-px h-full bg-white/5" />
          <div className="absolute top-0 left-2/4 w-px h-full bg-white/5 hidden md:block" />
          <div className="absolute top-0 left-3/4 w-px h-full bg-white/5" />

          <div className="max-w-7xl mx-auto px-6 space-y-16 md:space-y-24 relative z-10">
            {/* Section Header & Categories */}
            <div className="space-y-10 md:space-y-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 md:w-10 h-px bg-blue-600" />
                    <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em]">Découverte</span>
                  </div>
                  <h2 className="font-display text-4xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8] animate-fade-in-up">
                    Elite <br />
                    <span className="text-blue-600">Scouts</span> Portal
                  </h2>
                </div>
                <p className="text-slate-500 font-medium text-base md:text-lg max-w-sm md:text-right">
                  Accédez aux profils des athlètes les plus prometteurs du moment.
                </p>
              </div>

              {/* Category Navigation Bar */}
              <div className="flex overflow-x-auto no-scrollbar pb-6 gap-3 md:gap-8 border-b border-white/5">
                {[
                  { label: 'Highlights', icon: '⚡' },
                  { label: 'Rising Stars', icon: '⭐' },
                  { label: 'Pro Drafts', icon: '🏆' },
                  { label: 'Top Recruits', icon: '🎯' },
                  { label: 'New Talent', icon: '🔥' },
                ].map((cat, i) => (
                  <button key={i} className={`flex items-center gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl whitespace-nowrap transition-all border ${i === 0 ? 'bg-blue-600/10 border-blue-600/30 text-white' : 'bg-white/5 border-white/5 text-slate-500 hover:text-white hover:border-white/10'}`}>
                    <span className="text-base md:text-lg">{cat.icon}</span>
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Rising Star / Member Spotlight */}
            {!loading && profiles && profiles.length > 0 && (
              <div className="relative group cursor-pointer overflow-hidden rounded-[32px] md:rounded-[48px] border border-white/10 bg-[#0a0a0a] min-h-[400px] md:min-h-[500px] flex flex-col md:flex-row shadow-2xl">
                <div className="w-full md:w-1/2 h-[250px] md:h-auto overflow-hidden">
                  <img
                    src={profiles[0].profile_picture_url || '/images/hero_athlete_bg.png'}
                    alt="Spotlight"
                    className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent hidden md:block" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent md:hidden" />
                </div>

                <div className="flex-1 p-8 md:p-16 flex flex-col justify-center space-y-6 md:space-y-8 relative z-10">
                  <div className="space-y-2">
                    <span className="inline-block px-3 py-1 bg-blue-600 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white shadow-[0_0_20px_rgba(31,104,249,0.5)]">
                      Rising Star Spotlight
                    </span>
                    <h3 className="font-display text-3xl md:text-6xl font-black uppercase tracking-tighter leading-none group-hover:text-glow transition-all">
                      {profiles[0].full_name || profiles[0].username}
                    </h3>
                    <p className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">
                      {profiles[0].position} • Class of '25
                    </p>
                  </div>

                  <p className="text-slate-400 text-base md:text-lg leading-relaxed line-clamp-3 font-medium">
                    {profiles[0].bio || "Découvrez un talent exceptionnel avec une vision de jeu unique et une détermination sans faille."}
                  </p>

                  <Link href={`/p/${profiles[0].username}`} className="btn-primary self-start px-8 md:px-10 py-4 md:py-5 text-xs md:text-sm">
                    Consulter Profil Complet
                  </Link>
                </div>
              </div>
            )}

            {/* Main Talent Grid */}
            <div className="space-y-10 md:space-y-12">
              <div className="flex items-center justify-between group">
                <h3 className="font-display text-xl md:text-2xl font-black uppercase tracking-tighter italic">Top Prospects</h3>
                <div className="flex-1 h-px bg-white/10 mx-6 md:mx-10 group-hover:bg-blue-600/30 transition-colors" />
                <button className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Voir Tout</button>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse rounded-[32px] md:rounded-[40px] border border-white/5" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                  {profiles && profiles.length > 0 ? (
                    profiles.slice(1).map((profile: any) => (
                      <ProfileCard key={profile.id} profile={profile} />
                    ))
                  ) : (
                    <div className="col-span-full py-20 md:py-32 text-center space-y-6 bg-slate-900/20 rounded-[32px] md:rounded-[40px] border border-dashed border-slate-800">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-6 h-6 md:w-8 md:h-8 text-white opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <p className="text-slate-500 font-bold text-lg md:text-xl uppercase tracking-tighter">Silence sur le terrain...</p>
                      <Link href="/signup" className="btn-primary px-8">Inscrivez-vous maintenant</Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Global Footer CTA */}
        <section className="relative py-24 md:py-32 overflow-hidden border-t border-white/5">
          <div className="absolute inset-0 z-0 hero-gradient opacity-20 rotate-180" />
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8 md:space-y-10">
            <h2 className="font-display text-4xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9]">
              Rejoignez <br />
              <span className="text-blue-600">l'Élite</span> Digitale
            </h2>
            <p className="text-slate-400 text-base md:text-xl font-medium max-w-xl mx-auto">
              Ne laissez pas votre talent passer inaperçu. Créez votre vitrine professionnelle en quelques minutes.
            </p>
            <Link href="/signup" className="btn-primary text-base md:text-lg px-10 md:px-12 py-5 md:py-6">
              Commencer Gratuitement
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-white/5 px-6 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 md:gap-8 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <div className="w-2 h-2 bg-white rotate-45" />
            </div>
            <span className="font-display font-black tracking-tighter text-sm uppercase opacity-40">PROATHLETE © 2026</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            <a href="#" className="hover:text-blue-500 transition-colors py-2 px-4 md:p-0">Politique</a>
            <a href="#" className="hover:text-blue-500 transition-colors py-2 px-4 md:p-0">Sécurité</a>
            <a href="#" className="hover:text-blue-500 transition-colors py-2 px-4 md:p-0">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
