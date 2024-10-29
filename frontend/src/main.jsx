// core imports
import React from 'react';
import ReactDOM from 'react-dom/client';
import { PrimeReactProvider } from 'primereact/api';
import { BrowserRouter } from 'react-router-dom';

import 'primeicons/primeicons.css';
import './css/tio_general.css';
import '/node_modules/primeflex/primeflex.css';
        

// custom imports
import App from './App.jsx';
import { UserSessionProvider } from './context/usersession.jsx';
import { AppInformationProvider } from './context/appinformation.jsx';
import { GamesProvider } from "./context/games.jsx";
import { UserInformationProvider } from "./context/userinformation.jsx";
import { MessagesProvider } from "./context/messages.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <PrimeReactProvider>
          <BrowserRouter>
              <AppInformationProvider>
                  <UserSessionProvider>
                        <GamesProvider>
                            <UserInformationProvider>
                                <MessagesProvider>
                                    <App />
                                </MessagesProvider>
                            </UserInformationProvider>
                        </GamesProvider>
                  </UserSessionProvider>
              </AppInformationProvider>
          </BrowserRouter>
     </PrimeReactProvider>
    </React.StrictMode>,
);
