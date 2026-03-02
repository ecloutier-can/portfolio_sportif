'use client';

import React, { useState } from 'react';
import { Play, ExternalLink, Trash2, Maximize2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

interface PortfolioItemProps {
    item: {
        id: string;
        title: string;
        type: string;
        category: string;
        url: string;
        thumbnail_url: string;
        description?: string;
        tags?: string[];
    };
    isAdmin?: boolean;
    onDelete?: () => void;
}

const PortfolioItem: React.FC<PortfolioItemProps> = ({ item, isAdmin = false, onDelete }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm("Supprimer ce média ?")) return;

        setIsDeleting(true);
        try {
            await deleteDoc(doc(db, 'media_items', item.id));
            if (onDelete) onDelete();
        } catch (error) {
            console.error("Error deleting media:", error);
            alert("Erreur lors de la suppression.");
        } finally {
            setIsDeleting(false);
        }
    };

    const openFullscreen = () => {
        window.open(item.url, '_blank');
    };

    return (
        <div className="athlete-card group relative flex flex-col h-[380px] md:h-[450px] cursor-pointer overflow-hidden border-white/5 hover:border-blue-600/30 transition-all duration-700" onClick={openFullscreen}>
            {/* Media/Thumbnail Container */}
            <div className="relative flex-1 overflow-hidden bg-slate-900">
                <img
                    src={item.thumbnail_url || '/placeholder-media.jpg'}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
                />

                {/* Immersive Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-transparent transition-colors duration-700" />

                {/* Content Type Badge */}
                <div className="absolute top-4 md:top-5 left-4 md:left-5 z-20">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] text-blue-500">
                        {item.type}
                    </span>
                </div>

                {/* Play/View Icon */}
                <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(31,104,249,0.5)] opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-out">
                        {item.type === 'Vidéo' || item.type === 'Youtube' ? (
                            <Play fill="white" className="w-5 h-5 md:w-6 md:h-6 ml-1" />
                        ) : (
                            <Maximize2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        )}
                    </div>
                </div>

                {/* Admin Controls */}
                {isAdmin && (
                    <div className="absolute top-4 md:top-5 right-4 md:right-5 z-30 flex gap-2">
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="p-2.5 md:p-3 bg-red-600/80 hover:bg-red-600 backdrop-blur-xl rounded-lg md:rounded-xl text-white shadow-xl transition-all hover:scale-110 active:scale-90 disabled:opacity-50"
                        >
                            <Trash2 size={16} strokeWidth={3} className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Info Section */}
            <div className="p-5 md:p-6 bg-[#0a0a0a] border-t border-white/5 space-y-3 md:space-y-4">
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">{item.category}</span>
                        <ExternalLink className="w-2.5 h-2.5 md:w-3 md:h-3 text-slate-700 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <h3 className="font-display text-lg md:text-xl font-black uppercase tracking-tighter text-white group-hover:text-glow transition-all line-clamp-1">
                        {item.title}
                    </h3>
                </div>

                {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 md:gap-2 pt-1 md:pt-2">
                        {item.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="text-[6px] md:text-[7px] font-black uppercase tracking-widest text-slate-600 border border-white/5 px-2 py-0.5 rounded">#{tag}</span>
                        ))}
                    </div>
                )}

                {/* Decorative border line */}
                <div className="w-full h-px bg-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-600 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-in-out" />
                </div>
            </div>
        </div>
    );
};

export default PortfolioItem;
