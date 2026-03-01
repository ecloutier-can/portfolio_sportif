'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface AddMediaModalProps {
    userId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddMediaModal({ userId, onClose, onSuccess }: AddMediaModalProps) {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('photo');
    const [url, setUrl] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const extractYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : url;
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        let finalThumbnail = thumbnailUrl;
        let finalUrl = url;

        // 1. Cloudinary IA Logan logic
        if (type === 'photo' && url.includes('cloudinary.com')) {
            if (!url.includes('/upload/')) {
                finalThumbnail = url;
            } else {
                finalThumbnail = url.replace('/upload/', '/upload/c_fill,g_auto,w_800,h_450,f_auto,q_auto/');
            }
        } else if (type === 'youtube') {
            const videoId = extractYouTubeId(url);
            finalUrl = videoId;
            if (!thumbnailUrl) {
                finalThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            }
        }

        if (!finalThumbnail) {
            finalThumbnail = 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800&auto=format&fit=crop';
        }

        try {
            const { error } = await supabase
                .from('media_items')
                .insert([{
                    profile_id: userId,
                    title,
                    type,
                    url: finalUrl,
                    thumbnail_url: finalThumbnail,
                    category,
                    tags: tags.split(',').map(t => t.trim()).filter(t => t),
                    description,
                }]);

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
            <div className="w-full max-w-xl bg-[#111] border border-white/10 rounded-3xl p-8 space-y-6">
                <h2 className="text-2xl font-black text-[#136dec] uppercase tracking-tight">Nouvel Extrait</h2>

                <form onSubmit={handleAdd} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#a0a0a0] uppercase tracking-widest ml-1">Titre</label>
                            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#a0a0a0] uppercase tracking-widest ml-1">Type</label>
                            <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm">
                                <option value="photo">Photo (Lien externe)</option>
                                <option value="video">Vidéo (Lien direct)</option>
                                <option value="youtube">YouTube / Social</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#a0a0a0] uppercase tracking-widest ml-1">URL / ID YouTube</label>
                        <input type="text" required value={url} onChange={e => setUrl(e.target.value)} placeholder="https://... ou ID YouTube" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#a0a0a0] uppercase tracking-widest ml-1">Miniature (Optionnel)</label>
                        <input type="text" value={thumbnailUrl} onChange={e => setThumbnailUrl(e.target.value)} placeholder="Laissé vide pour auto-génération" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#a0a0a0] uppercase tracking-widest ml-1">Catégorie</label>
                            <input type="text" required value={category} onChange={e => setCategory(e.target.value)} placeholder="Ex: Buts" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#a0a0a0] uppercase tracking-widest ml-1">Tags (virgules)</label>
                            <input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="But, Finale, Top" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#a0a0a0] uppercase tracking-widest ml-1">Description</label>
                        <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl transition-all hover:bg-white/10">ANNULER</button>
                        <button type="submit" disabled={loading} className="flex-1 py-4 bg-[#2ed573] text-white font-bold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(46,213,115,0.4)] disabled:opacity-50">
                            {loading ? 'ENREGISTREMENT...' : 'SAUVEGARDER'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
