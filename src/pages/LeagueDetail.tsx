import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store';

export default function LeagueDetail() {
  const { id } = useParams<{ id: string }>();
  const { state } = useStore();
  const navigate = useNavigate();

  const league =
    state.leagues.find((l) => l.id === id) ?? state.pastLeagues.find((l) => l.id === id);
  const bouts = state.bouts.filter((b) => b.leagueId === id).sort((a, b) => a.number - b.number);

  if (!league) {
    return (
      <>
        <h1 className="page-title">League not found</h1>
        <div className="empty">This league is no longer on the schedule.</div>
        <div style={{ marginTop: 26 }}>
          <button type="button" className="btn btn-back" onClick={() => navigate('/leagues/upcoming')}>
            Back
          </button>
        </div>
      </>
    );
  }

  const name = (fid: string) => state.fighters.find((f) => f.id === fid)?.name ?? '—';

  return (
    <>
      <h1 className="banner">{league.name}</h1>

      <div className="form-grid tight" style={{ marginBottom: 30 }}>
        <div className="field">
          <label htmlFor="ld-date">Date &amp; Time</label>
          <input id="ld-date" className="inp" readOnly value={`${league.date} · ${league.time}`} />
        </div>
        <div className="field">
          <label htmlFor="ld-loc">Location</label>
          <input id="ld-loc" className="inp" readOnly value={league.location} />
        </div>
        <div className="field">
          <label htmlFor="ld-prom">Promoter</label>
          <input id="ld-prom" className="inp" readOnly value={league.promoter || '—'} />
        </div>
        <div className="field">
          <label htmlFor="ld-count">Bouts on the card</label>
          <input
            id="ld-count"
            className="inp"
            readOnly
            value={`${bouts.length} scheduled · ${league.counts.proMMA} pro MMA, ${league.counts.amateurMMA} amateur MMA`}
          />
        </div>
      </div>

      <h2 className="page-title" style={{ fontSize: 19 }}>
        Bout Card
      </h2>

      {bouts.length === 0 ? (
        <div className="empty">No bouts have been added to this league yet.</div>
      ) : (
        <div className="table-scroll">
          <div className="dtable" style={{ gridTemplateColumns: '0.6fr 1.4fr 1fr 0.8fr 0.9fr 0.9fr' }}>
            <div className="th">Bout</div>
            <div className="th">Matchup</div>
            <div className="th">Class</div>
            <div className="th">Rounds</div>
            <div className="th">Edit</div>
            <div className="th">Score</div>

            {bouts.map((b) => (
              <div key={b.id} style={{ display: 'contents' }}>
                <div className="td">#{b.number}</div>
                <div className="td">
                  {name(b.blueFighterId)} vs {name(b.redFighterId)}
                </div>
                <div className="td">
                  {b.name} · {b.type}
                </div>
                <div className="td">
                  {b.totalRounds} × {b.roundMinutes} min
                </div>
                <div
                  className="td link"
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/bouts/${b.id}/edit`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') navigate(`/bouts/${b.id}/edit`);
                  }}
                >
                  Edit/View
                </div>
                <div
                  className="td link"
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/bouts/${b.id}/score`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') navigate(`/bouts/${b.id}/score`);
                  }}
                >
                  Memory Sheet
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="form-actions">
        <button type="button" className="btn btn-back" style={{ justifySelf: 'start' }} onClick={() => navigate(-1)}>
          Back
        </button>
        <button type="button" className="btn btn-primary btn-wide" onClick={() => navigate(`/leagues/${league.id}/edit`)}>
          Edit League
        </button>
        <span />
      </div>
    </>
  );
}
