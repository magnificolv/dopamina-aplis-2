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
  Search, Settings, Sparkles, Trophy, Target, RotateCcw, Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DopamineSource, Category, Snapshot } from './types';
import { cn } from './lib/utils';

const CATEGORY_COLORS = {
  healthy: '#22c55e',
  neutral: '#eab308',
  unhealthy: '#ef4444',
};

const DEFAULT_SOURCES: DopamineSource[] = [
  { id: '1', name: 'Programmēšana', value: 10, category: 'healthy', icon: 'Code' },
  { id: '2', name: 'Mākslas radīšana', value: 1, category: 'healthy', icon: 'Palette' },
  { id: '3', name: 'Porn', value: 10, category: 'unhealthy', icon: 'Flame' },
  { id: '4', name: 'Nikotīns', value: 20, category: 'unhealthy', icon: 'Cigarette' },
  { id: '5', name: 'Weed', value: 10, category: 'unhealthy', icon: 'Wind' },
  { id: '6', name: 'Fiziska tuvība/sex', value: 5, category: 'healthy', icon: 'Heart' },
  { id: '7', name: 'Saldumi', value: 20, category: 'unhealthy', icon: 'Coffee' },
  { id: '8', name: 'Video spēles', value: 5, category: 'neutral', icon: 'Gamepad2' },
  { id: '9', name: 'YouTube/Twitter', value: 15, category: 'unhealthy', icon: 'Smartphone' },
  { id: '10', name: 'Connection ar human', value: 2, category: 'healthy', icon: 'Users' },
  { id: '11', name: 'Meditācija', value: 3, category: 'healthy', icon: 'Zap' },
  { id: '12', name: 'Dziļas sarunas', value: 0.5, category: 'healthy', icon: 'MessageSquare' },
  { id: '13', name: 'Ēdiens', value: 5, category: 'neutral', icon: 'Utensils' },
  { id: '14', name: 'Ceļošana', value: 0, category: 'healthy', icon: 'Sun' },
  { id: '15', name: 'Piedzīvojumi', value: 0, category: 'healthy', icon: 'Trophy' },
  { id: '16', name: 'Mīļums no bērniem', value: 1, category: 'healthy', icon: 'Users' },
  { id: '17', name: 'Mīļums no sievas', value: 5, category: 'healthy', icon: 'Heart' },
  { id: '18', name: 'Mūzika', value: 1, category: 'healthy', icon: 'Music' },
  { id: '19', name: 'Gym & fitness', value: 10, category: 'healthy', icon: 'Dumbbell' },
];

const ICON_MAP: Record<string, React.ElementType> = {
  Cigarette, Coffee, Smartphone, Brain, Dumbbell, Zap, 
  Gamepad2, Beer, Tv, Music, Camera, HeartPulse, Users, Star, Book, Flame, Smile,
  Heart, Utensils, Wind, Moon, Sun, Code, ShoppingCart, MessageSquare,
  Dices, Trees, BookOpen, Thermometer, Apple, CheckCircle, Award,
  Search, Settings, Sparkles, Trophy, Target, Palette
};

