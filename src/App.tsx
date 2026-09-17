import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import Shell from './components/Shell';
import AdminHome from './pages/AdminHome';
import CreateLeague from './pages/CreateLeague';
import EditBout from './pages/EditBout';
import FighterList from './pages/FighterList';
import JudgeList from './pages/JudgeList';
import LeagueDetail from './pages/LeagueDetail';
import LeagueList from './pages/LeagueList';
import MemorySheet from './pages/MemorySheet';
import { StoreProvider } from './store';

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Routes>
          <Route element={<Shell />}>
            <Route path="/" element={<AdminHome />} />
            <Route path="/leagues/new" element={<CreateLeague />} />
            <Route path="/leagues/upcoming" element={<LeagueList variant="upcoming" />} />
            <Route path="/leagues/past" element={<LeagueList variant="past" />} />
            <Route path="/leagues/:id" element={<LeagueDetail />} />
            <Route path="/leagues/:id/edit" element={<CreateLeague />} />
            <Route path="/bouts/:id/edit" element={<EditBout />} />
            <Route path="/bouts/:id/score" element={<MemorySheet />} />
            <Route path="/judges" element={<JudgeList />} />
            <Route path="/fighters" element={<FighterList />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </StoreProvider>
  );
}
