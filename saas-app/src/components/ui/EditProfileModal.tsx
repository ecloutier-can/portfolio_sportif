'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface EditProfileModalProps {
    profile: any;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditProfileModal({ profile, onClose, onSuccess }: EditProfileModalProps) {
    const [fullName, setFullName] = useState(profile.full_name || '');
    const [position, setPosition] = useState(profile.position || '');
    const [number, setNumber] = useState(profile.number || '');
    const [bio, setBio] = useState(profile.bio || '');
    const [clubs, setClubs] = useState(profile.clubs || '');
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName,
                    position,
                    number,
                    bio,
                    clubs,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', profile.id);

            if (error) throw error;
            onSuccess();
            onClose();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="w-full max-w-xl bg-[#111] border border-white/10 rounded-3xl p-8 space-y-6 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-black text-[#136dec] uppercase tracking-tight">Modifier mon Profil</h2>

                <form onSubmit={handleUpdate} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#a0a0a0] uppercase tracking-widest ml-1">Nom Complet</label>
                            <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#a0a0a0] uppercase tracking-widest ml-1">Numéro</label>
                            <input type="text" value={number} onChange={e => setNumber(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#a0a0a0] uppercase tracking-widest ml-1">Position / Rôle</label>
                        <input type="text" value={position} onChange={e => setPosition(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#a0a0a0] uppercase tracking-widest ml-1">Bio (HTML supporté)</label>
                        <textarea rows={4} value={bio} onChange={e => setBio(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#a0a0a0] uppercase tracking-widest ml-1">Parcours / Clubs (HTML supporté)</label>
                        <textarea rows={4} value={clubs} onChange={e => setClubs(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl transition-all hover:bg-white/10">ANNULER</button>
                        <button type="submit" disabled={loading} className="flex-1 py-4 bg-[#136dec] text-white font-bold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(19,109,236,0.4)] disabled:opacity-50">
                            {loading ? 'MISE À JOUR...' : 'SAUVEGARDER'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
