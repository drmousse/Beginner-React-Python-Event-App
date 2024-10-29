// core imports
import { Routes, Route, Navigate } from 'react-router-dom';
import { locale, addLocale } from 'primereact/api';
        

// custom imports
import Authentication from './routes/authentication/authentication';
import AdminPage from './routes/admin/admin';
import Home from './routes/home/home';
import Navigation from './routes/navigation/navigation';
import CreateEvents from './routes/create/events';
import CreatePage from './routes/create';
import CreateGames from './routes/create/games';
import CreateUsers from './routes/create/users';
import UserPage from "./routes/user/index.jsx";
import UserProfile from "./routes/user/profile.jsx";
import UserPW from "./routes/user/pw.jsx";
import FirstLogin from "./routes/login/first-login.jsx";
import GamePage from "./routes/games/index.jsx";
import EventPage from "./routes/event/index.jsx";
import About from "./routes/about/index.jsx";
import EventsPage from "./routes/events/index.jsx";
import Gamestation from "./routes/gamestation/index.jsx";
import { TIO_URLS } from './utils/constants';

import TemplateDemo from "./test-container/test-component.jsx";


// Component
const App = () => {

  
addLocale('de', {
  firstDayOfWeek: 1,
  dayNames: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'],
  dayNamesShort: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
  dayNamesMin: ['M', 'D', 'M', 'D', 'F', 'S', 'S'],
  monthNames: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
  monthNamesShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
  today: 'Heute',
  clear: 'Zurücksetzen',
});

locale('de');
      

  return (
    <Routes>
      <Route path='/' element={<Navigation />}>
        <Route index exact element={<Home />} />
        <Route path={TIO_URLS.event} element={<EventPage />}>
          <Route path=":eventId" element={<EventPage />} />
        </Route>
        <Route path={TIO_URLS.events}>
          <Route path=":eventStatus" element={<EventsPage />} />
        </Route>
        <Route path={TIO_URLS.gameStation}>
          <Route path=":eventId" element={<Gamestation />} />
        </Route>
        <Route path={TIO_URLS.about} element={<About />} />
        <Route path={TIO_URLS.create} element={<CreatePage />} />
        <Route path={TIO_URLS.createEvent} element={<CreateEvents />} />
        <Route path={TIO_URLS.createGame} element={<CreateGames />} />
        <Route path={TIO_URLS.createUser} element={<CreateUsers />} />
        <Route path={TIO_URLS.user} element={<UserPage />} />
        <Route path={TIO_URLS.userProfile} element={<UserProfile />} />
        <Route path={TIO_URLS.userPW} element={<UserPW />} />
        <Route path={TIO_URLS.game} element={<GamePage />} />
        <Route path={TIO_URLS.test} element={<TemplateDemo />} />
        <Route path='/admin' element={<AdminPage />} />
      </Route>
      <Route path={TIO_URLS.firstLogin} element={<FirstLogin />} />
      <Route path={TIO_URLS.login} element={<Authentication />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
