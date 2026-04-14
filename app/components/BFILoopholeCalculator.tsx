'use client';

import React, { useState, useMemo } from 'react';
import { sendGAEvent } from '@next/third-parties/google';

const PASS_MARK = 18;
const CREATIVE_MAX = 22;
const TECHNICAL_MAX = 13;

const CATEGORIES = [
  {
    id: 'AB',
    name: 'A & B: Story, Language & Culture',
    type: 'Creative',
    tasks: [
      { label: 'English or EEA language dialogue', pts: 6 },
      { label: 'Set in UK or EEA', pts: 4 },
      { label: 'Lead characters British/EEA', pts: 4 },
      { label: 'Based on British/EEA material', pts: 4 },
      { label: 'British creativity/heritage/diversity', pts: 4 },
    ],
  },
  {
    id: 'CD',
    name: 'C & D: Infrastructure & Personnel',
    type: 'Technical',
    tasks: [
      { label: '50% Principal Photography in UK', pts: 2 },
      { label: '50% of VFX in UK', pts: 2 },
      { label: 'UK Music/Audio/Post-Production', pts: 1 },
      { label: 'Director (British/EEA)', pts: 1 },
      { label: 'Scriptwriter (British/EEA)', pts: 1 },
      { label: 'Producer (British/EEA)', pts: 1 },
      { label: 'Composer (British/EEA)', pts: 1 },
      { label: 'Lead Actors (British/EEA)', pts: 1 },
      { label: 'Majority of Cast (British/EEA)', pts: 1 },
      { label: 'Key Staff/HODs (British/EEA)', pts: 1 },
      { label: '50% of Crew (British/EEA)', pts: 1 },
    ],
  },
];

interface PresetData {
  budget: number;
  ukSpend: number;
  boxOffice: number;
  bypassesGoldenRule: boolean;
  letterboxd: string;
  poster: string;
  backdrop: string;
  desc: string;
  points: string[];
}

const PRESETS: Record<string, PresetData> = {
  'Barbie (2023)': {
    budget: 145,
    ukSpend: 80,
    boxOffice: 1441,
    bypassesGoldenRule: true,
    letterboxd: 'https://letterboxd.com/film/barbie/',
    poster:
      'https://image.tmdb.org/t/p/original/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
    backdrop:
      'https://image.tmdb.org/t/p/original/iGdHtZBjpBkmSAgkvUeniIfI8ME.jpg',
    desc: 'Qualifies with zero UK story points — Barbieland is not the EEA. A British crew, British HODs (Jacqueline Durran, Sarah Greenwood), and eight stages at Leavesden Studios get it over the line. Section B for the diverse ensemble cast.',
    points: [
      'English or EEA language dialogue',
      'British creativity/heritage/diversity',
      '50% Principal Photography in UK',
      '50% of VFX in UK',
      'UK Music/Audio/Post-Production',
      'Producer (British/EEA)',
      'Majority of Cast (British/EEA)',
      'Key Staff/HODs (British/EEA)',
      '50% of Crew (British/EEA)',
    ],
  },
  'Gravity (2013)': {
    budget: 100,
    ukSpend: 80,
    boxOffice: 723,
    bypassesGoldenRule: true,
    letterboxd: 'https://letterboxd.com/film/gravity-2013/',
    poster:
      'https://image.tmdb.org/t/p/original/kZ2nZw8D681aphje8NJi8EfbL1U.jpg',
    backdrop:
      'https://image.tmdb.org/t/p/original/jP4Z9Jy1NhfpDRjoFNmvlvSlzMd.jpg',
    desc: 'Won Outstanding British Film at the BAFTAs — with a Mexican director and two American leads. Cuarón is not EEA; Ryan Stone and Kowalski are explicitly American astronauts. Qualifies entirely on UK craft: made at Shepperton, VFX by Framestore.',
    points: [
      'English or EEA language dialogue',
      'British creativity/heritage/diversity',
      '50% Principal Photography in UK',
      '50% of VFX in UK',
      'UK Music/Audio/Post-Production',
      'Producer (British/EEA)',
      'Composer (British/EEA)',
      'Key Staff/HODs (British/EEA)',
      '50% of Crew (British/EEA)',
    ],
  },
  'Avengers: Age of Ultron (2015)': {
    budget: 365,
    ukSpend: 85,
    boxOffice: 1402,
    bypassesGoldenRule: true,
    letterboxd: 'https://letterboxd.com/film/avengers-age-of-ultron/',
    poster:
      'https://image.tmdb.org/t/p/original/4ssDuvEDkSArWEdyBl2X5EHvYKU.jpg',
    backdrop:
      'https://image.tmdb.org/t/p/original/eFmyHmeZX433dXtXFHeYdIOcEwz.jpg',
    desc: "The high-water mark. Principal photography ran five months at Shepperton Studios. Disney's own filings confirmed $79m in tax relief under the old Film Tax Relief scheme at 25% gross. Comfortably qualifies on physical production presence alone.",
    points: [
      'English or EEA language dialogue',
      'British creativity/heritage/diversity',
      '50% Principal Photography in UK',
      '50% of VFX in UK',
      'UK Music/Audio/Post-Production',
      'Majority of Cast (British/EEA)',
      'Key Staff/HODs (British/EEA)',
      '50% of Crew (British/EEA)',
    ],
  },
  'Aftersun (2022)': {
    budget: 2.5,
    ukSpend: 35,
    boxOffice: 3.4,
    bypassesGoldenRule: false,
    letterboxd: 'https://letterboxd.com/film/aftersun/',
    poster:
      'https://image.tmdb.org/t/p/original/hstKwXZb2h6m9HW3U6lzD5seja7.jpg',
    backdrop:
      'https://image.tmdb.org/t/p/original/kUxV378ryuayTOrXzGAqVcty2DG.jpg',
    desc: "Charlotte Wells' debut qualifies cleanly — Scottish director, writer, producer, Irish lead, Scottish characters, autobiographical British story. Shot entirely in Turkey with a Turkish crew, so no photography or majority-crew points. The same system, used as intended.",
    points: [
      'English or EEA language dialogue',
      'Lead characters British/EEA',
      'Based on British/EEA material',
      'British creativity/heritage/diversity',
      'UK Music/Audio/Post-Production',
      'Director (British/EEA)',
      'Scriptwriter (British/EEA)',
      'Producer (British/EEA)',
      'Composer (British/EEA)',
      'Lead Actors (British/EEA)',
      'Majority of Cast (British/EEA)',
      'Key Staff/HODs (British/EEA)',
    ],
  },
};

