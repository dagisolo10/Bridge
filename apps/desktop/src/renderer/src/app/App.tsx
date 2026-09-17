import { useSocketIo } from "@package/react/contexts";
import { useGetDevice, useRegisterDevice } from "@package/react/hooks";
import { cn } from "cn";
import { Activity, AlertTriangle, CheckCircle2, CircuitBoard, Cpu, Gauge, MonitorSmartphone, PlusCircle, Radio, RefreshCw, ShieldCheck, Terminal, WifiOff, Zap } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";

const HUD_STYLES = `
@keyframes br-spin { to { transform: rotate(360deg); } }
@keyframes br-spin-rev { to { transform: rotate(-360deg); } }
@keyframes br-float { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(0,-28px,0); } }
@keyframes br-float-b { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(0,26px,0) scale(1.08); } }
@keyframes br-ping { 0% { transform: scale(0.82); opacity: 0.65; } 100% { transform: scale(1.9); opacity: 0; } }
@keyframes br-grid { from { background-position: 0 0; } to { background-position: 0 48px; } }
@keyframes br-shimmer { 100% { transform: translateX(240%); } }
@keyframes br-blink { 0%,100% { opacity: 1; } 50% { opacity: 0.15; } }
@keyframes br-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
.br-grid {
  background-image: linear-gradient(to right, rgba(148,163,184,0.09) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(148,163,184,0.09) 1px, transparent 1px);
  background-size: 48px 48px;
  -webkit-mask-image: radial-gradient(ellipse at 50% 42%, #000 26%, transparent 76%);
  mask-image: radial-gradient(ellipse at 50% 42%, #000 26%, transparent 76%);
  animation: br-grid 7s linear infinite;
}
.br-scanlines { background: repeating-linear-gradient(to bottom, rgba(255,255,255,0.035) 0 1px, transparent 1px 3px); }
.br-rise { animation: br-rise 0.5s cubic-bezier(0.22,1,0.36,1) both; }
`;

function useClock() {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const id = window.setInterval(() => setNow(new Date()), 1000);
        return () => window.clearInterval(id);
    }, []);

    return now.toLocaleTimeString([], { hour12: false });
}

function useThroughput(active: boolean) {
    const [bars, setBars] = useState<number[]>(() => Array.from({ length: 34 }, () => 0.14));

    useEffect(() => {
        const id = window.setInterval(() => {
            setBars((prev) => {
                const base = active ? 0.32 : 0.07;
                const amplitude = active ? 0.66 : 0.09;
                return [...prev.slice(1), Math.min(1, base + Math.random() * amplitude)];
            });
        }, 560);
        return () => window.clearInterval(id);
    }, [active]);

    return bars;
}

function SignalBars({ active }: { active: boolean }) {
    return (
        <div className="flex items-end gap-1" aria-hidden>
            {[0, 1, 2, 3, 4].map((i) => (
                <span
                    key={i}
                    className={cn("w-1 rounded-full transition-colors", active ? "bg-accent" : "bg-slate-700")}
                    style={{
                        height: active ? `${8 + i * 4}px` : "5px",
                        animation: active ? `br-blink ${0.9 + i * 0.18}s ease-in-out ${i * 0.12}s infinite` : undefined,
                    }}
                />
            ))}
        </div>
    );
}

function Stat({ icon: Icon, label, value, tone = "default" }: { icon: typeof Cpu; label: string; value: string; tone?: "default" | "accent" }) {
    return (
        <div className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/2 px-3.5 py-3 transition-colors hover:border-white/10 hover:bg-white/4">
            <div
                className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
                    tone === "accent"
                        ? "text-accent border-[color-mix(in_srgb,var(--accent)_35%,transparent)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)]"
                        : "border-white/10 bg-white/5 text-slate-300",
                )}
            >
                <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
                <p className="font-mono text-[10px] tracking-[0.22em] text-slate-500 uppercase">{label}</p>
                <p className="truncate text-sm font-medium text-slate-100">{value}</p>
            </div>
        </div>
    );
}

