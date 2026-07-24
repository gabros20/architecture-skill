import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { themes, MONO, SANS, type ThemeName, type Theme } from "./theme";

// Hero: "the Shape stage, on a whiteboard." What an expert sketches to explain the architecture
// skill — a PRD/idea arrives, the requirements gate captures FR+NFR and surfaces a contradiction
// before any design, the faceted router composes the smallest sufficient reference set from one
// primary job × at most one surface overlay, the agentic flagship shows the harness carrying the
// reliability with the eval set as the acceptance gate, a full pass produces durable artifacts
// (contracts + NFR budgets + ADRs + threat model), and a handoff.yaml hands the DECISION — never
// the code — down to the build skills. ~57s, loops (opens/closes on an empty stage).
//
// Pacing model (reader-first): every scene animates its content IN, then HOLDS fully still for a
// reading beat (~2.3–3.6s, scaled to how much there is to read) before the container fades OUT. The
// fade-out begins at dur − <envelope hold>, so each scene's dur = content-in-end + reading-hold +
// fade. Never let the next scene start before this one has been readable at rest.
//
// Scene map (30fps):
//   S1 request    0–210       the ask arrives — the whole architecture register
//   S2 gate       210–500     requirements before solutioning — FR + NFR + a surfaced contradiction
//   S3 route      500–820     THE centerpiece: primary job × one overlay → smallest sufficient set
//   S4 agentic    820–1170    the flagship: the harness carries reliability, the eval set is the gate
//   S5 artifacts  1170–1460   what a pass produces: contracts + budgets + ADRs + threat model
//   S6 handoff    1460–1700   hand the DECISION (handoff.yaml) down to the build skills

const EASE = Easing.bezier(0.16, 1, 0.3, 1);

