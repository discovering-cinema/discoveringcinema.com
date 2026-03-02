"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const data = [
    { year: '2016', domestic: 206,  inward: 1350 },
    { year: '2017', domestic: 190,  inward: 1690 },
    { year: '2018', domestic: 319,  inward: 1493, note: 'anomaly' },
    { year: '2019', domestic: 175,  inward: 1747 },
    { year: '2020', domestic: 120,  inward: 1240, note: 'pandemic' },
    { year: '2021', domestic: 252,  inward: 1320 },
    { year: '2022', domestic: 201,  inward: 1940 },
    { year: '2023', domestic: 150,  inward: 1040, note: 'strikes' },
    { year: '2024', domestic: 186,  inward: 1850 },
    { year: '2025', domestic: 193,  inward: 2510 },
];

const CustomTooltip = ({active, payload, label}: {
    active: boolean|undefined,
    payload: Array<{ name: string, color: string, value: number }>|undefined,
    label: string|undefined,
}) => {
    if (!active || !payload || !payload.length) return null;

    const point = data.find(d => d.year === label);
    const notes: Record<string, string> = {
        '2018': '* Domestic spend anomaly — BFI attributed this partly to data collection methodology changes.',
        '2020': '* Production halted March–July due to Covid-19 lockdowns.',
        '2023': '* Hollywood writers\' and actors\' strikes disrupted inward investment productions.',
    };

    const note = label ? notes[label] : undefined;

    return (
        <div style={{
            background: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '4px',
            padding: '12px 16px',
            fontSize: '13px',
            maxWidth: '260px',
        }}>
            <p style={{ margin: '0 0 8px', fontWeight: 600, color: '#fff' }}>{label}</p>
            {payload.map(entry => (
                <p key={entry.name} style={{ margin: '2px 0', color: entry.color }}>
                    {entry.name}: £{entry.value}m
                </p>
            ))}
            {note && (
                <p style={{ margin: '8px 0 0', color: '#999', fontSize: '11px', lineHeight: 1.4 }}>
                    {note}
                </p>
            )}
        </div>
    );
};

export default function UKFilmSpendChart() {
    return (
        <figure style={{ margin: '2rem 0' }}>
            <figcaption style={{
                fontSize: '14px',
                color: '#999',
                marginBottom: '12px',
                lineHeight: 1.5,
            }}>
                UK film production spend by source, 2016–2025 (£ millions).{' '}
                <a
                    href="https://www.bfi.org.uk/industry-data-insights/official-statistics-release-calendar"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#ccc' }}
                >
                    Source: BFI annual statistics releases.
                </a>
            </figcaption>

            <ResponsiveContainer width="100%" height={340}>
                <LineChart data={data} margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                    <XAxis
                        dataKey="year"
                        tick={{ fill: '#999', fontSize: 12 }}
                        axisLine={{ stroke: '#444' }}
                        tickLine={false}
                    />
                    <YAxis
                        tickFormatter={v => `£${v}m`}
                        tick={{ fill: '#999', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        width={72}
                    />
                    <Tooltip content={<CustomTooltip active={undefined} payload={undefined} label={undefined} />} />
                    <Legend
                        wrapperStyle={{ fontSize: '13px', color: '#ccc', paddingTop: '12px' }}
                    />

                    {/* Annotation lines for notable events */}
                    <ReferenceLine x="2020" stroke="#444" strokeDasharray="4 4" label={{ value: 'Covid', fill: '#666', fontSize: 11, position: 'insideTopRight' }} />
                    <ReferenceLine x="2023" stroke="#444" strokeDasharray="4 4" label={{ value: 'Strikes', fill: '#666', fontSize: 11, position: 'insideTopRight' }} />

                    <Line
                        type="monotone"
                        dataKey="inward"
                        name="Inward investment"
                        stroke="#e8c55a"
                        strokeWidth={2}
                        dot={{ r: 4, fill: '#e8c55a' }}
                        activeDot={{ r: 6 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="domestic"
                        name="Domestic UK"
                        stroke="#6b9ed2"
                        strokeWidth={2}
                        dot={{ r: 4, fill: '#6b9ed2' }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>

            <p style={{ fontSize: '12px', color: '#666', marginTop: '10px', lineHeight: 1.5 }}>
                † 2018 domestic spend (£319m) is an outlier. The BFI noted this partly reflected methodology changes in data collection.
                The 2020 dip reflects Covid-19 production shutdowns (March–July). The 2023 dip in inward investment reflects the Hollywood writers' and actors' strikes.
                All figures are film-only; high-end TV production is excluded.
            </p>
        </figure>
    );
}