'use client';

import React, { useState, useEffect } from 'react';
import PortfolioItem from '@/components/ui/PortfolioItem';
import { Search } from 'lucide-react';

interface PortfolioGridProps {
    initialItems: any[];
    isAdmin?: boolean;
    onRefresh?: () => void;
}

const PortfolioGrid: React.FC<PortfolioGridProps> = ({ initialItems, isAdmin = false, onRefresh }) => {
    const [filter, setFilter] = useState('Tous');
    const [searchTerm, setSearchTerm] = useState('');
    const [items, setItems] = useState(initialItems);

    useEffect(() => {
        setItems(initialItems);
    }, [initialItems]);

    const categories = ['Tous', 'Photo', 'Vidéo', 'Youtube', 'Réseaux Sociaux'];

    const filteredItems = items.filter(item => {
        const matchesCategory = filter === 'Tous' || item.category === filter || item.type === filter;
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.tags && item.tags.some((t: string) => t.toLowerCase().includes(searchTerm.toLowerCase())));
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="space-y-8 md:space-y-12">
            {/* Filters & Search */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-8 pb-6 md:pb-8 border-b border-white/5">
                <div className="flex items-center gap-2 md:gap-3 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 md:px-8 py-2.5 md:py-3 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border ${filter === cat
                                ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_20px_var(--accent-glow)] scale-105'
                                : 'bg-white/[0.03] border-white/5 text-slate-500 hover:text-white hover:border-white/10'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="relative group w-full lg:w-96">
                    <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="RECHERCHER DANS LE PORTFOLIO..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/5 rounded-xl md:rounded-2xl pl-12 md:pl-14 pr-6 md:pr-8 py-3.5 md:py-4 text-[10px] md:text-xs font-bold focus:ring-1 focus:ring-blue-600 focus:outline-none transition-all placeholder:text-slate-700 tracking-widest text-white"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        <PortfolioItem
                            key={item.id}
                            item={item}
                            isAdmin={isAdmin}
                            onDelete={onRefresh || (() => { })}
                        />
                    ))
                ) : (
                    <div className="col-span-full py-40 text-center space-y-6 bg-white/[0.01] rounded-[40px] border border-dashed border-white/5">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto opacity-20">
                            <Search size={32} />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xl font-display font-black uppercase tracking-tighter">Aucun média trouvé</p>
                            <p className="text-slate-500 text-sm font-medium">Réessayez avec d'autres mots-clés ou catégories.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PortfolioGrid;
