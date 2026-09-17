import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';

export default function FighterList() {
  const { state } = useStore();
  const navigate = useNavigate();

  return (
    <>
      <h1 className="page-title">Fighter List</h1>

      <div className="table-scroll">
        <div className="dtable" style={{ gridTemplateColumns: '1.2fr 0.7fr 1.2fr 0.6fr' }}>
          <div className="th">Fighter Name</div>
          <div className="th">Record</div>
          <div className="th">Gym</div>
          <div className="th">Country</div>

          {state.fighters.map((f) => (
            <div key={f.id} style={{ display: 'contents' }}>
              <div className="td">{f.name}</div>
              <div className="td">{f.record}</div>
              <div className="td">{f.gym}</div>
              <div className="td">{f.country}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 30 }}>
        <button type="button" className="btn btn-back" onClick={() => navigate('/')}>
          Back
        </button>
      </div>
    </>
  );
}