export default function App() {
    const { connected } = useSocketIo();
    const clock = useClock();
    const bars = useThroughput(connected);

    const [callSign, setCallSign] = useState("Desktop PC");
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const { data: device, isLoading: isDeviceLoading, isError: isDeviceError, error: deviceError, refetch } = useGetDevice();

    const registerMutation = useRegisterDevice({
        onSuccess: () => setFeedback({ type: "success", message: "Node registered — handshake complete." }),
        onError: (error) => setFeedback({ type: "error", message: error.message || "Registration failed. Signal lost." }),
    });

    useEffect(() => {
        if (!feedback) return;
        const id = window.setTimeout(() => setFeedback(null), 4200);
        return () => window.clearTimeout(id);
    }, [feedback]);

    const accent = connected ? "#34d399" : "#fb7185";
    const accentSoft = connected ? "rgba(52,211,153,0.45)" : "rgba(251,113,133,0.45)";
    const vars = { "--accent": accent, "--accent-soft": accentSoft } as CSSProperties;

    return (
        <div className="relative min-h-screen scrollbar-none scrollbar-thin overflow-hidden bg-[#05060a] text-slate-100 antialiased" style={vars}>
            <style>{HUD_STYLES}</style>

            {/* ambient background */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(56,189,248,0.16),transparent_52%),radial-gradient(circle_at_84%_92%,rgba(139,92,246,0.16),transparent_52%)]" />
            <div className="br-grid pointer-events-none absolute inset-0" />
            <div className="pointer-events-none absolute -top-32 -left-24 h-96 w-96 animate-[br-float_11s_ease-in-out_infinite] rounded-full bg-cyan-500/15 blur-[120px]" />
            <div className="pointer-events-none absolute -right-24 -bottom-32 h-104 w-104 animate-[br-float-b_13s_ease-in-out_infinite] rounded-full bg-violet-600/15 blur-[130px]" />
            <div className="br-scanlines pointer-events-none absolute inset-0 animate-[br-grid_1.4s_linear_infinite] opacity-40" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.72)_100%)]" />

            <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6 sm:px-10">
                {/* header */}
                <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-5">
                    <div className="flex items-center gap-3">
                        <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300 shadow-[0_0_28px_-6px_rgba(34,211,238,0.7)]">
                            <CircuitBoard className="h-5 w-5" />
                            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 animate-[br-blink_2.4s_ease-in-out_infinite] rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
                        </div>
                        <div>
                            <h1 className="font-mono text-sm font-semibold tracking-[0.32em] text-slate-100 uppercase">Bridge</h1>
                            <p className="font-mono text-[10px] tracking-[0.28em] text-slate-500 uppercase">Node Console · v1.0</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden items-center gap-2 rounded-lg border border-white/5 bg-white/2 px-3 py-1.5 sm:flex">
                            <Terminal className="h-3.5 w-3.5 text-slate-500" />
                            <span className="font-mono text-xs tracking-widest text-slate-400 tabular-nums">{clock}</span>
                        </div>

                        <div
                            className={cn(
                                "relative flex items-center gap-2 overflow-hidden rounded-full border px-3.5 py-2",
                                connected ? "border-emerald-400/30 bg-emerald-400/10" : "border-rose-400/30 bg-rose-400/10",
                            )}
                        >
                            <span
                                className={cn("absolute inset-0 rounded-full", connected ? "bg-emerald-400/10" : "bg-rose-400/10")}
                                style={{ animation: "br-ping 2.2s cubic-bezier(0,0,0.2,1) infinite" }}
                            />
                            {connected ? <Radio className="relative h-3.5 w-3.5 text-emerald-300" /> : <WifiOff className="relative h-3.5 w-3.5 text-rose-300" />}
                            <span className={cn("relative font-mono text-[11px] font-semibold tracking-[0.22em] uppercase", connected ? "text-emerald-300" : "text-rose-300")}>
                                {connected ? "Online" : "Offline"}
                            </span>
                        </div>
                    </div>
                </header>

                {/* console */}
                <main className="grid flex-1 gap-6 py-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center">
                    {/* left: live core */}
                    <section className="br-rise relative flex flex-col items-center justify-center rounded-3xl border border-white/5 bg-white/2 px-6 py-10 backdrop-blur-xl">
                        <div className="relative flex h-60 w-60 items-center justify-center sm:h-68 sm:w-68">
                            <div className="absolute inset-0 rounded-full blur-2xl" style={{ background: `radial-gradient(circle, ${accentSoft}, transparent 68%)` }} />
                            <div className="absolute inset-0 animate-[br-spin_26s_linear_infinite] rounded-full border border-white/10">
                                <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full" style={{ background: accent, boxShadow: `0 0 12px ${accent}` }} />
                            </div>
                            <div className="absolute inset-4 animate-[br-spin-rev_34s_linear_infinite] rounded-full border border-dashed border-white/10" />
                            <div
                                className="absolute inset-2 rounded-full"
                                style={{
                                    background: `conic-gradient(from 0deg, transparent 0deg, transparent 300deg, ${accentSoft} 355deg, transparent 360deg)`,
                                    animation: "br-spin 4.6s linear infinite",
                                }}
                            />
                            <div className="absolute inset-0 rounded-full border" style={{ borderColor: accentSoft, animation: "br-ping 2.6s cubic-bezier(0,0,0.2,1) infinite" }} />
                            <div className="absolute inset-0 rounded-full border" style={{ borderColor: accentSoft, animation: "br-ping 2.6s cubic-bezier(0,0,0.2,1) 1.3s infinite" }} />

                            <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-linear-to-b from-white/8 to-transparent backdrop-blur-md sm:h-32 sm:w-32">
                                {connected ? <Activity className="h-9 w-9" style={{ color: accent }} /> : <WifiOff className="h-9 w-9" style={{ color: accent }} />}
                            </div>
                        </div>

                        <div className="mt-7 text-center">
                            <p className="font-mono text-[10px] tracking-[0.36em] text-slate-500 uppercase">Gateway Link</p>
                            <p className="mt-1.5 text-2xl font-semibold tracking-tight" style={{ color: accent }}>
                                {connected ? "Signal Acquired" : "Searching…"}
                            </p>
                        </div>

                        <div className="mt-6 flex items-center gap-3 rounded-full border border-white/5 bg-white/2 px-4 py-2">
                            <SignalBars active={connected} />
                            <span className="font-mono text-[10px] tracking-[0.24em] text-slate-500 uppercase">{connected ? "UL 42.8 kb/s" : "no carrier"}</span>
                        </div>
                    </section>

                    {/* right: telemetry + controls */}
                    <section className="br-rise flex flex-col gap-5" style={{ animationDelay: "80ms" }}>
                        <div className="rounded-3xl border border-white/5 bg-white/2 p-6 backdrop-blur-xl">
                            <div className="mb-5 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <Zap className="h-4 w-4 text-cyan-300" />
                                    <h2 className="font-mono text-xs font-semibold tracking-[0.28em] text-slate-300 uppercase">Node Telemetry</h2>
                                </div>
                                <span
                                    className={cn(
                                        "rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-widest uppercase",
                                        device ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" : "border-slate-600/40 bg-white/5 text-slate-400",
                                    )}
                                >
                                    {device ? "synced" : "idle"}
                                </span>
                            </div>

                            {isDeviceLoading ? (
                                <div className="grid gap-2.5">
                                    {[0, 1, 2].map((i) => (
                                        <div key={i} className="relative h-15 overflow-hidden rounded-xl border border-white/5 bg-white/3">
                                            <span
                                                className="absolute inset-y-0 -left-1/3 w-1/3 animate-[br-shimmer_1.6s_ease-in-out_infinite] bg-linear-to-r from-transparent via-white/[0.07] to-transparent"
                                                style={{ animationDelay: `${i * 0.18}s` }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : isDeviceError ? (
                                <div className="rounded-2xl border border-rose-400/25 bg-rose-500/10 p-5">
                                    <div className="mb-2 flex items-center gap-2">
                                        <AlertTriangle className="h-4.5 w-4.5 text-rose-400" />
                                        <p className="font-mono text-xs tracking-[0.2em] text-rose-300 uppercase">Link Failure</p>
                                    </div>
                                    <p className="text-sm text-rose-200/80">{deviceError?.message || "Unable to reach the local server or read node state."}</p>
                                    <button
                                        type="button"
                                        onClick={() => void refetch()}
                                        className="mt-3 rounded-lg border border-rose-400/30 bg-rose-500/15 px-3 py-1.5 font-mono text-[11px] tracking-widest text-rose-200 uppercase transition hover:bg-rose-500/25"
                                    >
                                        Retry Link
                                    </button>
                                </div>
                            ) : device ? (
                                <div className="grid gap-2.5">
                                    <Stat icon={Cpu} label="Node" value={device.name} tone="accent" />
                                    <Stat icon={MonitorSmartphone} label="Class" value={device.type} />
                                    <div className="grid grid-cols-2 gap-2.5">
                                        <Stat icon={ShieldCheck} label="State" value="Active" tone="accent" />
                                        <Stat icon={Gauge} label="Node ID" value={device.id.slice(0, 12)} />
                                    </div>
                                    <Stat icon={RefreshCw} label="Registered" value={new Date(device.createdAt).toLocaleString()} />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/1.5 px-6 py-10 text-center">
                                    <div className="relative mb-4 flex h-16 w-16 items-center justify-center">
                                        <span className="absolute inset-0 animate-[br-spin_12s_linear_infinite] rounded-full border border-dashed border-slate-500/40" />
                                        <span className="absolute inset-2 animate-[br-spin-rev_9s_linear_infinite] rounded-full border border-slate-600/30" />
                                        <WifiOff className="relative h-5 w-5 text-slate-400" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-200">No node bound</p>
                                    <p className="mt-1 text-xs text-slate-500">Broadcast a registration to pair this machine with the Bridge.</p>
                                </div>
                            )}

                            {/* live throughput */}
                            <div className="mt-5 rounded-2xl border border-white/5 bg-black/25 p-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="font-mono text-[10px] tracking-[0.24em] text-slate-500 uppercase">Throughput</span>
                                    <span className="font-mono text-[10px] tracking-[0.24em] text-slate-500 uppercase">{connected ? "streaming" : "standby"}</span>
                                </div>
                                <div className="flex h-12 items-end gap-0.75">
                                    {bars.map((v, i) => (
                                        <span
                                            key={i}
                                            className="flex-1 rounded-sm transition-[height] duration-500 ease-out"
                                            style={{ height: `${Math.round(v * 100)}%`, background: connected ? `linear-gradient(to top, ${accent}, rgba(56,189,248,0.5))` : "rgba(100,116,139,0.35)" }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* controls */}
                        <div className="rounded-3xl border border-white/5 bg-white/2 p-6 backdrop-blur-xl">
                            <label htmlFor="call-sign" className="mb-2 block font-mono text-[10px] tracking-[0.28em] text-slate-500 uppercase">
                                Call Sign
                            </label>
                            <input
                                id="call-sign"
                                value={callSign}
                                onChange={(e) => setCallSign(e.target.value)}
                                spellCheck={false}
                                className="mb-4 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm text-slate-100 transition outline-none placeholder:text-slate-600 focus:border-cyan-400/50 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.12)]"
                                placeholder="enter node call sign"
                            />

                            <div className="grid gap-3 sm:grid-cols-2">
                                <button
                                    type="button"
                                    onClick={() => registerMutation.mutate({ name: callSign.trim() || "Desktop PC", type: "Computer" })}
                                    disabled={registerMutation.isPending}
                                    className="group relative flex h-12 items-center justify-center gap-2 overflow-hidden rounded-xl border border-cyan-400/30 bg-linear-to-r from-cyan-500/25 to-violet-500/25 font-semibold text-white transition hover:from-cyan-500/40 hover:to-violet-500/40 hover:shadow-[0_0_36px_-8px_rgba(34,211,238,0.8)] disabled:opacity-60"
                                >
                                    {registerMutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
                                    <span className="font-mono text-xs tracking-[0.22em] uppercase">{registerMutation.isPending ? "Broadcasting…" : "Register Node"}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => void refetch()}
                                    disabled={isDeviceLoading}
                                    className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/3 font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/[0.07] disabled:opacity-60"
                                >
                                    <RefreshCw className={cn("h-4 w-4", isDeviceLoading && "animate-spin")} />
                                    <span className="font-mono text-xs tracking-[0.22em] uppercase">Resync</span>
                                </button>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="flex items-center justify-between border-t border-white/5 pt-4 font-mono text-[10px] tracking-[0.22em] text-slate-600 uppercase">
                    <span>Uplink · 192.168.8.101:3000</span>
                    <span className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
                        {connected ? "secure channel" : "no channel"}
                    </span>
                </footer>
            </div>

            {/* toast */}
            {feedback && (
                <div
                    className={cn(
                        "br-rise fixed top-6 right-6 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 backdrop-blur-xl",
                        feedback.type === "success" ? "border-emerald-400/30 bg-emerald-500/15" : "border-rose-400/30 bg-rose-500/15",
                    )}
                >
                    {feedback.type === "success" ? <CheckCircle2 className="h-4.5 w-4.5 text-emerald-300" /> : <AlertTriangle className="h-4.5 w-4.5 text-rose-300" />}
                    <span className={cn("font-mono text-xs tracking-wide", feedback.type === "success" ? "text-emerald-200" : "text-rose-200")}>{feedback.message}</span>
                </div>
            )}
        </div>
    );
}
