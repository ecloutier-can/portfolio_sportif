'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Create profile in Firestore
            await setDoc(doc(db, 'profiles', user.uid), {
                username: username.toLowerCase(),
                full_name: username, // Default to username
                email: email,
                updated_at: new Date().toISOString()
            });

            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
            <div className="w-full max-w-md space-y-8 bg-white/[0.03] border border-white/10 p-10 rounded-[40px] shadow-2xl backdrop-blur-xl">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black uppercase tracking-tighter">Rejoindre ProAthlete</h1>
                    <p className="text-[#a0a0a0] text-sm font-light">Créez votre vitrine sportive dès aujourd'hui.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-4 rounded-2xl text-center font-bold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#444] ml-4">Nom d'utilisateur</label>
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-[#136dec] focus:outline-none transition-all placeholder:text-[#333]"
                                placeholder="ex: jdoe_athlete"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#444] ml-4">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-[#136dec] focus:outline-none transition-all placeholder:text-[#333]"
                                placeholder="votre@email.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#444] ml-4">Mot de passe</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-[#136dec] focus:outline-none transition-all placeholder:text-[#333]"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#136dec] text-white font-black uppercase tracking-widest py-5 rounded-2xl shadow-[0_10px_30px_rgba(19,109,236,0.3)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {loading ? 'CRÉATION...' : 'CRÉER MON COMPTE'}
                    </button>
                </form>

                <p className="text-center text-xs text-[#444] font-bold">
                    DÉJÀ UN COMPTE ? <Link href="/login" className="text-white hover:text-[#136dec] transition-colors">SE CONNECTER</Link>
                </p>
            </div>
        </div>
    );
}