function envelope(frame: number, dur: number, hold = 26) {
  const opIn = interpolate(frame, [0, hold], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const opOut = interpolate(frame, [dur - hold, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const y = interpolate(frame, [0, hold], [14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  return { opacity: Math.min(opIn, opOut), y };
}

const step = (frame: number, a: number, b: number, ease = false) =>
  interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease ? EASE : undefined });

const SceneTitle: React.FC<{ t: Theme; kicker: string; title: string; accent?: string }> = ({ t, kicker, title, accent }) => (
  <div style={{ textAlign: "center", marginBottom: 30 }}>
    <div style={{ fontFamily: SANS, textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, fontSize: 17, color: accent ?? t.accent, marginBottom: 12 }}>
      {kicker}
    </div>
    <div style={{ fontFamily: MONO, fontSize: 40, color: t.ink, letterSpacing: "-0.02em" }}>{title}</div>
  </div>
);

// ── S1 · the request arrives — the whole architecture register ─────────────────
const AskLine: React.FC<{ t: Theme; text: string; frame: number; from: number }> = ({ t, text, frame, from }) => {
  const chars = Math.floor(interpolate(frame, [from, from + 40], [0, text.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const typed = text.slice(0, chars);
  const caretOn = Math.floor(frame / 8) % 2 === 0 && chars < text.length && frame > from;
  const op = step(frame, from - 4, from + 6);
  return (
    <div style={{ opacity: op }}>
      <span style={{ color: t.accent, fontWeight: 700 }}>/architecture</span> <span>{typed}</span>
      <span style={{ opacity: caretOn ? 1 : 0, color: t.accent }}>▋</span>
    </div>
  );
};

const SceneRequest: React.FC<{ t: Theme; dur: number }> = ({ t, dur }) => {
  const frame = useCurrentFrame();
  const { opacity, y } = envelope(frame, dur, 22);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
      <div style={{ translate: `0 ${y}px`, width: 1020 }}>
        <div style={{ fontFamily: SANS, textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, fontSize: 16, color: t.muted, marginBottom: 20, textAlign: "center" }}>
          decide the shape — between product and build
        </div>
        <div style={{ background: t.codeBg, border: `1px solid ${t.line}`, borderRadius: 12, padding: "26px 32px", fontFamily: MONO, fontSize: 20, lineHeight: 2, color: t.ink }}>
          <AskLine t={t} text="design a multi-tenant refund agent — boundaries, contracts & SLOs" frame={frame} from={8} />
          <AskLine t={t} text="should this be a microservice? write the ADR" frame={frame} from={58} />
        </div>
        <div style={{ marginTop: 18, textAlign: "center", fontFamily: SANS, fontSize: 15.5, color: t.muted, opacity: step(frame, 100, 122) }}>
          system design · decomposition · contracts · data · NFR budgets · security · migration · ADR
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── S2 · the requirements gate — requirements before solutioning ───────────────
const ReqCol: React.FC<{ t: Theme; label: string; rows: string[]; appear: number; numeric?: boolean }> = ({ t, label, rows, appear, numeric }) => (
  <div style={{ opacity: appear, width: 380, background: t.panel, border: `1px solid ${t.line}`, borderRadius: 12, padding: "16px 20px" }}>
    <div style={{ fontFamily: SANS, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, fontSize: 12.5, color: numeric ? t.accent : t.muted, marginBottom: 12 }}>{label}</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      {rows.map((r) => (
        <div key={r} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: MONO, fontSize: 15, color: t.ink }}>
          <span style={{ width: 7, height: 7, borderRadius: 2, background: numeric ? t.accent : t.glyph, flex: "none" }} />
          {r}
        </div>
      ))}
    </div>
  </div>
);

const SceneGate: React.FC<{ t: Theme; dur: number }> = ({ t, dur }) => {
  const frame = useCurrentFrame();
  const { opacity, y } = envelope(frame, dur);
  const colL = step(frame, 16, 42, true);
  const colR = step(frame, 30, 56, true);
  const clash = step(frame, 96, 122, true);
  const cap = step(frame, 128, 152);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
      <div style={{ translate: `0 ${y}px`, display: "flex", flexDirection: "column", alignItems: "center", width: 1020 }}>
        <SceneTitle t={t} kicker="gate · requirements before solutioning" title="capture the requirements first" />
        <div style={{ display: "flex", gap: 24 }}>
          <ReqCol t={t} label="functional" appear={colL} rows={["resolve refund from ticket", "post credit to the ledger", "notify the customer"]} />
          <ReqCol t={t} label="non-functional · as numbers" appear={colR} numeric rows={["p95 latency < 200 ms", "availability 99.9% SLO", "cost < $0.02 / request"]} />
        </div>
        <div style={{ opacity: clash, marginTop: 22, display: "flex", alignItems: "center", gap: 12, background: t.amberBg, border: `1px solid ${t.amber}`, borderRadius: 10, padding: "12px 20px", maxWidth: 784 }}>
          <span style={{ color: t.amber, fontSize: 20, flex: "none" }}>⚠</span>
          <div style={{ fontFamily: MONO, fontSize: 15, color: t.ink, lineHeight: 1.5 }}>
            <span style={{ color: t.amber, fontWeight: 700 }}>contradiction:</span> "full network isolation" vs "real-time public webhook ingestion" — surface &amp; resolve <span style={{ color: t.amber }}>before</span> a boundary is drawn
          </div>
        </div>
        <div style={{ marginTop: 20, fontFamily: MONO, fontSize: 16.5, color: t.muted, opacity: cap, textAlign: "center" }}>
          one question at a time · mark unknowns TBD · <span style={{ color: t.accent }}>never invent a number</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── S3 · the faceted router (centerpiece) ─────────────────────────────────────
const Lane: React.FC<{ t: Theme; label: string; chips: string[]; onIndex: number; appear: number; lit: number; litColor: string }> = ({ t, label, chips, onIndex, appear, lit, litColor }) => (
  <div style={{ opacity: appear, display: "grid", gridTemplateColumns: "190px 1fr", gap: 16, alignItems: "center" }}>
    <div style={{ fontFamily: SANS, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, fontSize: 13, color: t.muted, textAlign: "right" }}>{label}</div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {chips.map((c, i) => {
        const on = i === onIndex;
        return (
          <div key={c} style={{ fontFamily: MONO, fontSize: 14.5, padding: "6px 12px", borderRadius: 8, whiteSpace: "nowrap", color: on ? t.accentInk : t.muted, background: on ? `color-mix(in srgb, ${litColor} ${30 + lit * 70}%, ${t.panel})` : t.bg, border: `1px solid ${on ? litColor : t.line}`, scale: String(on ? interpolate(lit, [0, 1], [1, 1.06]) : 1) }}>
            {c}
          </div>
        );
      })}
    </div>
  </div>
);

const SceneRoute: React.FC<{ t: Theme; dur: number }> = ({ t, dur }) => {
  const frame = useCurrentFrame();
  const { opacity, y } = envelope(frame, dur);
  const lane1 = step(frame, 14, 40, true);
  const lane2 = step(frame, 26, 52, true);
  const lit1 = step(frame, 46, 68, true);
  const lit2 = step(frame, 62, 84, true);
  const arrow = step(frame, 96, 114, true);
  const readSet = ["contracts.md", "surface-agentic.md", "handoff.md"];
  const counter = step(frame, 156, 178);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
      <div style={{ translate: `0 ${y}px`, display: "flex", flexDirection: "column", alignItems: "center", width: 1060 }}>
        <SceneTitle t={t} kicker="route · smallest sufficient set" title="the faceted router" />
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 920 }}>
          <Lane t={t} label="one primary job" chips={["system-design", "decompose", "contracts", "data", "nfr-budgets", "security", "migration", "adr"]} onIndex={2} appear={lane1} lit={lit1} litColor={t.accent} />
          <Lane t={t} label="≤ one overlay" chips={["web / saas", "mobile", "agentic", "data-intensive", "internal"]} onIndex={2} appear={lane2} lit={lit2} litColor={t.dim} />
        </div>
        <div style={{ fontFamily: MONO, fontSize: 26, color: t.accent, margin: "16px 0 12px", opacity: arrow }}>↓</div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 9, maxWidth: 900 }}>
          {readSet.map((r, i) => {
            const ap = step(frame, 116 + i * 8, 134 + i * 8, true);
            return (
              <div key={r} style={{ opacity: ap, translate: `0 ${interpolate(ap, [0, 1], [8, 0])}px`, fontFamily: MONO, fontSize: 15, padding: "7px 13px", borderRadius: 8, color: t.accent, background: t.codeBg, border: `1px solid ${t.accent}` }}>
                {r}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 18, fontFamily: MONO, fontSize: 16.5, color: t.muted, opacity: counter }}>
          <span style={{ color: t.ink, fontWeight: 600 }}>one job · one overlay</span> — read fully, <span style={{ color: t.accent }}>never all 14</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── S4 · the agentic flagship (the wedge) ─────────────────────────────────────
const Rung: React.FC<{ t: Theme; name: string; note: string; col: string; appear: number }> = ({ t, name, note, col, appear }) => (
  <div style={{ opacity: appear, translate: `0 ${interpolate(appear, [0, 1], [8, 0])}px`, display: "flex", alignItems: "baseline", gap: 12, background: t.panel, border: `1px solid ${t.line}`, borderLeft: `3px solid ${col}`, borderRadius: 8, padding: "9px 15px" }}>
    <div style={{ fontFamily: MONO, fontSize: 14.5, color: t.ink, fontWeight: 600, width: 108, flex: "none" }}>{name}</div>
    <div style={{ fontFamily: SANS, fontSize: 12.5, color: t.muted, lineHeight: 1.35 }}>{note}</div>
  </div>
);

const SceneAgentic: React.FC<{ t: Theme; dur: number }> = ({ t, dur }) => {
  const frame = useCurrentFrame();
  const { opacity, y } = envelope(frame, dur);
  const cfg: [string, string, string?][] = [
    ["topology:", " workflow", " # workflow | agent | multi-agent"],
    ["context:", " finite budget", " # compaction + JIT, not a dump"],
    ["memory:", " episodic · semantic · procedural"],
    ["retrieval:", " RAG + reranker"],
    ["eval_gate:", " 40-case set", " # blocks release on regression"],
    ["security:", " injection · tool-scope · exfil"],
  ];
  const l1 = step(frame, 150, 172, true);
  const l2 = step(frame, 162, 184, true);
  const l3 = step(frame, 174, 196, true);
  const cap = step(frame, 214, 238);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
      <div style={{ translate: `0 ${y}px`, display: "flex", flexDirection: "column", alignItems: "center", width: 1060 }}>
        <SceneTitle t={t} kicker="the flagship · agentic / LLM" title="the harness carries the reliability" accent={t.accent} />
        <div style={{ display: "flex", alignItems: "flex-start", gap: 30 }}>
          <div style={{ width: 566 }}>
            <div style={{ fontFamily: SANS, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 600, fontSize: 13, color: t.accent, marginBottom: 10 }}>an architecture decision, not a prompt tweak</div>
            <div style={{ background: t.codeBg, border: `1px solid ${t.line}`, borderRadius: 12, padding: "18px 22px", fontFamily: MONO, fontSize: 15, lineHeight: 1.95 }}>
              {cfg.map(([k, v, c], i) => {
                const op = step(frame, 14 + i * 15, 34 + i * 15);
                return (
                  <div key={k} style={{ opacity: op, whiteSpace: "nowrap" }}>
                    <span style={{ color: t.dim }}>{k}</span><span style={{ color: t.ink }}>{v}</span>
                    {c && <span style={{ color: t.muted }}>{c}</span>}
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ width: 444, display: "flex", flexDirection: "column", gap: 9 }}>
            <div style={{ fontFamily: SANS, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, fontSize: 12.5, color: t.muted, opacity: l1 }}>escalate topology only when it pays</div>
            <Rung t={t} name="workflow" note="predefined steps — the default; cheapest, most reliable" col={t.good} appear={l1} />
            <Rung t={t} name="single agent" note="dynamic tool loop — when the path can't be pre-drawn" col={t.amber} appear={l2} />
            <Rung t={t} name="multi-agent" note="only when parallelizable & value clears the 4×/15× token cost" col={t.bad} appear={l3} />
          </div>
        </div>
        <div style={{ marginTop: 24, fontFamily: MONO, fontSize: 16.5, color: t.muted, opacity: cap, textAlign: "center" }}>
          the eval set <span style={{ color: t.accent }}>is</span> the acceptance gate — re-run on every model or prompt change
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── S5 · what a pass produces — durable artifacts ─────────────────────────────
const Artifact: React.FC<{ t: Theme; file: string; label: string; appear: number }> = ({ t, file, label, appear }) => (
  <div style={{ opacity: appear, translate: `0 ${interpolate(appear, [0, 1], [12, 0])}px`, width: 300, background: t.panel, border: `1px solid ${t.line}`, borderTop: `3px solid ${t.accent}`, borderRadius: 10, padding: "14px 18px" }}>
    <div style={{ fontFamily: MONO, fontSize: 15, color: t.ink, fontWeight: 600 }}>{file}</div>
    <div style={{ fontFamily: SANS, fontSize: 13, color: t.muted, marginTop: 5, lineHeight: 1.4 }}>{label}</div>
  </div>
);

const SceneArtifacts: React.FC<{ t: Theme; dur: number }> = ({ t, dur }) => {
  const frame = useCurrentFrame();
  const { opacity, y } = envelope(frame, dur);
  const arts: [string, string][] = [
    ["solution-architecture-doc", "arc42-shaped — decisions & contracts, not code"],
    ["api / event contracts", "OpenAPI + AsyncAPI — FE & BE build in parallel"],
    ["nfr-budget-worksheet", "perf · SLO · scale · cost, as numbers"],
    ["adrs", "the durable decision log — cite, don't re-litigate"],
    ["threat-model-register", "STRIDE table + self-audit count"],
  ];
  const cap = step(frame, 168, 192);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
      <div style={{ translate: `0 ${y}px`, display: "flex", flexDirection: "column", alignItems: "center", width: 1020 }}>
        <SceneTitle t={t} kicker="produces · decisions made durable" title="contracts, budgets, ADRs & a threat model" />
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, maxWidth: 960 }}>
          {arts.map(([f, l], i) => {
            const ap = step(frame, 16 + i * 20, 42 + i * 20, true);
            return <Artifact key={f} t={t} file={f} label={l} appear={ap} />;
          })}
        </div>
        <div style={{ marginTop: 26, fontFamily: MONO, fontSize: 16.5, color: t.muted, opacity: cap, textAlign: "center" }}>
          each records the decision, the trade-off, and the <span style={{ color: t.accent }}>reversibility lens</span> — survives a framework change
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── S6 · hand off the DECISION (family arc closes) ────────────────────────────
const NextSkill: React.FC<{ t: Theme; name: string; note: string; appear: number }> = ({ t, name, note, appear }) => (
  <div style={{ opacity: appear, translate: `0 ${interpolate(appear, [0, 1], [12, 0])}px`, width: 250, background: t.panel, border: `1px solid ${t.line}`, borderRadius: 11, padding: "14px 18px" }}>
    <div style={{ fontFamily: MONO, fontSize: 17, color: t.ink }}><span style={{ color: t.accent, fontWeight: 700 }}>/</span>{name}</div>
    <div style={{ fontFamily: SANS, fontSize: 12.5, color: t.muted, marginTop: 5, lineHeight: 1.4 }}>{note}</div>
  </div>
);

const SceneHandoff: React.FC<{ t: Theme; dur: number }> = ({ t, dur }) => {
  const frame = useCurrentFrame();
  const { opacity, y } = envelope(frame, dur, 20);
  const yamlLines: [string, string][] = [
    ["skill:", " architecture"],
    ["objective:", " shape refund-agent"],
    ["artifacts:", " contracts, budgets, adrs"],
    ["risks:", " [R-01, R-04]  (pointers)"],
    ["next:", " frontend · backend · data · ai"],
  ];
  const arrow = step(frame, 60, 82, true);
  const c1 = step(frame, 70, 94, true);
  const c2 = step(frame, 82, 106, true);
  const cap = step(frame, 108, 132);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
      <div style={{ translate: `0 ${y}px`, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <SceneTitle t={t} kicker="family · product → architecture → build" title="hand off the decision, not the code" accent={t.dim} />
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <div style={{ width: 440 }}>
            <div style={{ fontFamily: SANS, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 600, fontSize: 14, color: t.accent, marginBottom: 12 }}>handoff.yaml</div>
            <div style={{ background: t.codeBg, border: `1px solid ${t.line}`, borderRadius: 12, padding: "18px 22px", fontFamily: MONO, fontSize: 17, lineHeight: 1.8 }}>
              {yamlLines.map(([k, v], i) => {
                const op = step(frame, 12 + i * 9, 28 + i * 9);
                return (
                  <div key={k} style={{ opacity: op, whiteSpace: "nowrap" }}>
                    <span style={{ color: t.dim }}>{k}</span><span style={{ color: t.ink }}>{v}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 40, color: t.accent, opacity: arrow }}>→</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <NextSkill t={t} name="frontend · backend" note="build behind the contract, in parallel" appear={c1} />
            <NextSkill t={t} name="data · ai · quality" note="stores, agents, threat-model verify" appear={c2} />
          </div>
        </div>
        <div style={{ marginTop: 26, fontFamily: MONO, fontSize: 16.5, color: t.muted, opacity: cap, textAlign: "center" }}>
          own the <span style={{ color: t.accent }}>shape</span> · recommend siblings, never auto-invoke
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── persistent chrome + master timeline ──────────────────────────────────────
const BOUNDS = [210, 500, 820, 1170, 1460, 1700];
const LABELS = ["request", "gate", "route", "agentic", "artifacts", "handoff"];

const PhaseBar: React.FC<{ t: Theme; frame: number }> = ({ t, frame }) => {
  const active = Math.max(0, BOUNDS.findIndex((b) => frame < b));
  return (
    <div style={{ position: "absolute", bottom: 34, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 15 }}>
      {LABELS.map((l, i) => (
        <div key={l} style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: i === active ? t.accent : t.line, scale: String(i === active ? 1.3 : 1) }} />
          <div style={{ fontFamily: SANS, textTransform: "uppercase", letterSpacing: "0.09em", fontSize: 12, fontWeight: 600, color: i === active ? t.ink : t.muted, opacity: i === active ? 1 : 0.55 }}>{l}</div>
        </div>
      ))}
    </div>
  );
};

export const HeroAnimation: React.FC<{ theme: ThemeName }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = themes[theme];

  const intro = step(frame, 0, 14);
  const outro = interpolate(frame, [durationInFrames - 16, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const master = Math.min(intro, outro);
  const glow = interpolate(Math.sin(frame / 90), [-1, 1], [0.5, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: t.bg, fontFamily: SANS }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 82% 16%, color-mix(in srgb, ${t.accent} 13%, transparent), transparent 44%), radial-gradient(circle at 8% 92%, color-mix(in srgb, ${t.accent} 9%, transparent), transparent 48%)`, opacity: glow }} />
      <AbsoluteFill style={{ opacity: master }}>
        <Sequence durationInFrames={210}><SceneRequest t={t} dur={210} /></Sequence>
        <Sequence from={210} durationInFrames={290}><SceneGate t={t} dur={290} /></Sequence>
        <Sequence from={500} durationInFrames={320}><SceneRoute t={t} dur={320} /></Sequence>
        <Sequence from={820} durationInFrames={350}><SceneAgentic t={t} dur={350} /></Sequence>
        <Sequence from={1170} durationInFrames={290}><SceneArtifacts t={t} dur={290} /></Sequence>
        <Sequence from={1460} durationInFrames={240}><SceneHandoff t={t} dur={240} /></Sequence>
        <PhaseBar t={t} frame={frame} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
