import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SelectField, StopwatchIcon, TextField, formatClock } from '../components/ui';
import { useStore } from '../store';
import {
  CATEGORIES,
  FINISH_METHODS,
  cornerTotal,
  type CategoryKey,
  type CornerSheet,
  type FinishMethod,
} from '../types';

const SCORES = [10, 9, 8, 7];

export default function MemorySheet() {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useStore();
  const navigate = useNavigate();

  const bout = state.bouts.find((b) => b.id === id);
  const boutJudges = state.judges.filter((j) => bout?.judgeIds.includes(j.id));
  const [judgeId, setJudgeId] = useState(() => bout?.judgeIds[0] ?? '');
  const [round, setRound] = useState(1);
  const [manualOpen, setManualOpen] = useState(false);
  const [manualValue, setManualValue] = useState('00:00');

  useEffect(() => {
    if (bout && judgeId) {
      dispatch({ type: 'sheet/ensure', boutId: bout.id, judgeId, totalRounds: bout.totalRounds });
    }
  }, [bout, judgeId, dispatch]);

  const sheet = state.sheets.find((s) => s.boutId === bout?.id && s.judgeId === judgeId);

  if (!bout) {
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

  const current = sheet?.rounds.find((r) => r.round === round);
  const locked = current?.locked ?? false;

  function cell(corner: 'blue' | 'red', category: CategoryKey) {
    return current?.[corner][category] ?? { points: 1, count: 0, note: '' };
  }

  function patch(
    corner: 'blue' | 'red',
    category: CategoryKey,
    p: Partial<{ points: number; count: number; note: string }>,
  ) {
    if (!bout || !judgeId) return;
    dispatch({ type: 'sheet/cell', boutId: bout.id, judgeId, round, corner, category, patch: p });
  }

  function applyManualTime() {
    if (!bout) return;
    const [m, s] = manualValue.split(':').map((n) => Number(n.replace(/\D/g, '')) || 0);
    dispatch({ type: 'clock/set', boutId: bout.id, judgeId, seconds: (m ?? 0) * 60 + (s ?? 0) });
    setManualOpen(false);
  }

  const blueTotal = current ? cornerTotal(current.blue as CornerSheet) : 0;
  const redTotal = current ? cornerTotal(current.red as CornerSheet) : 0;

  return (
    <>
      <div className="sheet-top">
        <span style={{ width: 150 }} />
        <h1 className="page-title">Memory Sheet</h1>
        <span className={`timer-chip ${sheet?.running ? 'running' : ''}`}>
          <StopwatchIcon />
          {formatClock(sheet?.elapsed ?? 0)}
        </span>
      </div>

      <div className="sheet-head">
        <div className="stack">
          <SelectField label="Bout type" id="ms-type" value={bout.type} onChange={() => undefined}>
            <option>{bout.type}</option>
          </SelectField>
          <TextField label="Bouts no" id="ms-bout" value={String(bout.number)} onChange={() => undefined} />
          <TextField
            label="Judge No"
            id="ms-judgeno"
            value={sheet?.judgeNo ?? ''}
            placeholder="Judge no"
            onChange={(v) => dispatch({ type: 'sheet/meta', boutId: bout.id, judgeId, patch: { judgeNo: v } })}
          />
        </div>

        <div className="stack">
          <TextField label="Ring no" id="ms-ring" value={bout.ringNo} placeholder="Ring no" onChange={() => undefined} />
          <SelectField label="Judge Name" id="ms-judge" value={judgeId} onChange={setJudgeId}>
            {boutJudges.map((j) => (
              <option key={j.id} value={j.id}>
                {j.name}
              </option>
            ))}
          </SelectField>
          <TextField
            label="Refree Name"
            id="ms-ref"
            value={sheet?.refereeName ?? ''}
            onChange={(v) =>
              dispatch({ type: 'sheet/meta', boutId: bout.id, judgeId, patch: { refereeName: v } })
            }
          />
        </div>

        <div className="methods" role="group" aria-label="Finish method">
          {FINISH_METHODS.map((m) => (
            <button
              key={m}
              type="button"
              className="btn btn-pill"
              aria-pressed={sheet?.finish === m}
              onClick={() =>
                dispatch({
                  type: 'sheet/finish',
                  boutId: bout.id,
                  judgeId,
                  finish: sheet?.finish === m ? null : (m as FinishMethod),
                })
              }
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="score-grid">
        <div className="round-col">
          {Array.from({ length: bout.totalRounds }, (_, i) => i + 1).map((r) => (
            <button
              key={r}
              type="button"
              className="round-btn"
              aria-pressed={round === r}
              onClick={() => setRound(r)}
            >
              Round {r}
            </button>
          ))}
          {CATEGORIES.map((c) => (
            <div key={c.key} className="cat-btn">
              {c.label}
            </div>
          ))}
        </div>

        {(['blue', 'red'] as const).map((corner) => (
          <section key={corner} className={`corner-panel ${corner}`}>
            <h3>{corner === 'blue' ? 'Blue Corner' : 'Red Corner'}</h3>
            <div className="cat-block">
              {CATEGORIES.map((c) => {
                const v = cell(corner, c.key);
                return (
                  <div key={c.key} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <span className="mobile-cat">{c.short}</span>
                    <div className="cat-row">
                      <input
                        className="cell"
                        aria-label={`${corner} ${c.short} points per action`}
                        value={v.points}
                        disabled={locked}
                        onChange={(e) =>
                          patch(corner, c.key, { points: Number(e.target.value.replace(/\D/g, '')) || 0 })
                        }
                      />
                      <input
                        className="cell total"
                        aria-label={`${corner} ${c.short} count`}
                        value={v.count}
                        disabled={locked}
                        onChange={(e) =>
                          patch(corner, c.key, { count: Number(e.target.value.replace(/\D/g, '')) || 0 })
                        }
                      />
                      <button
                        type="button"
                        className="cell"
                        aria-label={`Add one ${c.short} for the ${corner} corner`}
                        disabled={locked}
                        onClick={() => patch(corner, c.key, { count: v.count + 1 })}
                      >
                        +
                      </button>
                    </div>
                    <input
                      className="note-cell"
                      aria-label={`${corner} ${c.short} note`}
                      value={v.note}
                      disabled={locked}
                      placeholder="Note"
                      onChange={(e) => patch(corner, c.key, { note: e.target.value })}
                    />
                  </div>
                );
              })}

              <div className="running-total">
                Round {round} points:{' '}
                <b>{corner === 'blue' ? blueTotal : redTotal}</b>
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className="sheet-foot">
        <button type="button" className="btn btn-pill" onClick={() => setManualOpen(!manualOpen)}>
          <StopwatchIcon />
          Manual Time
        </button>

        {manualOpen ? (
          <>
            <input
              className="inp"
              style={{ maxWidth: 130, height: 44 }}
              value={manualValue}
              aria-label="Manual time, minutes and seconds"
              onChange={(e) => setManualValue(e.target.value)}
            />
            <button type="button" className="btn btn-soft" onClick={applyManualTime}>
              Set
            </button>
          </>
        ) : null}

        <span className="grow" />

        <button
          type="button"
          className="btn btn-primary"
          disabled={locked || current?.blueScore == null || current?.redScore == null}
          onClick={() => dispatch({ type: 'sheet/lock', boutId: bout.id, judgeId, round })}
        >
          {locked ? `Round ${round} submitted` : 'Final score'}
        </button>

        <div className="select-wrap">
          <select
            className="score-select blue"
            aria-label="Blue corner final score"
            disabled={locked}
            value={current?.blueScore ?? ''}
            onChange={(e) =>
              dispatch({
                type: 'sheet/finalScore',
                boutId: bout.id,
                judgeId,
                round,
                corner: 'blue',
                value: e.target.value ? Number(e.target.value) : null,
              })
            }
          >
            <option value="">score</option>
            {SCORES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="select-wrap">
          <select
            className="score-select red"
            aria-label="Red corner final score"
            disabled={locked}
            value={current?.redScore ?? ''}
            onChange={(e) =>
              dispatch({
                type: 'sheet/finalScore',
                boutId: bout.id,
                judgeId,
                round,
                corner: 'red',
                value: e.target.value ? Number(e.target.value) : null,
              })
            }
          >
            <option value="">score</option>
            {SCORES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="clock-row">
        <button
          type="button"
          className="btn btn-go"
          onClick={() => dispatch({ type: 'clock/start', boutId: bout.id, judgeId })}
        >
          Start
        </button>
        <button
          type="button"
          className="btn btn-stop"
          onClick={() => dispatch({ type: 'clock/stop', boutId: bout.id, judgeId })}
        >
          Stop
        </button>
      </div>

      <div style={{ marginTop: 34 }}>
        <button type="button" className="btn btn-back" onClick={() => navigate(`/leagues/${bout.leagueId}`)}>
          Back
        </button>
      </div>
    </>
  );
}
