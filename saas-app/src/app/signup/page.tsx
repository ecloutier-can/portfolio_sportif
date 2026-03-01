'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Sign up user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (authError) throw authError;

            if (authData.user) {
                // 2. Create profile
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            id: authData.user.id,
                            username: username.toLowerCase(),
                            full_name: username, // Default
                        },
                    ]);

                if (profileError) throw profileError;

                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] p-4">
            <div className="w-full max-w-md p-8 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
                <h1 className="text-3xl font-black mb-6 text-center tracking-tight">CRÉER UN COMPTE</h1>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#a0a0a0] uppercase tracking-widest ml-1">Nom d'utilisateur</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="votre-nom"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#136dec] outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#a0a0a0] uppercase tracking-widest ml-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@example.com"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#136dec] outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#a0a0a0] uppercase tracking-widest ml-1">Mot de passe</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#136dec] outline-none transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-[#136dec] text-white font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                    >
                        {loading ? 'INSCRIPTION...' : 'S\'INSCRIRE'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-[#a0a0a0]">
                    Déjà un compte ? <Link href="/login" className="text-[#136dec] font-bold">Se connecter</Link>
                </div>
            </div>
        </div>
    );
}
