import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SelectField, TextField, initials } from '../components/ui';
import { useStore } from '../store';
import type { Bout, BoutType, Discipline } from '../types';

const ROUND_OPTIONS = [1, 2, 3, 5];
const DURATIONS = [1, 2, 3, 5];

export default function EditBout() {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useStore();
  const navigate = useNavigate();

  const bout = state.bouts.find((b) => b.id === id);
  const [form, setForm] = useState<Bout | undefined>(bout);

  if (!bout || !form) {
    return (
      <>
        <h1 className="page-title">Bout not found</h1>
        <div className="empty">This bout is not on the card.</div>
        <div style={{ marginTop: 26 }}>
          <button type="button" className="btn btn-back" onClick={() => navigate('/leagues/upcoming')}>
            Back
          </button>
        </div>
      </>
    );
  }

  function set<K extends keyof Bout>(key: K, value: Bout[K]) {
    setForm((f) => (f ? { ...f, [key]: value } : f));
  }

  const blue = state.fighters.find((f) => f.id === form.blueFighterId);
  const red = state.fighters.find((f) => f.id === form.redFighterId);

  function update() {
    if (!form) return;
    dispatch({ type: 'bout/update', bout: form });
    navigate(`/leagues/${form.leagueId}`);
  }

  return (
    <>
      <h1 className="banner">Edit Bout</h1>

      <div className="form-grid">
        <SelectField
          label="Bout Type"
          id="btype"
          value={form.type}
          onChange={(v) => set('type', v as BoutType)}
        >
          <option>Professional</option>
          <option>Amateur</option>
        </SelectField>

        <TextField label="Bout Date" id="bdate" value={form.date} onChange={(v) => set('date', v)} />

        <TextField
          label="Bout Number"
          id="bnum"
          value={String(form.number)}
          onChange={(v) => set('number', Number(v.replace(/\D/g, '')) || 0)}
        />

        <TextField
          label="Bout Name"
          id="bname"
          value={form.name}
          onChange={(v) => set('name', v)}
          placeholder="Flyweight"
        />

        <SelectField
          label="Total Rounds"
          id="brounds"
          value={String(form.totalRounds)}
          onChange={(v) => set('totalRounds', Number(v))}
        >
          {ROUND_OPTIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </SelectField>

        <SelectField
          label="Round Duration"
          id="bdur"
          value={String(form.roundMinutes)}
          onChange={(v) => set('roundMinutes', Number(v))}
        >
          {DURATIONS.map((d) => (
            <option key={d} value={d}>
              {d} Minute{d === 1 ? '' : 's'}
            </option>
          ))}
        </SelectField>

        <SelectField
          label="Discipline"
          id="bdisc"
          value={form.discipline}
          onChange={(v) => set('discipline', v as Discipline)}
        >
          <option>MMA</option>
          <option>BJJ</option>
          <option>K1</option>
        </SelectField>

        <TextField label="Ring No" id="bring" value={form.ringNo} onChange={(v) => set('ringNo', v)} />
      </div>

      <div className="vs-grid">
        <div>
          <div className="field">
            <label htmlFor="blue-corner">Blue Corner</label>
            <div className="select-wrap">
              <select
                id="blue-corner"
                className="corner-select blue"
                value={form.blueFighterId}
                onChange={(e) => set('blueFighterId', e.target.value)}
              >
                {state.fighters.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="fighter-card">
            <div className="portrait blue" aria-hidden="true">
              {initials(blue?.name ?? '?')}
            </div>
            <span className="fname">{blue?.name}</span>
            <span className="fmeta">
              {blue?.record} · {blue?.gym}
            </span>
          </div>
        </div>

        <div className="vs-mark" aria-hidden="true">
          VS
        </div>

        <div>
          <div className="field">
            <label htmlFor="red-corner">Red Corner</label>
            <div className="select-wrap">
              <select
                id="red-corner"
                className="corner-select red"
                value={form.redFighterId}
                onChange={(e) => set('redFighterId', e.target.value)}
              >
                {state.fighters.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="fighter-card">
            <div className="portrait red" aria-hidden="true">
              {initials(red?.name ?? '?')}
            </div>
            <span className="fname">{red?.name}</span>
            <span className="fmeta">
              {red?.record} · {red?.gym}
            </span>
          </div>
        </div>
      </div>

      <div className="judge-row">
        {[0, 1, 2].map((i) => (
          <SelectField
            key={i}
            label={`Add Judge ${i + 1}`}
            id={`judge-${i}`}
            value={form.judgeIds[i] ?? ''}
            onChange={(v) => {
              const next = [...form.judgeIds];
              next[i] = v;
              set('judgeIds', next);
            }}
          >
            <option value="">Select judge</option>
            {state.judges.map((j) => (
              <option key={j.id} value={j.id}>
                {j.name}
              </option>
            ))}
          </SelectField>
        ))}
      </div>

      <div className="ref-slot">
        <SelectField
          label="Add Refree"
          id="referee"
          value={form.refereeId}
          onChange={(v) => set('refereeId', v)}
        >
          <option value="">Select referee</option>
          {state.referees.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </SelectField>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-back" style={{ justifySelf: 'start' }} onClick={() => navigate(-1)}>
          Back
        </button>
        <button type="button" className="btn btn-primary btn-wide" onClick={update}>
          Update
        </button>
        <button
          type="button"
          className="btn btn-soft right"
          onClick={() => navigate(`/bouts/${form.id}/score`)}
        >
          Open Memory Sheet
        </button>
      </div>
    </>
  );
}
