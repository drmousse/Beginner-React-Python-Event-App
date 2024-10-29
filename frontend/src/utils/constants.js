export const TIO_URLS = {
    base: '/',
    about: '/about',
    home: '/home',
    login: '/login',
    create: '/create',
    createEvent: '/create/event',
    createGame: '/create/game',
    createUser: '/create/user',
    event: '/event',
    events: '/events',
    gameStation: '/gamestation',
    user: '/user',
    userProfile: '/user/profile',
    userPW: '/user/pw',
    game: '/challenge',
    documentation: '/doc',
    firstLogin: '/user/first-login',
    test: '/test'
}

export const TIO_BASE_URL = 'http://localhost:1337';

// if you change here, don't forget to change in index.html
export const TIO_BASE_THEME = (mode) => `lara-${mode}-amber`;