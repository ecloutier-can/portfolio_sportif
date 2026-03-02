'use client';

import React, { useState } from 'react';
import { X, Link as LinkIcon, Camera, Video, Youtube, Instagram, Save } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface AddMediaModalProps {
    userId: string;
    onClose: () => void;
    onSuccess: () => void;
}

const AddMediaModal: React.FC<AddMediaModalProps> = ({ userId, onClose, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [category, setCategory] = useState('HIGHLIGHT');
    const [type, setType] = useState('Photo');
    const [loading, setLoading] = useState(false);

    // Helper to extract Youtube ID or handle Cloudinary/Social Thumbnails
    const generateThumbnail = (mediaUrl: string, mediaType: string) => {
        if (mediaType === 'Youtube') {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = mediaUrl.match(regExp);
            const id = (match && match[2].length === 11) ? match[2] : null;
            return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : '';
        }

        // Cloudinary AI Optimization (Crop 16:9 IA)
        if (mediaUrl.includes('cloudinary.com')) {
            return mediaUrl.replace('/upload/', '/upload/c_fill,g_auto,w_800,h_450/');
        }

        return mediaUrl; // Fallback
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const thumbUrl = generateThumbnail(url, type);

            await addDoc(collection(db, 'media_items'), {
                profile_id: userId,
                title,
                url,
                type,
                category,
                thumbnail_url: thumbUrl,
                created_at: serverTimestamp(),
                tags: [category.toLowerCase()]
            });

            onSuccess();
        } catch (error) {
            console.error("Error adding media:", error);
            alert("Erreur lors de l'ajout.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-8 border-b border-white/5 flex justify-between items-center">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-black uppercase tracking-tighter">Ajouter un Média</h2>
                        <div className="flex gap-4 text-[8px] font-black uppercase tracking-[3px] text-[#444]">
                            <span className={type === 'Photo' ? 'text-[#136dec]' : ''}>Cloudinary</span>
                            <span className={type === 'Youtube' ? 'text-[#136dec]' : ''}>YouTube</span>
                            <span className={type === 'Video' ? 'text-[#136dec]' : ''}>Vimeo</span>
                            <span>Instagram</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#444] ml-2">Titre du média</label>
                            <input
                                required
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="EX: BUT DÉCISIF CHAMPIONNAT"
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-xs focus:border-[#136dec] focus:outline-none transition-all placeholder:text-[#222] font-bold"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#444] ml-2">Lien URL (Vidéo ou Image)</label>
                            <div className="relative">
                                <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-[#222]" size={14} />
                                <input
                                    required
                                    value={url}
                                    onChange={e => setUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-xs focus:border-[#136dec] focus:outline-none transition-all placeholder:text-[#222] font-bold"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#444] ml-2">Type</label>
                                <select
                                    value={type}
                                    onChange={e => setType(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-xs focus:border-[#136dec] focus:outline-none appearance-none font-bold text-[#a0a0a0]"
                                >
                                    <option value="Photo">PHOTO</option>
                                    <option value="Vidéo">VIDÉO</option>
                                    <option value="Youtube">YOUTUBE</option>
                                    <option value="Réseaux Sociaux">SOCIALS</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#444] ml-2">Catégorie</label>
                                <select
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-xs focus:border-[#136dec] focus:outline-none appearance-none font-bold text-[#a0a0a0]"
                                >
                                    <option value="HIGHLIGHT">HIGHLIGHT</option>
                                    <option value="MATCH">MATCH</option>
                                    <option value="ENTRAÎNEMENT">TRAINING</option>
                                    <option value="PRESSE">PRESSE</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#136dec] text-white flex items-center justify-center gap-3 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_10px_30px_rgba(19,109,236,0.3)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                        {loading ? 'ENREGISTREMENT...' : <><Save size={18} /> ENREGISTRER LE MÉDIA</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddMediaModal;
