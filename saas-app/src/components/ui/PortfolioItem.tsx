'use client';

import { supabase } from '@/lib/supabase';

interface PortfolioItemProps {
    item: {
        id: string;
        title: string;
        type: string;
        url: string;
        thumbnail_url: string;
        category: string;
        tags: string[];
        description: string;
    };
    isAdmin?: boolean;
    onRefresh?: () => void;
}

export default function PortfolioItem({ item, isAdmin, onRefresh }: PortfolioItemProps) {
    const isVideo = item.type === 'video' || item.type === 'youtube';

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Voulez-vous vraiment supprimer cet extrait ?')) return;

        const { error } = await supabase
            .from('media_items')
            .delete()
            .eq('id', item.id);

        if (error) {
            alert(error.message);
        } else if (onRefresh) {
            onRefresh();
        }
    };

    return (
        <div className="group relative bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:border-white/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {isAdmin && (
                <button
                    onClick={handleDelete}
                    className="absolute top-4 left-4 z-10 w-8 h-8 rounded-full bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white/10"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            )}

            <div className="aspect-video relative overflow-hidden">
                <img
                    src={item.thumbnail_url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                    {item.category}
                </div>
                {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition-colors">
                        <div className="w-12 h-12 bg-[#136dec] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(19,109,236,0.5)]">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6 space-y-3">
                <h3 className="font-bold text-lg tracking-tight group-hover:text-[#136dec] transition-colors line-clamp-1">{item.title}</h3>

                <div className="flex flex-wrap gap-2">
                    {item.tags?.map(tag => (
                        <span key={tag} className="text-[10px] font-bold text-[#136dec] bg-[#136dec]/10 px-2 py-0.5 rounded-md border border-[#136dec]/20">
                            #{tag}
                        </span>
                    ))}
                </div>

                <p className="text-[#a0a0a0] text-sm leading-relaxed line-clamp-2">
                    {item.description}
                </p>
            </div>
        </div>
    );
}
