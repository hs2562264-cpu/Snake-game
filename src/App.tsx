/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Update high score when score changes
  React.useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore]);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#050505] text-white font-sans border-4 border-[#111] relative">
      {/* Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_80%_20%,rgba(255,0,255,0.05)_0%,transparent_40%),radial-gradient(circle_at_20%_80%,rgba(0,242,255,0.05)_0%,transparent_40%)]" />

      {/* Top Nav */}
      <header className="h-[60px] px-10 flex justify-between items-center border-b border-white/10 bg-black/50 z-10 shrink-0">
        <div className="font-mono font-bold tracking-[2px] text-[#00f2ff] uppercase">
          CYBER_SYNC // v2.0.4
        </div>
        <div className="flex gap-10">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase text-white/40 tracking-[1px]">Score</span>
            <span className="font-mono text-[18px] text-[#39ff14]">
              {score.toString().padStart(5, '0')}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase text-white/40 tracking-[1px]">High Score</span>
            <span className="font-mono text-[18px] text-[#39ff14]">
              {highScore.toString().padStart(5, '0')}
            </span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 grid grid-cols-[280px_1fr_280px] gap-5 p-5 z-10 min-h-0">
        {/* Left Panel */}
        <aside className="bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-2xl p-5 flex flex-col overflow-y-auto">
          <h3 className="text-[12px] uppercase text-white/50 mb-[15px] tracking-[2px]">System Audio</h3>
          <ul className="list-none flex flex-col gap-2">
            <li className="p-3 rounded-lg border border-[#00f2ff]/30 bg-[#00f2ff]/10 flex items-center gap-3 cursor-pointer">
              <span className="font-mono text-[11px] text-[#00f2ff]">01</span>
              <div>
                <h4 className="text-[14px] mb-[2px]">Neon Horizon</h4>
                <p className="text-[11px] opacity-50">CyberSynth AI</p>
              </div>
            </li>
            <li className="p-3 rounded-lg border border-transparent flex items-center gap-3 cursor-pointer">
              <span className="font-mono text-[11px] text-[#00f2ff]">02</span>
              <div>
                <h4 className="text-[14px] mb-[2px]">Digital Dreams</h4>
                <p className="text-[11px] opacity-50">Neural Beats</p>
              </div>
            </li>
            <li className="p-3 rounded-lg border border-transparent flex items-center gap-3 cursor-pointer">
              <span className="font-mono text-[11px] text-[#00f2ff]">03</span>
              <div>
                <h4 className="text-[14px] mb-[2px]">Quantum Groove</h4>
                <p className="text-[11px] opacity-50">Algorithmic Audio</p>
              </div>
            </li>
          </ul>
        </aside>

        {/* Game Container */}
        <section className="col-start-2 flex items-center justify-center bg-black/40 border-2 border-[#222] relative overflow-hidden rounded-xl">
          <SnakeGame onScoreChange={setScore} />
        </section>

        {/* Right Panel */}
        <aside className="bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-2xl p-5 flex flex-col">
          <h3 className="text-[12px] uppercase text-white/50 mb-[15px] tracking-[2px]">Command Key</h3>
          <div className="text-[12px] leading-[1.6] text-white/60">
            <p><b className="text-[#00f2ff]">WASD</b> or <b className="text-[#00f2ff]">ARROWS</b> to navigate the data stream.</p>
            <br />
            <p>Collect <b className="text-[#00f2ff]">NEURAL NODES</b> to expand your system capacity.</p>
            <br />
            <p>Avoid <b className="text-[#00f2ff]">TERMINAL BORDERS</b> and self-intersection to maintain uptime.</p>
            <br />
            <p>Press <b className="text-[#00f2ff]">SPACE</b> to pause.</p>
          </div>
        </aside>
      </main>

      {/* Player Bar */}
      <MusicPlayer />
    </div>
  );
}
