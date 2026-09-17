import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SelectField, TextField } from '../components/ui';
import { BLOOD_GROUPS } from '../data';
import { useStore } from '../store';
import type { Judge } from '../types';

const BLANK: Judge = { id: '', name: '', contact: '', bloodGroup: 'B+ve' };

export default function JudgeList() {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const [editing, setEditing] = useState<Judge | null>(null);

  function save() {
    if (!editing || !editing.name.trim()) return;
    dispatch({ type: 'judge/save', judge: editing });
    setEditing(null);
  }

  return (
    <>
      <div className="sheet-top">
        <span style={{ width: 130 }} />
        <h1 className="page-title">Judge List</h1>
        <button type="button" className="btn btn-primary" onClick={() => setEditing(BLANK)}>
          Add Judge
        </button>
      </div>

      <div className="table-scroll">
        <div className="dtable" style={{ gridTemplateColumns: '1.2fr 1fr 0.8fr 0.9fr' }}>
          <div className="th">Judge Name</div>
          <div className="th">Contact No.</div>
          <div className="th">Blood Group</div>
          <div className="th">Edit</div>

          {state.judges.map((j) => (
            <div key={j.id} style={{ display: 'contents' }}>
              <div className="td">{j.name}</div>
              <div className="td">{j.contact}</div>
              <div className="td">{j.bloodGroup}</div>
              <div
                className="td link"
                role="button"
                tabIndex={0}
                onClick={() => setEditing(j)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setEditing(j);
                }}
              >
                Edit
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 30 }}>
        <button type="button" className="btn btn-back" onClick={() => navigate('/')}>
          Back
        </button>
      </div>

      {editing ? (
        <>
          <div className="scrim" onClick={() => setEditing(null)} />
          <div
            className="drawer"
            role="dialog"
            aria-modal="true"
            aria-label={editing.id ? 'Edit judge' : 'Add judge'}
            style={{ width: 'min(420px, 92vw)', gap: 16 }}
          >
            <h2>{editing.id ? 'Edit judge' : 'Add judge'}</h2>
            <TextField
              label="Judge Name"
              id="jname"
              value={editing.name}
              onChange={(v) => setEditing({ ...editing, name: v })}
              placeholder="Full name"
            />
            <TextField
              label="Contact No."
              id="jcontact"
              value={editing.contact}
              onChange={(v) => setEditing({ ...editing, contact: v.replace(/[^\d+ ]/g, '') })}
              placeholder="9876543210"
            />
            <SelectField
              label="Blood Group"
              id="jblood"
              value={editing.bloodGroup}
              onChange={(v) => setEditing({ ...editing, bloodGroup: v })}
            >
              {BLOOD_GROUPS.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </SelectField>

            <div className="spacer" />

            <button type="button" className="btn btn-primary" disabled={!editing.name.trim()} onClick={save}>
              {editing.id ? 'Update judge' : 'Add judge'}
            </button>
            {editing.id ? (
              <button
                type="button"
                className="btn btn-back"
                onClick={() => {
                  dispatch({ type: 'judge/delete', id: editing.id });
                  setEditing(null);
                }}
              >
                Remove judge
              </button>
            ) : null}
            <button type="button" className="btn btn-back" onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </>
      ) : null}
    </>
  );
}
