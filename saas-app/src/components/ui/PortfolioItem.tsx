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
        <div className="group relative bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden aspect-[4/5] flex flex-col transition-all duration-500 hover:scale-[1.03] hover:border-[#136dec]/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer" onClick={openFullscreen}>
            {/* Thumbnail Container */}
            <div className="relative flex-1 overflow-hidden bg-[#111]">
                <img
                    src={item.thumbnail_url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                />

                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    {item.type === 'Vidéo' || item.type === 'Youtube' ? (
                        <div className="w-16 h-16 bg-[#136dec] rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500">
                            <Play fill="white" className="ml-1" />
                        </div>
                    ) : (
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500">
                            <Maximize2 size={24} />
                        </div>
                    )}
                </div>

                {/* Admin Controls */}
                {isAdmin && (
                    <div className="absolute top-4 right-4 z-20 flex gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="p-3 bg-red-600/90 hover:bg-red-600 rounded-full text-white backdrop-blur-md shadow-lg transition-transform hover:scale-110 active:scale-90 disabled:opacity-50"
                        >
                            <Trash2 size={16} strokeWidth={3} />
                        </button>
                    </div>
                )}

                {/* Type Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-[8px] font-black uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">
                    {item.type}
                </div>
            </div>

            {/* Info Section */}
            <div className="p-6 space-y-3 bg-[#0a0a0a] border-t border-white/5 relative">
                <div className="space-y-1">
                    <h3 className="text-sm font-black tracking-tight uppercase group-hover:text-[#136dec] transition-colors line-clamp-1">{item.title}</h3>
                    <div className="flex items-center gap-2 text-[#444] text-[9px] font-black uppercase tracking-widest">
                        <span>{item.category}</span>
                        <span className="w-1 h-1 bg-[#136dec] rounded-full opacity-50" />
                        <ExternalLink size={10} />
                    </div>
                </div>

                {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags.map((tag, idx) => (
                            <span key={idx} className="text-[7px] font-black uppercase tracking-tighter text-[#222] group-hover:text-[#136dec]/50 transition-colors">#{tag}</span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PortfolioItem;
