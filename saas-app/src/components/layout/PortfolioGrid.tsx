'use client';

import { useState } from 'react';
import PortfolioItem from '@/components/ui/PortfolioItem';

interface MediaItem {
    id: string;
    title: string;
    type: string;
    url: string;
    thumbnail_url: string;
    category: string;
    tags: string[];
    description: string;
}

interface PortfolioGridProps {
    items: MediaItem[];
    isAdmin?: boolean;
}

export default function PortfolioGrid({ items, isAdmin }: PortfolioGridProps) {
    const [filter, setFilter] = useState('Tous');
    const [search, setSearch] = useState('');

    const categories = ['Tous', ...Array.from(new Set(items.map(i => i.category)))];

    const filteredItems = items.filter(item => {
        const matchesFilter = filter === 'Tous' || item.category === filter;
        const matchesSearch = !search ||
            item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.description.toLowerCase().includes(search.toLowerCase()) ||
            item.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));

        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1 max-w-xl relative">
                    <input
                        type="text"
                        placeholder="Rechercher une séquence, un tag..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:border-[#136dec] outline-none transition-all"
                    />
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a0a0]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-[#a0a0a0] text-xs font-bold uppercase tracking-wider">Filtrer par :</span>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2 text-sm font-bold outline-none cursor-pointer hover:border-[#136dec] transition-all"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat} className="bg-[#050505]">{cat}</option>
                        ))}
                    </select>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredItems.map(item => (
                    <PortfolioItem key={item.id} item={item} isAdmin={isAdmin} />
                ))}
            </div>
        </div>
    );
}
