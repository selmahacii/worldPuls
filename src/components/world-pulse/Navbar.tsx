'use client';

import React, { useState } from 'react';
import type { WorldPulsePayload } from '@/lib/world-pulse/types';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
    layers: { flights: boolean; crypto: boolean; markets: boolean; sports: boolean };
    onToggle: (key: any) => void;
    data: WorldPulsePayload | null;
    connected: boolean;
}

const LAYER_CONFIG = [
    { 
        key: 'flights', 
        label: 'Flights', 
        icon: '✈️', 
        color: '#60a5fa',
        glow: 'rgba(96, 165, 250, 0.4)'
    },
    { 
        key: 'crypto', 
        label: 'Blockchain', 
        icon: '⚡', 
        color: '#fbbf24',
        glow: 'rgba(251, 191, 36, 0.4)'
    },
    { 
        key: 'markets', 
        label: 'Markets', 
        icon: '📈', 
        color: '#22c55e',
        glow: 'rgba(34, 197, 94, 0.4)'
    },
    { 
        key: 'sports', 
        label: 'Sports', 
        icon: '⚽', 
        color: '#f97316',
        glow: 'rgba(249, 115, 22, 0.4)'
    },
];

export default function Navbar({ layers, onToggle, data, connected }: NavbarProps) {
    const [hoveredKey, setHoveredKey] = useState<string | null>(null);

    const getCount = (key: string): number | null => {
        if (!data) return null;
        switch (key) {
            case 'flights': return data.flights?.length || 0;
            case 'crypto': return data.crypto_arcs?.length || 0;
            case 'markets': return data.markets?.length || 0;
            case 'sports': return data.live_matches?.length || 0;
            default: return null;
        }
    };

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center px-2 py-2 gap-4">
            {/* Main Dock Container */}
            <div className="relative flex items-center gap-1 p-1.5 glass-dock rounded-2xl border border-white/10 shadow-2xl backdrop-blur-2xl">
                
                {/* Logo Section */}
                <div className="flex items-center gap-3 px-4 py-2 mr-2 border-r border-white/5">
                    <div className="relative flex items-center justify-center">
                         <div className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                         {connected && <div className="absolute w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-75" />}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold tracking-[0.3em] text-white/90 leading-none">WORLD PULSE</span>
                        <span className="text-[7px] tracking-[0.1em] text-white/40 font-mono mt-1 uppercase">
                            {connected ? 'System Online' : 'Connecting...'}
                        </span>
                    </div>
                </div>

                {/* Layer Toggles */}
                <div className="flex items-center gap-1">
                    {LAYER_CONFIG.map(({ key, label, icon, color, glow }) => {
                        const isActive = layers[key as keyof typeof layers];
                        const count = getCount(key);
                        const isHovered = hoveredKey === key;

                        return (
                            <button
                                key={key}
                                onClick={() => onToggle(key)}
                                onMouseEnter={() => setHoveredKey(key)}
                                onMouseLeave={() => setHoveredKey(null)}
                                className={`relative group flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-300 ease-out out ${
                                    isActive 
                                    ? 'text-white' 
                                    : 'text-white/40 hover:text-white/70'
                                }`}
                            >
                                {/* Active Background Indicator */}
                                {isActive && (
                                    <motion.div 
                                        layoutId="active-pill"
                                        className="absolute inset-0 rounded-xl z-0"
                                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                                        transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                                    />
                                )}

                                {/* Content */}
                                <span className={`relative z-10 text-sm transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
                                    {icon}
                                </span>
                                
                                <div className="relative z-10 flex flex-col items-start">
                                    <span className={`text-[9px] font-medium tracking-wide uppercase transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                                        {label}
                                    </span>
                                    {count !== null && (
                                        <AnimatePresence mode="wait">
                                            <motion.span 
                                                key={count}
                                                initial={{ opacity: 0, y: 2 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -2 }}
                                                className="text-[8px] font-mono opacity-40"
                                            >
                                                {count.toLocaleString()}
                                            </motion.span>
                                        </AnimatePresence>
                                    )}
                                </div>

                                {/* Bottom Active line */}
                                {isActive && (
                                    <motion.div 
                                        layoutId="active-line"
                                        className="absolute -bottom-1 left-4 right-4 h-0.5 rounded-full z-10"
                                        style={{ background: color, boxShadow: `0 0 8px ${glow}` }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <style jsx>{`
                .glass-dock {
                    background: linear-gradient(
                        180deg, 
                        rgba(255, 255, 255, 0.08) 0%, 
                        rgba(255, 255, 255, 0.03) 100%
                    );
                    box-shadow: 
                        0 4px 32px -4px rgba(0, 0, 0, 0.5),
                        inset 0 1px 1px 0 rgba(255, 255, 255, 0.1);
                }
            `}</style>
        </nav>
    );
}
