import { useNavigate } from 'react-router-dom';
import { TrashIcon } from '../components/ui';
import { useStore } from '../store';

export default function LeagueList({ variant }: { variant: 'upcoming' | 'past' }) {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const leagues = variant === 'upcoming' ? state.leagues : state.pastLeagues;
  const isPast = variant === 'past';

  const columns = isPast
    ? '1.2fr 0.9fr 0.9fr 1.2fr 1fr'
    : '1.2fr 0.9fr 0.9fr 1.2fr 1fr 0.8fr';

  return (
    <>
      <h1 className="page-title">{isPast ? 'Past League' : 'Upcoming League'}</h1>

      {leagues.length === 0 ? (
        <div className="empty">No leagues here yet.</div>
      ) : (
        <div className="table-scroll">
          <div className="dtable" style={{ gridTemplateColumns: columns }}>
            <div className="th">League Name</div>
            <div className="th">League Date</div>
            <div className="th">League Time</div>
            <div className="th">League Location</div>
            <div className="th">{isPast ? 'View' : 'Edit'}</div>
            {!isPast ? <div className="th">Delete</div> : null}

            {leagues.map((l) => (
              <div key={l.id} style={{ display: 'contents' }}>
                <div className="td">{l.name}</div>
                <div className="td">{l.date}</div>
                <div className="td">{l.time}</div>
                <div className="td">{l.location}</div>
                <div
                  className="td link"
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/leagues/${l.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') navigate(`/leagues/${l.id}`);
                  }}
                >
                  {isPast ? 'View' : 'Edit/View'}
                </div>
                {!isPast ? (
                  <div className="td icon">
                    <button
                      type="button"
                      className="icon-btn"
                      aria-label={`Delete ${l.name}`}
                      onClick={() => dispatch({ type: 'league/delete', id: l.id })}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 30 }}>
        <button type="button" className="btn btn-back" onClick={() => navigate('/')}>
          Back
        </button>
      </div>
    </>
  );
}
