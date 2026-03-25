import React, { useState, useMemo, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip 
} from 'recharts';
import { 
  Plus, Trash2, Save, History, PieChart as PieIcon, List, 
  Zap, Smile, Coffee, Book, Dumbbell, Gamepad2, Cigarette,
  Beer, Tv, Smartphone, Brain, Flame, Music, Camera,
  HeartPulse, Users, Star, Info, X, Heart, Utensils,
  Wind, Moon, Sun, Code, ShoppingCart, MessageSquare,
  Dices, Trees, BookOpen, Thermometer, Apple, CheckCircle, Award,
  Search, Settings, Sparkles, Trophy, Target, RotateCcw, Palette,
  Box, Download, Upload, LayoutList
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DopamineSource, Category, Snapshot } from './types';
import { cn } from './lib/utils';

const CATEGORY_COLORS = {
  healthy: '#10b981',
  neutral: '#f59e0b',
  unhealthy: '#f43f5e',
};

const DEFAULT_SOURCES: DopamineSource[] = [
  { id: '1', name: 'Programmēšana', value: 15, category: 'healthy', icon: 'Code' },
  { id: '2', name: 'Mākslas radīšana', value: 5, category: 'healthy', icon: 'Palette' },
  { id: '3', name: 'Pornogrāfija', value: 10, category: 'unhealthy', icon: 'Flame' },
  { id: '4', name: 'Nikotīns', value: 10, category: 'unhealthy', icon: 'Cigarette' },
  { id: '5', name: 'Marihuāna', value: 5, category: 'unhealthy', icon: 'Wind' },
  { id: '6', name: 'Sekss / Tuvība', value: 10, category: 'healthy', icon: 'Heart' },
  { id: '7', name: 'Saldumi / Junk Food', value: 10, category: 'unhealthy', icon: 'Coffee' },
  { id: '8', name: 'Video spēles', value: 8, category: 'neutral', icon: 'Gamepad2' },
  { id: '9', name: 'Sociālie tīkli', value: 12, category: 'unhealthy', icon: 'Smartphone' },
  { id: '10', name: 'Cilvēciskais kontakts', value: 5, category: 'healthy', icon: 'Users' },
  { id: '11', name: 'Meditācija', value: 3, category: 'healthy', icon: 'Zap' },
  { id: '12', name: 'Dziļas sarunas', value: 2, category: 'healthy', icon: 'MessageSquare' },
  { id: '13', name: 'Ēdiens', value: 5, category: 'neutral', icon: 'Utensils' },
  { id: '14', name: 'Mūzika', value: 5, category: 'healthy', icon: 'Music' },
  { id: '15', name: 'Sports / Gym', value: 15, category: 'healthy', icon: 'Dumbbell' },
  { id: '16', name: 'Alkohols', value: 5, category: 'unhealthy', icon: 'Beer' },
  { id: '17', name: 'TV / Seriāli', value: 5, category: 'neutral', icon: 'Tv' },
  { id: '18', name: 'Lasīšana', value: 3, category: 'healthy', icon: 'BookOpen' },
  { id: '19', name: 'Miegs', value: 10, category: 'healthy', icon: 'Moon' },
];

const ICON_MAP: Record<string, React.ElementType> = {
  Cigarette, Coffee, Smartphone, Brain, Dumbbell, Zap, 
  Gamepad2, Beer, Tv, Music, Camera, HeartPulse, Users, Star, Book, Flame, Smile,
  Heart, Utensils, Wind, Moon, Sun, Code, ShoppingCart, MessageSquare,
  Dices, Trees, BookOpen, Thermometer, Apple, CheckCircle, Award,
  Search, Settings, Sparkles, Trophy, Target, Palette
};

