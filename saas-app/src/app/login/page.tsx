'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] p-4">
            <div className="w-full max-w-md p-8 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
                <h1 className="text-3xl font-black mb-6 text-center tracking-tight">CONNEXION</h1>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
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
                        {loading ? 'CONNEXION EN COURS...' : 'SE CONNECTER'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-[#a0a0a0]">
                    Pas encore de compte ? <Link href="/signup" className="text-[#136dec] font-bold">S'inscrire</Link>
                </div>
            </div>
        </div>
    );
}
