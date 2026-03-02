'use client';

import React, { useState } from 'react';
import { X, Save, User, ShieldCheck } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface EditProfileModalProps {
    profile: any;
    onClose: () => void;
    onSuccess: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ profile, onClose, onSuccess }) => {
    const [fullName, setFullName] = useState(profile.full_name || '');
    const [position, setPosition] = useState(profile.position || '');
    const [number, setNumber] = useState(profile.number || '');
    const [bio, setBio] = useState(profile.bio || '');
    const [clubs, setClubs] = useState(profile.clubs || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const profileRef = doc(db, 'profiles', profile.id);
            await updateDoc(profileRef, {
                full_name: fullName,
                position,
                number,
                bio,
                clubs,
                updated_at: new Date().toISOString()
            });

            onSuccess();
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Erreur lors de la mise à jour.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#136dec]/10 rounded-2xl text-[#136dec]">
                            <ShieldCheck size={24} />
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter">Modifier Profil</h2>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6 md:col-span-2">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#444] ml-2">Nom Complet</label>
                                <input
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-xs focus:border-[#136dec] focus:outline-none transition-all font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#444] ml-2">Position / Poste</label>
                            <input
                                value={position}
                                onChange={e => setPosition(e.target.value)}
                                placeholder="EX: ATTAQUANT"
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-xs focus:border-[#136dec] focus:outline-none transition-all font-bold"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#444] ml-2">Numéro</label>
                            <input
                                value={number}
                                onChange={e => setNumber(e.target.value)}
                                placeholder="EX: 10"
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-xs focus:border-[#136dec] focus:outline-none transition-all font-bold"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#444] ml-2">Biographie (HTML Supporté)</label>
                            <textarea
                                value={bio}
                                onChange={e => setBio(e.target.value)}
                                rows={4}
                                className="w-full bg-white/[0.03] border border-white/5 rounded-3xl px-6 py-4 text-xs focus:border-[#136dec] focus:outline-none transition-all font-medium custom-scrollbar"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#444] ml-2">Clubs / Parcours (HTML Supporté)</label>
                            <textarea
                                value={clubs}
                                onChange={e => setClubs(e.target.value)}
                                rows={4}
                                className="w-full bg-white/[0.03] border border-white/5 rounded-3xl px-6 py-4 text-xs focus:border-[#136dec] focus:outline-none transition-all font-medium custom-scrollbar"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4 sticky bottom-0 bg-[#0a0a0a] pb-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-5 rounded-2xl font-black uppercase tracking-widest text-xs border border-white/10 hover:bg-white/5 transition-all"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] bg-[#136dec] text-white flex items-center justify-center gap-3 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_10px_30px_rgba(19,109,236,0.3)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                        >
                            {loading ? 'MISE À JOUR...' : <><Save size={18} /> ENREGISTRER LES MODIFICATIONS</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
