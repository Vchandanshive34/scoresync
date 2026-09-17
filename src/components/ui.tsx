import type { ReactNode } from 'react';

/** Wordmark. Swap in the real logo asset when you wire this to the brand kit. */
export function Logo() {
  return (
    <div className="logo" aria-label="ScoreSync">
      <span className="word">ScoreSync</span>
      <svg width="150" height="12" viewBox="0 0 150 12" fill="none" aria-hidden="true">
        <path
          d="M2 7.5C22 -1 40 10.5 62 6.5c22-4 40 5 86-2"
          stroke="#5B8DEF"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  );
}

export function TextField({
  label,
  id,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <Field label={label} htmlFor={id}>
      <input
        id={id}
        className="inp"
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export function SelectField({
  label,
  id,
  value,
  onChange,
  children,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  children: ReactNode;
}) {
  return (
    <Field label={label} htmlFor={id}>
      <div className="select-wrap">
        <select id={id} className="inp" value={value} onChange={(e) => onChange(e.target.value)}>
          {children}
        </select>
      </div>
    </Field>
  );
}

export function Counter({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="counter">
      <span className="cname">{label}</span>
      <span className="cctl">
        <button type="button" aria-label={`Decrease ${label}`} onClick={() => onChange(Math.max(0, value - 1))}>
          −
        </button>
        <span className="cval">{value}</span>
        <button type="button" aria-label={`Increase ${label}`} onClick={() => onChange(value + 1)}>
          +
        </button>
      </span>
    </div>
  );
}

export function StopwatchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="13.5" r="7.5" stroke="#4A32D6" strokeWidth="1.8" />
      <path d="M12 10v3.8l2.4 1.6" stroke="#4A32D6" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9.5 2.5h5M12 2.5V6" stroke="#4A32D6" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function TrashIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7h16M10 4h4M6.5 7l.8 12a2 2 0 0 0 2 1.9h5.4a2 2 0 0 0 2-1.9l.8-12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M10.5 11v6M13.5 11v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return [hh, mm, ss].map((n) => String(n).padStart(2, '0')).join(':');
}
