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
        <div className="space-y-8">
            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/[0.02] border border-white/5 p-4 rounded-3xl backdrop-blur-sm">
                <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2 md:pb-0">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === cat
                                    ? 'bg-[#136dec] text-white shadow-[0_5px_15px_rgba(19,109,236,0.2)]'
                                    : 'bg-white/5 text-[#a0a0a0] hover:bg-white/10'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="relative group min-w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444] group-focus-within:text-[#136dec] transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="RECHERCHER UN MÉDIA..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-xs focus:ring-1 focus:ring-[#136dec] focus:outline-none transition-all placeholder:text-[#333] font-bold"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                    <div className="col-span-full py-32 text-center space-y-4">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto opacity-20">
                            <Search size={32} />
                        </div>
                        <p className="text-[#a0a0a0] font-light">Aucun résultat pour votre recherche.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PortfolioGrid;
