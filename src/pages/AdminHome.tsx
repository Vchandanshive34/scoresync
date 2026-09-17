import { useNavigate } from 'react-router-dom';

const TILES = [
  { to: '/leagues/new', label: 'Create League' },
  { to: '/leagues/upcoming', label: 'Upcoming League' },
  { to: '/leagues/past', label: 'Past League' },
];

export default function AdminHome() {
  const navigate = useNavigate();

  return (
    <div className="tiles">
      {TILES.map((t) => (
        <button key={t.to} type="button" className="tile" onClick={() => navigate(t.to)}>
          <span className="plus" aria-hidden="true">
            +
          </span>
          <span className="cap">{t.label}</span>
        </button>
      ))}
    </div>
  );
}