const DEFAULT_PRESET = 'Barbie (2023)';
const formatM = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(2)}bn` : `$${n}M`;

export default function BFILoopholeCalculator() {
  const [activePreset, setActivePreset] = useState<string>(DEFAULT_PRESET);
  const [selected, setSelected] = useState<string[]>(
    PRESETS[DEFAULT_PRESET].points,
  );
  const [budget, setBudget] = useState(PRESETS[DEFAULT_PRESET].budget);
  const [ukSpendPercent, setUkSpendPercent] = useState(
    PRESETS[DEFAULT_PRESET].ukSpend,
  );
  const [showEditor, setShowEditor] = useState(false);

  const isPreset = activePreset !== '' && !!PRESETS[activePreset];
  const presetData = isPreset ? PRESETS[activePreset] : null;
  const bypassesGoldenRule =
    isPreset && PRESETS[activePreset].bypassesGoldenRule;

  function loadPreset(name: string) {
    const p = PRESETS[name];
    if (!p) return;
    sendGAEvent('event', 'bfi_preset_selected', {
      preset_name: name,
      from_custom_mode: !isPreset,
    });
    setActivePreset(name);
    setSelected(p.points);
    setBudget(p.budget);
    setUkSpendPercent(p.ukSpend);
  }

  function enterCustomMode() {
    sendGAEvent('event', 'bfi_custom_mode_entered', {
      previous_preset: activePreset,
    });
    setActivePreset('');
    setSelected([]);
    setBudget(100);
    setUkSpendPercent(50);
    setShowEditor(true);
  }

  function openBreakdown() {
    sendGAEvent('event', 'bfi_breakdown_toggled', {
      action: 'opened',
      active_film: activePreset || 'custom',
    });
    setShowEditor(true);
  }

  function closeBreakdown() {
    sendGAEvent('event', 'bfi_breakdown_toggled', {
      action: 'closed',
      active_film: activePreset || 'custom',
    });
    setShowEditor(false);
  }

  function toggleBreakdown() {
    const next = !showEditor;

    showEditor ? closeBreakdown() : openBreakdown();
  }

  const { creativeScore, technicalScore } = useMemo(() => {
    let c = 0,
      t = 0;
    CATEGORIES.forEach((cat) => {
      cat.tasks.forEach((task) => {
        if (selected.includes(task.label)) {
          cat.type === 'Creative' ? (c += task.pts) : (t += task.pts);
        }
      });
    });
    return { creativeScore: c, technicalScore: t };
  }, [selected]);

  const total = creativeScore + technicalScore;

  const a1 = selected.includes('Set in UK or EEA') ? 4 : 0;
  const a2 = selected.includes('Lead characters British/EEA') ? 4 : 0;
  const a3 = selected.includes('Based on British/EEA material') ? 4 : 0;
  const goldenPointsViolation =
    !bypassesGoldenRule && a1 < 2 && a2 < 2 && a3 < 4;

  const qualifies =
    total >= PASS_MARK && ukSpendPercent >= 10 && !goldenPointsViolation;

  const rebate = qualifies
    ? (Math.min((budget * ukSpendPercent) / 100, budget * 0.8) * 0.255).toFixed(
        1,
      )
    : null;

  const isAmber = qualifies && bypassesGoldenRule;
  const isGreen = qualifies && !bypassesGoldenRule;

  const statusColor = isAmber
    ? 'text-warning-foreground'
    : isGreen
      ? 'text-success'
      : 'text-destructive';
  const statusBorder = isAmber
    ? 'border-warning/30'
    : isGreen
      ? 'border-success/30'
      : 'border-destructive/30';
  const statusBg = isAmber
    ? 'bg-warning/10'
    : isGreen
      ? 'bg-success/10'
      : 'bg-destructive/10';
  const subtextColor = isAmber ? 'text-muted-foreground' : 'text-success';

  const statusText = isAmber
    ? '✓ Certified British — via Section B discretion'
    : isGreen
      ? '✓ Passes Cultural Test'
      : goldenPointsViolation
        ? '✕ Fails Golden Points Rule'
        : '✕ Does Not Qualify';

  const statusSubtext = isAmber
    ? 'No A1/A2/A3 story points. The BFI awarded Section B for British creative contribution — a discretionary judgement with no published criteria.'
    : isGreen && isPreset
      ? 'Qualifies on story content alone — the test working as intended.'
      : null;

  return (
    <div className="max-w-3xl mx-auto rounded-2xl shadow-xl font-sans my-10 border border-border bg-card text-foreground overflow-visible">
      {/* ── ZONE 1: Film panel (preset only) ── */}
      {isPreset && presetData && (
        <div className="relative overflow-visible rounded-t-2xl">
          {/* Backdrop — clipped to rounded top corners */}
          <div
            className="absolute inset-0 rounded-t-2xl overflow-hidden"
            style={{
              backgroundImage: `url(${presetData.backdrop.replace('/original/', '/w1280/')})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/90" />
          </div>

          <div className="relative z-10 p-6 md:p-8 flex gap-5 items-end min-h-[200px] pb-0">
            {/* Title + desc */}
            <div className="flex flex-col gap-2 pb-1">
              <div className="text-lg font-black leading-tight text-white drop-shadow">
                {activePreset}
              </div>
              {/* text-sm on image overlay — white on darkened backdrop passes 4.5:1 */}
              <p className="text-sm text-slate-200 leading-relaxed max-w-sm">
                {presetData.desc}
              </p>
              <a
                href={presetData.letterboxd}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-white/70 underline underline-offset-2 transition-colors w-fit"
              >
                <svg
                  className="w-3.5 h-3.5 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M8.5 3C5.46 3 3 5.46 3 8.5S5.46 14 8.5 14c1.28 0 2.46-.44 3.38-1.17L18.83 19.8a1 1 0 001.42-1.41L13.3 11.9A5.47 5.47 0 0014 8.5C14 5.46 11.54 3 8.5 3zm0 2C10.43 5 12 6.57 12 8.5S10.43 12 8.5 12 5 10.43 5 8.5 6.57 5 8.5 5z" />
                </svg>
                View on Letterboxd
              </a>
            </div>

            {/* Poster — translates down to extrude into zone 2 */}
            <a
              href={presetData.letterboxd}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 self-end absolute top-0 right-0 -translate-y-15 translate-x-10 drop-shadow-2xl"
              aria-label={`View ${activePreset} on Letterboxd`}
            >
              <img
                src={presetData.poster.replace('/original/', '/w342/')}
                alt={`${activePreset} film poster`}
                className="h-64 w-[10.5rem] object-cover rounded-md shadow-xl ring-1 ring-white/10 hover:ring-primary transition-all"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </a>
          </div>

          {/* Preset selector pills */}
          <div
            className="relative z-10 flex gap-2 px-6 md:px-8 pb-5 flex-wrap"
            role="group"
            aria-label="Select a film"
          >
            {Object.keys(PRESETS).map((name) => (
              <button
                key={name}
                onClick={() => loadPreset(name)}
                aria-pressed={activePreset === name}
                className={`text-sm font-semibold px-3 py-1.5 rounded-full border transition-all ${
                  activePreset === name
                    ? 'bg-white text-slate-900 border-white'
                    : 'bg-black/30 text-white border-white/30 hover:bg-white/20 hover:border-white/60'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── ZONE 2: Calculator ── */}
      <div
        className={`p-6 md:p-8 bg-card ${isPreset ? 'pt-14' : 'rounded-t-xl'}`}
      >
        {/* Status badge */}
        <div
          className={`inline-flex flex-col gap-1.5 px-4 py-3 rounded-xl border mb-6 w-full ${statusBg} ${statusBorder}`}
        >
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-4xl font-black tabular-nums text-foreground">
              {total}
            </span>
            <span className="text-muted-foreground font-semibold text-base">
              /35 pts
            </span>
            <span className={`text-sm font-bold ${statusColor}`}>
              {statusText}
            </span>
          </div>
          {statusSubtext && (
            // amber-200 on slate-900 = 10.5:1 ✓  emerald-200 on slate-900 = 9.9:1 ✓
            <p className={`text-sm leading-snug max-w-lg ${subtextColor}`}>
              {statusSubtext}
            </p>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-muted rounded-lg p-3">
            <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">
              Budget
            </div>
            <div className="text-base font-black text-foreground tabular-nums">
              {formatM(budget)}
            </div>
            {isPreset && presetData?.boxOffice && (
              <div className="text-xs text-muted-foreground mt-0.5">
                Box office: {formatM(presetData.boxOffice)}
              </div>
            )}
          </div>
          <div className="bg-muted rounded-lg p-3">
            <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">
              UK Spend
            </div>
            <div className="text-base font-black text-foreground tabular-nums">
              {ukSpendPercent}%
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {formatM((budget * ukSpendPercent) / 100)} qualifying
            </div>
          </div>
          <div className="bg-muted rounded-lg p-3">
            <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">
              AVEC Rebate
            </div>
            {rebate ? (
              <div className="text-base font-black text-success tabular-nums">
                ~${rebate}M
              </div>
            ) : (
              <div className="text-base font-black text-muted-foreground/50">
                —
              </div>
            )}
            <div className="text-xs text-muted-foreground mt-0.5">
              25.5% net, capped 80%
            </div>
          </div>
        </div>

        {/* Progress bars */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wide">
              <span className="text-primary">Story & Culture (A+B)</span>
              <span className="text-muted-foreground">
                {creativeScore} / {CREATIVE_MAX}
              </span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-700 rounded-full"
                style={{
                  width: `${Math.min((creativeScore / CREATIVE_MAX) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wide">
              <span className="text-muted-foreground">
                Craft & People (C+D)
              </span>
              <span className="text-muted-foreground">
                {technicalScore} / {TECHNICAL_MAX}
              </span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-muted-foreground transition-all duration-700 rounded-full"
                style={{
                  width: `${Math.min((technicalScore / TECHNICAL_MAX) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Budget/spend inputs — custom mode only */}
        {!isPreset && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div>
              <label
                htmlFor="bfi-budget"
                className="text-xs font-bold uppercase tracking-wide text-muted-foreground block mb-1.5"
              >
                Budget ($M)
              </label>
              <input
                id="bfi-budget"
                type="number"
                min={1}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                onBlur={(e) =>
                  sendGAEvent('event', 'bfi_custom_inputs_changed', {
                    field: 'budget',
                    budget: Number(e.target.value),
                    uk_spend_percent: ukSpendPercent,
                    qualifies,
                    rebate: rebate ?? 0,
                  })
                }
                className="w-full bg-muted border border-border p-2 rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-ring text-foreground tabular-nums"
              />
            </div>
            <div>
              <label
                htmlFor="bfi-ukspend"
                className="text-xs font-bold uppercase tracking-wide text-muted-foreground block mb-1.5"
              >
                UK Spend (%)
              </label>
              <input
                id="bfi-ukspend"
                type="number"
                min={0}
                max={100}
                value={ukSpendPercent}
                onChange={(e) => setUkSpendPercent(Number(e.target.value))}
                onBlur={(e) =>
                  sendGAEvent('event', 'bfi_custom_inputs_changed', {
                    field: 'uk_spend',
                    budget,
                    uk_spend_percent: Number(e.target.value),
                    qualifies,
                    rebate: rebate ?? 0,
                  })
                }
                className="w-full bg-muted border border-border p-2 rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-ring text-foreground tabular-nums"
              />
            </div>
          </div>
        )}

        {/* CTA — shown when viewing a preset */}
        {isPreset && (
          <button
            onClick={enterCustomMode}
            className="w-full py-3 px-4 rounded-xl border border-border bg-muted hover:bg-border hover:border-primary/50 text-sm font-semibold text-foreground transition-all flex items-center justify-center gap-2 group"
          >
            <svg
              className="w-4 h-4 text-primary group-hover:text-primary/70 flex-shrink-0 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Try your own combination
          </button>
        )}

        {/* Back to examples — custom mode */}
        {!isPreset && (
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Custom configuration
            </span>
            <button
              onClick={() => {
                sendGAEvent('event', 'bfi_preset_restored', {
                  restored_to: DEFAULT_PRESET,
                });
                loadPreset(DEFAULT_PRESET);
                toggleBreakdown();
              }}
              className="text-sm font-semibold text-primary hover:text-primary/70 underline underline-offset-2 transition-colors"
            >
              ← Back to examples
            </button>
          </div>
        )}
      </div>

      {/* ── ZONE 3: Points editor (collapsible) ── */}
      <button
        onClick={toggleBreakdown}
        aria-expanded={showEditor}
        className={`${showEditor ? '' : 'rounded-b-xl'} w-full p-4 bg-muted hover:bg-border text-sm font-semibold text-muted-foreground hover:text-foreground border-t border-border transition-colors`}
      >
        {showEditor ? '↑ Close breakdown' : '↓ View points breakdown'}
      </button>

      {showEditor && (
        <div className="p-6 md:p-8 bg-card text-foreground rounded-b-2xl border-t border-border">
          <div className="grid md:grid-cols-2 gap-10">
            {CATEGORIES.map((cat) => (
              <div key={cat.id}>
                <h4 className="text-xs font-black text-muted-foreground uppercase tracking-wide mb-4 border-b border-border pb-2">
                  {cat.name}
                </h4>
                <div className="space-y-2">
                  {cat.tasks.map((t) => (
                    <label
                      key={t.label}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded flex-shrink-0 accent-primary"
                        checked={selected.includes(t.label)}
                        onChange={() => {
                          const adding = !selected.includes(t.label);
                          const nextSelected = adding
                            ? [...selected, t.label]
                            : selected.filter((i) => i !== t.label);
                          const nextTotal = CATEGORIES.flatMap((c) => c.tasks)
                            .filter((task) => nextSelected.includes(task.label))
                            .reduce((sum, task) => sum + task.pts, 0);
                          sendGAEvent('event', 'bfi_criterion_toggled', {
                            criterion: t.label,
                            action: adding ? 'added' : 'removed',
                            score: nextTotal,
                            qualifies: nextTotal >= PASS_MARK,
                          });
                          setActivePreset('');
                          setSelected(nextSelected);
                        }}
                      />
                      <span className="text-sm text-foreground group-hover:text-foreground">
                        {t.label}
                      </span>
                      <span className="ml-auto text-xs font-bold text-muted-foreground">
                        +{t.pts}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-border space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-bold text-foreground">
                Golden Points Rule:{' '}
              </span>
              A film cannot qualify on language, infrastructure, and crew alone.
              It must also score at least 2 points from A1 (setting), or at
              least 2 from A2 (lead characters), or all 4 from A3 (story). The
              three gaming-the-system presets qualified via BFI Section B
              discretion — a route that is real but not codified. When you
              configure the checkboxes manually, the rule applies in full.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-bold text-foreground">Rebate: </span>
              The AVEC net rate is 25.5% on qualifying UK spend, capped at 80%
              of total budget. EEA-language films score up to 4pts for A4, not
              the full 6 awarded for English. A1 and A2 award points
              proportionally — partial UK/EEA content earns partial points.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Film data sourced from TMDb. This product uses the TMDB API but is
              not endorsed or certified by TMDB.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