const getIconEmoji = (iconName: string) => {
  const emojis: Record<string, string> = {
    Code: '💻', Palette: '🎨', Flame: '🔞', Cigarette: '🚬', Wind: '🍃',
    Heart: '❤️', Coffee: '🍩', Gamepad2: '🎮', Smartphone: '📱', Users: '👥',
    Zap: '🧘', MessageSquare: '💬', Utensils: '🍲', Sun: '☀️', Trophy: '🏆',
    Music: '🎵', Dumbbell: '🏋️', Star: '⭐', Beer: '🍺', Tv: '📺', Camera: '📸',
    Moon: '🌙', HeartPulse: '💓', Book: '📚', Smile: '😊', ShoppingCart: '🛒', Dices: '🎲',
    Trees: '🌲', BookOpen: '📖', Thermometer: '🌡️', Apple: '🍎', CheckCircle: '✅',
    Award: '🥇', Search: '🔍', Settings: '⚙️', Sparkles: '✨', Target: '🎯'
  };
  return emojis[iconName] || '✨';
};

export default function App() {
  const [sources, setSources] = useState<DopamineSource[]>(() => {
    const saved = localStorage.getItem('dopamine-sources');
    return saved ? JSON.parse(saved) : DEFAULT_SOURCES;
  });
  const [view, setView] = useState<'chart' | 'list' | 'history'>('chart');
  const [is3D, setIs3D] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [tilt, setTilt] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isSpinning, setIsSpinning] = useState(false);
  const [snapshots, setSnapshots] = useState<Snapshot[]>(() => {
    const saved = localStorage.getItem('dopamine-snapshots');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const selectedSource = useMemo(() => 
    sources.find(s => s.id === selectedId), 
  [sources, selectedId]);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    let interval: any;
    if (isSpinning) {
      interval = setInterval(() => {
        setRotation(prev => prev + 0.5);
      }, 16);
    }
    return () => clearInterval(interval);
  }, [isSpinning]);

  useEffect(() => {
    localStorage.setItem('dopamine-sources', JSON.stringify(sources));
  }, [sources]);

  useEffect(() => {
    localStorage.setItem('dopamine-snapshots', JSON.stringify(snapshots));
  }, [snapshots]);

  const totalValue = useMemo(() => sources.reduce((acc, s) => acc + s.value, 0), [sources]);

  const chartData = useMemo(() => {
    return sources.map(s => ({
      ...s,
      percentage: totalValue > 0 ? (s.value / totalValue) * 100 : 0
    })).sort((a, b) => b.value - a.value);
  }, [sources, totalValue]);

  const healthScore = useMemo(() => {
    const healthySum = sources
      .filter(s => s.category === 'healthy')
      .reduce((acc, s) => acc + s.value, 0);
    return totalValue > 0 ? Math.round((healthySum / totalValue) * 100) : 0;
  }, [sources, totalValue]);

  const addSource = () => {
    const newSource: DopamineSource = {
      id: crypto.randomUUID(),
      name: 'Jauns avots',
      value: 10,
      category: 'neutral',
      icon: 'Star'
    };
    setSources([...sources, newSource]);
  };

  const updateSource = (id: string, updates: Partial<DopamineSource>) => {
    setSources(sources.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const removeSource = (id: string) => {
    setSources(sources.filter(s => s.id !== id));
  };

  const resetToDefaults = () => {
    setSources(DEFAULT_SOURCES);
  };

  const saveSnapshot = () => {
    const newSnapshot: Snapshot = {
      id: crypto.randomUUID(),
      date: new Date().toLocaleString('lv-LV'),
      healthScore,
      sources: [...sources]
    };
    setSnapshots([newSnapshot, ...snapshots]);
  };

  const deleteSnapshot = (id: string) => {
    setSnapshots(snapshots.filter(s => s.id !== id));
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#050816] text-white flex flex-col selection:bg-blue-500/30 font-sans">
      {/* Space Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1a1f35_0%,#050816_100%)]" />
        {Array.from({ length: 50 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: Math.random() * 2 + 'px',
              height: Math.random() * 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              opacity: Math.random() * 0.5,
              animationDelay: Math.random() * 5 + 's',
              animationDuration: 2 + Math.random() * 3 + 's'
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-50 flex items-center justify-between px-8 py-6 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="flex items-center gap-10">
          <div className="flex flex-col">
            <h1 className="text-3xl font-serif italic tracking-tight text-white leading-none">
              Dopamīna <span className="font-sans font-black uppercase text-[10px] tracking-[0.4em] text-blue-500 ml-2 not-italic">Aplis</span>
            </h1>
          </div>
          
          <div className="hidden lg:flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/10">
            <button 
              onClick={() => setIs3D(false)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2",
                !is3D ? "bg-white text-black shadow-xl" : "text-white/40 hover:text-white/60"
              )}
            >
              <PieIcon size={10} />
              2D View
            </button>
            <button 
              onClick={() => setIs3D(true)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2",
                is3D ? "bg-white text-black shadow-xl" : "text-white/40 hover:text-white/60"
              )}
            >
              <Box size={10} />
              3D View
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all",
              sidebarOpen 
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" 
                : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
            )}
          >
            <LayoutList size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Sources</span>
            <span className="bg-white/10 px-1.5 py-0.5 rounded-md text-[9px]">{sources.length}</span>
          </button>

          <div className="h-8 w-[1px] bg-white/5 mx-2" />

          <div className="hidden md:flex items-center gap-2 mr-4 border-r border-white/10 pr-6">
            <button 
              onClick={saveSnapshot}
              className="p-2 hover:bg-white/10 rounded-full transition-colors group relative"
              title="Saglabāt"
            >
              <Save size={18} className="text-white/60 group-hover:text-blue-400" />
            </button>
            <button 
              className="p-2 hover:bg-white/10 rounded-full transition-colors group relative"
              title="Eksportēt"
            >
              <Download size={18} className="text-white/60 group-hover:text-emerald-400" />
            </button>
            <button 
              className="p-2 hover:bg-white/10 rounded-full transition-colors group relative"
              title="Importēt"
            >
              <Upload size={18} className="text-white/60 group-hover:text-amber-400" />
            </button>
          </div>
          
          <button 
            onClick={() => setShowInfo(true)}
            className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all"
          >
            <Info size={18} className="text-white/60" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex relative z-10 overflow-hidden">
        {/* Main View Area */}
        <main className="flex-1 flex flex-col relative bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05)_0%,transparent_70%)] overflow-hidden">
          <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
            <div className="absolute top-6 md:top-12 left-1/2 -translate-x-1/2 text-center w-full px-4">
              <h2 className="text-4xl md:text-7xl font-serif italic tracking-tighter text-white/90 drop-shadow-2xl">
                The Balance
              </h2>
              <div className="mt-2 flex items-center justify-center gap-4">
                <div className="h-[1px] w-12 bg-white/10" />
                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] text-white/30">Dopamine Architecture</span>
                <div className="h-[1px] w-12 bg-white/10" />
              </div>
            </div>

            <div className="relative w-full max-w-4xl aspect-square flex items-center justify-center mt-12 md:mt-20">
              <AnimatePresence mode="wait">
                {!is3D ? (
                  <motion.div
                    key="2d"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="w-full h-full flex items-center justify-center relative"
                  >
                    {/* Center Info */}
                    <div className="absolute z-20 flex flex-col items-center justify-center pointer-events-none">
                      <div className="relative">
                        <motion.div
                          animate={{ 
                            scale: [1, 1.05, 1],
                            opacity: [0.5, 0.8, 0.5]
                          }}
                          transition={{ duration: 4, repeat: Infinity }}
                          className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"
                        />
                        <div className="w-24 h-24 md:w-40 md:h-40 bg-black/60 backdrop-blur-3xl rounded-full border border-white/10 flex flex-col items-center justify-center shadow-2xl relative z-10">
                          <div className={cn(
                            "text-4xl md:text-6xl font-serif italic leading-none",
                            healthScore > 60 ? "text-healthy" : healthScore > 30 ? "text-neutral" : "text-unhealthy"
                          )}>
                            {healthScore}
                          </div>
                          <div className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-black mt-2">
                            Health %
                          </div>
                        </div>
                      </div>
                    </div>

                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={isMobile ? 70 : 180}
                          outerRadius={isMobile ? 110 : 260}
                          paddingAngle={4}
                          cornerRadius={12}
                          dataKey="value"
                          stroke="rgba(255,255,255,0.05)"
                          strokeWidth={1}
                          isAnimationActive={false}
                          onClick={(data) => {
                            const id = data?.payload?.id;
                            if (id) setSelectedId(selectedId === id ? null : id);
                          }}
                          label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index, payload }) => {
                            const RADIAN = Math.PI / 180;
                            const radius = outerRadius + (isMobile ? 20 : 40);
                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                            const y = cy + radius * Math.sin(-midAngle * RADIAN);
                            const isSelected = selectedId === payload.id;
                            
                            if (isMobile && payload.percentage < 5 && !isSelected) return null;
                            if (!isMobile && payload.percentage < 1 && !isSelected) return null;

                            return (
                              <g>
                                <text 
                                  x={x} 
                                  y={y} 
                                  fill={isSelected ? "white" : "rgba(255,255,255,0.4)"}
                                  textAnchor={x > cx ? 'start' : 'end'} 
                                  dominantBaseline="central"
                                  className="text-[8px] md:text-[10px] font-serif italic tracking-wider"
                                >
                                  {payload.name}
                                </text>
                                <text 
                                  x={x} 
                                  y={y + (isMobile ? 10 : 14)} 
                                  fill={CATEGORY_COLORS[payload.category]}
                                  textAnchor={x > cx ? 'start' : 'end'} 
                                  dominantBaseline="central"
                                  className="text-[7px] md:text-[9px] font-black tracking-widest opacity-80"
                                >
                                  {payload.percentage.toFixed(1)}%
                                </text>
                              </g>
                            );
                          }}
                          labelLine={false}
                        >
                          {chartData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={CATEGORY_COLORS[entry.category]} 
                              fillOpacity={selectedId ? (selectedId === entry.id ? 1 : 0.1) : 0.7}
                              className="transition-all duration-500 cursor-pointer outline-none hover:fill-opacity-90"
                              stroke={selectedId === entry.id ? 'white' : 'none'}
                              strokeWidth={1}
                            />
                          ))}
                        </Pie>
                        {/* Icons inside segments */}
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={isMobile ? 85 : 210}
                          outerRadius={isMobile ? 95 : 230}
                          dataKey="value"
                          stroke="none"
                          fill="none"
                          isAnimationActive={false}
                          label={({ cx, cy, midAngle, innerRadius, outerRadius, payload }) => {
                            const RADIAN = Math.PI / 180;
                            const radius = (innerRadius + outerRadius) / 2;
                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                            const y = cy + radius * Math.sin(-midAngle * RADIAN);
                            const iconName = payload.icon;
                            
                            if (isMobile && payload.percentage < 6 && selectedId !== payload.id) return null;
                            if (!isMobile && payload.percentage < 3 && selectedId !== payload.id) return null;

                            return (
                              <text 
                                x={x} 
                                y={y} 
                                textAnchor="middle" 
                                dominantBaseline="central"
                                className="text-lg md:text-xl pointer-events-none drop-shadow-lg"
                              >
                                {getIconEmoji(iconName)}
                              </text>
                            );
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </motion.div>
                ) : (
                  <motion.div
                    key="3d"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="w-full h-full flex items-center justify-center perspective-2000"
                  >
                    <motion.div 
                      drag
                      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                      onDrag={(e, info) => {
                        setRotation(prev => prev + info.delta.x * 0.4);
                        setTilt(prev => Math.min(Math.max(prev - info.delta.y * 0.4, -30), 30));
                      }}
                      style={{ 
                        rotateY: rotation, 
                        rotateX: tilt,
                        scale: zoom,
                        transformStyle: 'preserve-3d'
                      }}
                      className="w-full h-full relative flex items-center justify-center cursor-grab active:cursor-grabbing"
                    >
                      {/* 3D Content */}
                      <div className="absolute inset-0 flex items-center justify-center transform rotateX(65deg)">
                        <div className="w-full h-full relative preserve-3d">
                          {/* Glow Layer */}
                          <div className="absolute inset-0 blur-2xl opacity-20 scale-110 pointer-events-none">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={chartData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={isMobile ? 70 : 120}
                                  outerRadius={isMobile ? 110 : 190}
                                  dataKey="value"
                                  stroke="none"
                                  isAnimationActive={false}
                                >
                                  {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.category]} />
                                  ))}
                                </Pie>
                              </PieChart>
                            </ResponsiveContainer>
                          </div>

                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={isMobile ? 70 : 120}
                                outerRadius={isMobile ? 110 : 190}
                                dataKey="value"
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth={1}
                                onClick={(data) => {
                                  const id = data?.payload?.id;
                                  if (id) setSelectedId(selectedId === id ? null : id);
                                }}
                              >
                                {chartData.map((entry, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={CATEGORY_COLORS[entry.category]} 
                                    fillOpacity={selectedId ? (selectedId === entry.id ? 1 : 0.1) : 0.6}
                                    className="transition-all duration-500"
                                  />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      {/* Stabilized Brain */}
                      <div 
                        className="absolute z-30 pointer-events-none"
                        style={{ transform: `rotateX(${-tilt}deg) rotateY(${-rotation}deg) translateZ(80px)` }}
                      >
                        <motion.div 
                          animate={{ 
                            y: [0, -10, 0],
                            filter: ["drop-shadow(0 0 10px rgba(59,130,246,0.3))", "drop-shadow(0 0 30px rgba(59,130,246,0.6))", "drop-shadow(0 0 10px rgba(59,130,246,0.3))"]
                          }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                          className="text-7xl md:text-8xl"
                        >
                          🧠
                        </motion.div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>

        {/* Sidebar / Drawer */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              />
              
              {/* Drawer */}
              <motion.aside 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 w-full sm:w-[450px] bg-[#0a0c1a]/95 backdrop-blur-3xl border-l border-white/10 flex flex-col z-[70] shadow-2xl"
              >
                <div className="p-8 flex items-center justify-between border-b border-white/5">
                  <div className="flex flex-col">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-3">
                      Dopamine Sources
                    </h3>
                    <span className="text-[10px] text-white/20 mt-1">Manage your architecture</span>
                  </div>
                  <button 
                    onClick={() => setSidebarOpen(false)}
                    className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                  {sources.map((source) => (
                    <div 
                      key={source.id} 
                      className={cn(
                        "bg-white/[0.02] border border-white/5 rounded-2xl p-5 transition-all hover:bg-white/[0.05] group relative overflow-hidden",
                        selectedId === source.id && "ring-1 ring-white/20 bg-white/[0.08]"
                      )}
                      onClick={() => setSelectedId(source.id)}
                    >
                      {selectedId === source.id && (
                        <motion.div 
                          layoutId="active-glow"
                          className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent pointer-events-none"
                        />
                      )}
                      
                      <div className="flex items-center gap-4 mb-5">
                        <div className="text-2xl w-12 h-12 flex items-center justify-center bg-white/5 rounded-xl border border-white/5">
                          {getIconEmoji(source.icon)}
                        </div>
                        <div className="flex-1">
                          <input 
                            type="text"
                            value={source.name}
                            onChange={(e) => updateSource(source.id, { name: e.target.value })}
                            className="bg-transparent border-none outline-none text-sm font-serif italic tracking-wide w-full focus:text-white transition-colors"
                          />
                          <div className="flex items-center gap-2 mt-1">
                            <div className={cn("w-1.5 h-1.5 rounded-full", 
                              source.category === 'healthy' ? "bg-healthy" : 
                              source.category === 'neutral' ? "bg-neutral" : "bg-unhealthy"
                            )} />
                            <span className="text-[8px] uppercase font-black tracking-widest text-white/30">{source.category}</span>
                          </div>
                        </div>
                        
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeSource(source.id); }}
                          className="opacity-0 group-hover:opacity-100 p-2 text-white/20 hover:text-unhealthy transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex-1 relative h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={false}
                            animate={{ width: `${source.value}%` }}
                            className={cn("absolute inset-y-0 left-0 rounded-full", 
                              source.category === 'healthy' ? "bg-healthy" : 
                              source.category === 'neutral' ? "bg-neutral" : "bg-unhealthy"
                            )}
                          />
                          <input 
                            type="range"
                            min="0"
                            max="100"
                            step="0.1"
                            value={source.value}
                            onChange={(e) => updateSource(source.id, { value: parseFloat(e.target.value) })}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </div>
                        <div className="flex flex-col items-end min-w-[70px] gap-1">
                          <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg border border-white/10 focus-within:border-white/30 transition-colors">
                            <input 
                              type="number"
                              min="0"
                              max="1000"
                              step="0.1"
                              value={source.value}
                              onChange={(e) => updateSource(source.id, { value: parseFloat(e.target.value) || 0 })}
                              className="bg-transparent border-none outline-none text-xs font-mono text-white/80 w-12 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                          </div>
                          <span className="text-[9px] font-black text-white/20 uppercase tracking-tighter">
                            {((source.value / totalValue) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button 
                    onClick={addSource}
                    className="w-full py-6 border border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-3 text-white/20 hover:text-white/40 hover:border-white/20 hover:bg-white/[0.02] transition-all group"
                  >
                    <Plus size={16} className="group-hover:rotate-90 transition-transform duration-500" />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em]">Add New Source</span>
                  </button>
                </div>

                <div className="p-8 border-t border-white/5 bg-black/40 space-y-4">
                  <div className="flex justify-between text-[9px] uppercase font-black tracking-[0.2em] text-white/20">
                    <span>Total Input</span>
                    <span className="font-mono text-white/40">{totalValue.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-[9px] uppercase font-black tracking-[0.2em] text-white/20">
                    <span>Normalized</span>
                    <span className="text-healthy font-mono">100.0%</span>
                  </div>
                  
                  <button 
                    onClick={resetToDefaults}
                    className="w-full py-3 text-[8px] uppercase font-black tracking-[0.3em] text-white/20 hover:text-unhealthy transition-colors"
                  >
                    Reset to Defaults
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Sidebar Toggle Button (Mobile) */}
        {!sidebarOpen && (
          <button 
            onClick={() => setSidebarOpen(true)}
            className="fixed right-6 bottom-6 z-[60] w-14 h-14 bg-emerald-500 text-white rounded-full shadow-2xl flex items-center justify-center md:hidden active:scale-90 transition-all hover:scale-110"
          >
            <List size={24} />
          </button>
        )}
      </div>

      {/* Info Modal (Simplified) */}
      <AnimatePresence>
        {showInfo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0a0f25] border border-white/10 p-8 max-w-lg w-full relative rounded-3xl"
            >
              <button 
                onClick={() => setShowInfo(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white"
              >
                <X size={24} />
              </button>
              <h3 className="text-2xl font-black mb-6 flex items-center gap-3 uppercase tracking-tighter">
                <Brain className="text-blue-400" size={32} />
                Dopamīna Balanss
              </h3>
              <div className="space-y-6 text-sm text-white/60 leading-relaxed font-medium">
                <p>
                  Dopamīns ir motivācijas un atlīdzības valūta. Tavs "aplis" vienmēr ir 100% pilns.
                </p>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 italic">
                  "Ja tu izņem 20% (piemēram, atmet smēķēšanu), bet neieliec neko vietā, smadzenes jūtas tukšas un meklē ātru aizvietotāju."
                </div>
                <p>
                  Mērķis ir pakāpeniski aizstāt <span className="text-unhealthy font-bold uppercase tracking-widest">kaitīgos</span> avotus ar <span className="text-healthy font-bold uppercase tracking-widest">veselīgiem</span>, saglabājot kopējo balansu.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