export default function App() {
  const [sources, setSources] = useState<DopamineSource[]>(() => {
    const saved = localStorage.getItem('dopamine-sources');
    return saved ? JSON.parse(saved) : DEFAULT_SOURCES;
  });
  const [view, setView] = useState<'chart' | 'list' | 'history'>('chart');
  const [showInfo, setShowInfo] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [tilt, setTilt] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isSpinning, setIsSpinning] = useState(false);
  const [snapshots, setSnapshots] = useState<Snapshot[]>(() => {
    const saved = localStorage.getItem('dopamine-snapshots');
    return saved ? JSON.parse(saved) : [];
  });

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
    if (confirm('Vai tiešām vēlaties atiestatīt visus avotus uz noklusējuma vērtībām? Pašreizējās izmaiņas tiks dzēstas.')) {
      setSources(DEFAULT_SOURCES);
    }
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
    <div className="max-w-md mx-auto min-h-screen flex flex-col p-4 pb-24 overflow-hidden selection:bg-blue-500/30">
      {/* Dopamine Rain Background */}
      <div className="dopamine-rain">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i} 
            className="dopamine-drop"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              opacity: 0.1 + Math.random() * 0.2
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="flex justify-between items-center mb-8 relative z-50">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40">
            Dopamīna Aplis
          </h1>
          <p className="text-[10px] text-blue-400 uppercase tracking-[0.4em] font-bold">Neuro-Balance OS</p>
        </motion.div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowInfo(true)}
            className="p-2 glass-panel hover:bg-white/10 transition-all hover:scale-110 active:scale-95"
          >
            <Info size={20} className="text-white/60" />
          </button>
          <button 
            onClick={saveSnapshot}
            className="p-2 glass-panel hover:bg-white/10 transition-all hover:scale-110 active:scale-95"
            title="Saglabāt momentuzņēmumu"
          >
            <Save size={20} className="text-blue-400" />
          </button>
        </div>
      </header>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-panel p-6 max-w-sm w-full relative"
            >
              <button 
                onClick={() => setShowInfo(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white"
              >
                <X size={20} />
              </button>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Brain className="text-blue-400" />
                Kas ir Dopamīna Aplis?
              </h3>
              <div className="space-y-4 text-sm text-white/70 leading-relaxed">
                <p>
                  Dopamīns ir motivācijas un atlīdzības valūta. Tavs "aplis" vienmēr ir 100% pilns.
                </p>
                <p>
                  Ja tu izņem 20% (piemēram, atmet smēķēšanu), bet neieliec neko vietā, smadzenes jūtas tukšas un meklē ātru aizvietotāju.
                </p>
                <p>
                  Mērķis ir pakāpeniski aizstāt <span className="text-unhealthy font-bold">kaitīgos</span> avotus ar <span className="text-healthy font-bold">veselīgiem</span>, saglabājot kopējo balansu.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col items-center">
        <AnimatePresence mode="wait">
          {view === 'chart' && (
            <motion.div
              key="chart"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="flex flex-col items-center w-full"
            >
              {/* 3D Container */}
              <div className="relative w-full aspect-square max-w-[440px] mb-12 perspective-2000">
                <motion.div 
                  drag
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  dragElastic={0.1}
                  onDrag={(e, info) => {
                    setRotation(prev => prev + info.delta.x * 0.5);
                    setTilt(prev => Math.min(Math.max(prev - info.delta.y * 0.5, -45), 45));
                  }}
                  style={{ 
                    rotateY: rotation, 
                    rotateX: tilt,
                    scale: zoom
                  }}
                  className="w-full h-full relative preserve-3d cursor-grab active:cursor-grabbing"
                >
                  {/* Brain Center with Dynamic Glow */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none brain-animate">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-600/40 blur-[50px] rounded-full scale-[2.5] animate-pulse" />
                      <div className="absolute inset-0 bg-purple-600/30 blur-[80px] rounded-full scale-[3.5]" />
                      <div className="absolute inset-0 bg-white/10 blur-[20px] rounded-full scale-[1.5]" />
                      <Brain size={120} className="text-white relative z-10 filter drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]" />
                    </div>
                    <div className="mt-6 text-center transform translate-z-[50px]">
                      <motion.span 
                        key={healthScore}
                        initial={{ scale: 0.5, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        className={cn(
                          "text-8xl font-black tracking-tighter block leading-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]",
                          healthScore > 60 ? "text-healthy" : healthScore > 30 ? "text-neutral" : "text-unhealthy"
                        )}
                      >
                        {healthScore}%
                      </motion.span>
                      <p className="text-[12px] uppercase tracking-[0.5em] text-white/50 font-black mt-2">Neuro-Index</p>
                    </div>
                  </div>

                  {/* The Ring - Rotated and Styled */}
                  <div className="absolute inset-0 flex items-center justify-center transform rotateX(75deg) ring-shadow">
                    <div className="w-full h-full relative preserve-3d">
                      {/* Depth Layers */}
                      <div className="absolute inset-0 transform translate-z-[-20px] opacity-20 blur-md scale-[1.05]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={chartData} cx="50%" cy="50%" innerRadius={120} outerRadius={190} dataKey="value" stroke="none">
                              {chartData.map((entry, index) => (
                                <Cell key={`cell-shadow-deep-${index}`} fill={CATEGORY_COLORS[entry.category]} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="absolute inset-0 transform translate-z-[-10px] opacity-40 blur-sm">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={chartData} cx="50%" cy="50%" innerRadius={115} outerRadius={185} dataKey="value" stroke="none">
                              {chartData.map((entry, index) => (
                                <Cell key={`cell-shadow-${index}`} fill={CATEGORY_COLORS[entry.category]} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Main Ring */}
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <defs>
                            <filter id="glow">
                              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                              <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                              </feMerge>
                            </filter>
                          </defs>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={110}
                            outerRadius={180}
                            paddingAngle={1}
                            dataKey="value"
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth={1}
                            isAnimationActive={true}
                            animationDuration={1500}
                          >
                            {chartData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={CATEGORY_COLORS[entry.category]} 
                                fillOpacity={0.8}
                                filter="url(#glow)"
                                className="transition-all duration-500 hover:fill-opacity-100 cursor-pointer"
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>

                      {/* Floating Icons on the Ring */}
                      {chartData.map((source, index) => {
                        const Icon = ICON_MAP[source.icon] || Star;
                        // Calculate angle for the icon (center of the slice)
                        let cumulativeValue = 0;
                        for (let i = 0; i < index; i++) cumulativeValue += chartData[i].value;
                        const angle = ((cumulativeValue + source.value / 2) / totalValue) * 360 - 90;
                        const radius = 145;
                        const x = Math.cos((angle * Math.PI) / 180) * radius;
                        const y = Math.sin((angle * Math.PI) / 180) * radius;

                        return (
                          <div 
                            key={`icon-${source.id}`}
                            className="absolute left-1/2 top-1/2 pointer-events-none"
                            style={{
                              transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotateX(-75deg) rotateY(${-rotation}deg) scale(${1/zoom})`,
                              transformStyle: 'preserve-3d'
                            }}
                          >
                            <div className="flex flex-col items-center gap-1">
                              <div className={cn(
                                "p-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-lg",
                                source.category === 'healthy' ? "text-healthy" : source.category === 'neutral' ? "text-neutral" : "text-unhealthy"
                              )}>
                                <Icon size={14} />
                              </div>
                              <span className={cn(
                                "text-[9px] font-black tabular-nums px-1 rounded bg-black/60 backdrop-blur-sm border border-white/5",
                                source.category === 'healthy' ? "text-healthy" : source.category === 'neutral' ? "text-neutral" : "text-unhealthy"
                              )}>
                                {source.percentage.toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        );
                      })}

                      {/* Inner Glow Ring */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-[220px] h-[220px] rounded-full border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.05)]" />
                      </div>
                    </div>
                  </div>

                  {/* Reflection/Floor */}
                  <div className="absolute bottom-[-150px] left-1/2 -translate-x-1/2 w-[140%] h-[60px] bg-blue-500/10 blur-[120px] rounded-[100%] transform translate-z-[-300px]" />
                </motion.div>
                
                {/* Visual Hint & Zoom Control */}
                <div className="absolute -bottom-16 left-0 right-0 flex flex-col items-center gap-4">
                  <div className="flex items-center gap-4 w-full px-8">
                    <button 
                      onClick={() => setIsSpinning(!isSpinning)}
                      className={cn(
                        "p-2 rounded-full transition-all",
                        isSpinning ? "bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "bg-white/5 text-white/40"
                      )}
                    >
                      <Sparkles size={16} className={isSpinning ? "animate-spin" : ""} />
                    </button>
                    <span className="text-[10px] text-white/20 font-black">ZOOM</span>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="1.5" 
                      step="0.01" 
                      value={zoom} 
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="flex-1 accent-blue-500/50 h-1 bg-white/5 rounded-full appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="text-[10px] text-white/20 uppercase tracking-[0.6em] flex items-center gap-6 font-black">
                    <span className="animate-bounce">←</span> velc, lai rotētu <span className="animate-bounce">→</span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="w-full grid grid-cols-2 gap-3 relative z-10 px-2 mt-8">
                {chartData.slice(0, 10).map((source, idx) => {
                  const Icon = ICON_MAP[source.icon] || Star;
                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={source.id} 
                      className="glass-panel p-4 flex items-center gap-4 group hover:bg-white/10 transition-all border-white/5"
                    >
                      <div className={cn("p-2.5 rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg", 
                        source.category === 'healthy' ? "bg-healthy/20 text-healthy shadow-healthy/10" :
                        source.category === 'neutral' ? "bg-neutral/20 text-neutral shadow-neutral/10" :
                        "bg-unhealthy/20 text-unhealthy shadow-unhealthy/10"
                      )}>
                        <Icon size={18} />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-xs font-bold truncate text-white/90">{source.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${source.percentage}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className="h-full bg-current opacity-70" 
                              style={{ color: CATEGORY_COLORS[source.category] }} 
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {view === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-end mb-2">
                <h2 className="text-sm font-bold uppercase tracking-widest text-white/60">Dopamīna Avoti</h2>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={resetToDefaults}
                    className="text-[10px] text-white/20 hover:text-white/60 flex items-center gap-1 transition-colors uppercase font-black"
                  >
                    <RotateCcw size={10} />
                    Atiestatīt
                  </button>
                  <span className="text-[10px] text-white/40">{sources.length} avoti</span>
                </div>
              </div>

              <div className="space-y-3">
                {sources.map((source) => (
                  <div key={source.id} className="glass-panel p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <select 
                        value={source.icon}
                        onChange={(e) => updateSource(source.id, { icon: e.target.value })}
                        className="bg-white/5 border-none rounded p-1 text-white/60 text-xs"
                      >
                        {Object.keys(ICON_MAP).map(iconName => (
                          <option key={iconName} value={iconName}>{iconName}</option>
                        ))}
                      </select>
                      <input 
                        type="text"
                        value={source.name}
                        onChange={(e) => updateSource(source.id, { name: e.target.value })}
                        className="bg-transparent border-b border-white/10 focus:border-white/30 outline-none flex-1 text-sm font-medium"
                      />
                      <select 
                        value={source.category}
                        onChange={(e) => updateSource(source.id, { category: e.target.value as Category })}
                        className={cn(
                          "text-[10px] uppercase font-bold px-2 py-1 rounded border-none outline-none",
                          source.category === 'healthy' ? "bg-healthy/20 text-healthy" :
                          source.category === 'neutral' ? "bg-neutral/20 text-neutral" :
                          "bg-unhealthy/20 text-unhealthy"
                        )}
                      >
                        <option value="healthy">Veselīgs</option>
                        <option value="neutral">Neitrāls</option>
                        <option value="unhealthy">Kaitīgs</option>
                      </select>
                      <button 
                        onClick={() => removeSource(source.id)}
                        className="text-white/20 hover:text-unhealthy transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <input 
                        type="range"
                        min="1"
                        max="100"
                        value={source.value}
                        onChange={(e) => updateSource(source.id, { value: parseInt(e.target.value) })}
                        className="flex-1 accent-blue-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex items-center gap-2 min-w-[60px] justify-end">
                        <span className="text-xs font-mono">{source.value}</span>
                        <span className="text-[10px] text-white/40">→ {((source.value / totalValue) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={addSource}
                className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-2 text-white/40 hover:text-white hover:border-white/20 transition-all"
              >
                <Plus size={20} />
                <span className="text-sm font-medium uppercase tracking-widest">Pievienot avotu</span>
              </button>
            </motion.div>
          )}

          {view === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <h2 className="text-sm font-bold uppercase tracking-widest text-white/60 mb-4">Vēsture & Momentuzņēmumi</h2>
              
              {snapshots.length === 0 ? (
                <div className="glass-panel p-8 text-center text-white/20">
                  <History size={48} className="mx-auto mb-4 opacity-10" />
                  <p className="text-sm italic">Vēl nav saglabātu momentuzņēmumu</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {snapshots.map((snap) => (
                    <div key={snap.id} className="glass-panel p-4 flex justify-between items-center">
                      <div>
                        <div className="text-xs text-white/40 mb-1">{snap.date}</div>
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "text-xl font-bold",
                            snap.healthScore > 60 ? "text-healthy" : snap.healthScore > 30 ? "text-neutral" : "text-unhealthy"
                          )}>
                            {snap.healthScore}%
                          </span>
                          <span className="text-[10px] uppercase tracking-widest text-white/20">Veselība</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setSources(snap.sources)}
                          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-xs uppercase tracking-widest font-bold"
                        >
                          Atjaunot
                        </button>
                        <button 
                          onClick={() => deleteSnapshot(snap.id)}
                          className="p-2 text-white/20 hover:text-unhealthy transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm glass-panel p-2 flex justify-around items-center z-50">
        <button 
          onClick={() => setView('chart')}
          className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-xl transition-all flex-1",
            view === 'chart' ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
          )}
        >
          <PieIcon size={20} />
          <span className="text-[9px] uppercase font-bold tracking-widest">Aplis</span>
        </button>
        <button 
          onClick={() => setView('list')}
          className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-xl transition-all flex-1",
            view === 'list' ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
          )}
        >
          <List size={20} />
          <span className="text-[9px] uppercase font-bold tracking-widest">Avoti</span>
        </button>
        <button 
          onClick={() => setView('history')}
          className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-xl transition-all flex-1",
            view === 'history' ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
          )}
        >
          <History size={20} />
          <span className="text-[9px] uppercase font-bold tracking-widest">Vēsture</span>
        </button>
      </nav>
    </div>
  );
}
