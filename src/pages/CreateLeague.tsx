import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Counter, TextField } from '../components/ui';
import { useStore } from '../store';
import type { League } from '../types';

const BLANK: Omit<League, 'id'> = {
  name: '',
  date: '',
  time: '',
  location: '',
  promoter: '',
  logoName: null,
  counts: { amateurMMA: 0, proMMA: 0, amateurBJJ: 0, proBJJ: 0, amateurK1: 0 },
};

export default function CreateLeague() {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useStore();
  const navigate = useNavigate();

  const existing = state.leagues.find((l) => l.id === id);
  const [form, setForm] = useState<Omit<League, 'id'>>(existing ?? BLANK);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setCount(key: keyof League['counts'], value: number) {
    setForm((f) => ({ ...f, counts: { ...f.counts, [key]: value } }));
  }

  function save() {
    if (!form.name.trim()) return;
    if (existing) dispatch({ type: 'league/update', league: { ...form, id: existing.id } });
    else dispatch({ type: 'league/create', league: form });
    navigate('/leagues/upcoming');
  }

  return (
    <>
      <h1 className="banner">{existing ? 'Edit League' : 'Create League'}</h1>

      <div className="form-grid">
        <TextField
          label="League Name"
          id="lname"
          value={form.name}
          onChange={(v) => set('name', v)}
          placeholder="WDS 9"
        />

        <div className="field">
          <label htmlFor="ldate">League Date &amp; Time</label>
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              id="ldate"
              className="inp"
              value={form.date}
              placeholder="21/04/24"
              onChange={(e) => set('date', e.target.value)}
            />
            <input
              id="ltime"
              className="inp"
              style={{ maxWidth: 140 }}
              value={form.time}
              placeholder="12:00"
              aria-label="League time"
              onChange={(e) => set('time', e.target.value)}
            />
          </div>
        </div>

        <TextField
          label="League Location"
          id="lloc"
          value={form.location}
          onChange={(v) => set('location', v)}
          placeholder="Nerul, Navi Mumbai"
        />

        <TextField
          label="Promoter Name"
          id="lprom"
          value={form.promoter}
          onChange={(v) => set('promoter', v)}
          placeholder="WDS Promotions"
        />

        <Counter
          label="No. of Amateur MMA Bouts"
          value={form.counts.amateurMMA}
          onChange={(n) => setCount('amateurMMA', n)}
        />
        <Counter
          label="No. of Pro MMA Bouts"
          value={form.counts.proMMA}
          onChange={(n) => setCount('proMMA', n)}
        />
        <Counter
          label="No. of Amateur BJJ Bouts"
          value={form.counts.amateurBJJ}
          onChange={(n) => setCount('amateurBJJ', n)}
        />
        <Counter
          label="No. of Pro BJJ Bouts"
          value={form.counts.proBJJ}
          onChange={(n) => setCount('proBJJ', n)}
        />
        <Counter
          label="No. of Amateur K1 Bouts"
          value={form.counts.amateurK1}
          onChange={(n) => setCount('amateurK1', n)}
        />

        <div className="field">
          <label htmlFor="llogo">Upload League Logo</label>
          <button
            id="llogo"
            type="button"
            className="upload"
            onClick={() => set('logoName', form.logoName ? null : 'league-logo.png')}
          >
            {form.logoName ?? 'Upload'}
          </button>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-back" style={{ justifySelf: 'start' }} onClick={() => navigate(-1)}>
          Back
        </button>
        <button type="button" className="btn btn-primary btn-wide" disabled={!form.name.trim()} onClick={save}>
          Save
        </button>
        <span />
      </div>
    </>
  );
}
