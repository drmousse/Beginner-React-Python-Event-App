# TIO-APP: Team Event App

1. [The Tio App](#1-the-tio-app)
2. [How to run the app](#2-how-to-run-the-app)
   - [Frontend](#21-frontend)
   - [Backend](#22-backend)
3. [Open Issue List](#3-open-issue-list)
   - [Home](#31-home)
   - [Events](#32-events)
   - [Games](#33-games)
   - [Auth](#34-auth)
   - [User](#35-user)
   - [Logging](#36-logging)
   - [Navigation](#37-navigation)
   - [General](#38-general)
   - [Blob](#39-blob)
   - [Ideas](#310-ideas)
   - [Misc](#311-misc)
4. [Further Improvements](#4-further-improvements)
5. [How does the app work](#5-how-does-the-app-work)
6. [Environment variables](#6-environment-variables)
7. [Last words](#7-last-words)

---

## 1. The Tio App
This is a (in my opinion) very beginner-friendly React (frontend) and Python/Flask (backend) fullstack web app project. 
It is a team building event app and it's supposed to help you on site with the hustle of writing down the scores of
all teams and calculate the placements within a game (called challenge in this app) and eventually calculate the final, 
overall placements of all teams. The App supports creation of events, challenges and users. It also has a simple role based access system.

I started this project but never finished/optimized/refactored/improved it. But there are enough open issues, ideas and
notes about improvements so that this project can be a good start to establish and improve your Python and React coding skills.

For UI https://primereact.org/ is used.

If you want to make database changes but don't want to erase whole db and init it again, you can use Alembic.
It is part of the backend package of this project.

As far as I remember this app does not assume any OS, so it should work on Windows, Linux and Mac.

The app itself is in german, but there are a lot of translators out there, so it should be no problem, to translate
all of it to english or any other language you desire.

---

## 2. How to run the app

### 2.1 Frontend
This is actually pretty easy. You install all dependencies via `npm install` and run it then with `npm run dev` and then  
you should see address in your shell which you can enter in your browser. The login information are:


**Login**: ***admin@tio.de***  
**PW**: ***admin***

### 2.2 Backend
It is recommended to create a virtual environment. Ideally the Makefile should be able to do it ^^. After that,
you have to install all dependencies (to be honest, not all dependencies are necessary. I tried some stuff and didn't remove
the deps afterwards. sry for that) via `pip install -r requirements.txt` or `poetry install`. With that, you now should be able
to initialize your backend by running `python init_tables.py`. After successful init, you start the backend server with
`python server.py`. And that should be it :)

---

## 3. Open Issue List
Here you will find a list of open issues/to-do's which are not realized/implemented which you can code.
Every section represents a different part of the app, e.g. Home represents the Start page of the app you are welcomed with.
Unfortunately, you have to find out on your own, if the open issue is related to backend or frontend ^^

### 3.1 Home

- [ ] **`H-0001`**: Implemented a new section `Event Overview` which is implemented as a carousel
- [x] **`H-0002`**: Divide start page into three sections: `Message board`, `Event calendar`, `My Notes` (already done. just here, that you are made aware of the fact, that the start page is horizontally divided in three sections)
- [ ] **`H-0003`**: Implement switch to align all sections vertically
- [ ] **`H-0004`**: Message board should not load all messages, only last two weeks or so. Implement pagination feature.
- [ ] **`H-0005`**: Same as **`H-0004`** but for `My Notes`

### 3.2 Events

- [ ] **`E-0001`**: At the moment the algorithm for event schedule is hard coded for different number of teams and games. Check if there is a general solution and if so, implement.

### 3.3 Games

- [ ] **`G-0001`**: Deactivate button in `Challenges verwalten` has no functionality (if I remember correctly). Implement it

### 3.4 Auth

- [ ] **`A-0001`**: Logic for refresh- and access-token has to be completed
- [ ] **`A-0002`**: Refactor the check for session_id by replacing code with a decorator
- [ ] **`A-0003`**: Since the authorization is for learning purposes, replace it with some tested and used online solution which is actually safe ;)

### 3.5 User

- [ ] **`U-0001`**: Persisting dark mode is kind of buggy. If you activate dark mode, log out and log in and turn off dark mode, it's still dark.
- [ ] **`U-0002`**: If you change profile picture, it is not updated immediately. Only if you click on Refresh after save, it is shown.

### 3.6 Logging

- [ ] **`L-0001`**: There is no logging feature in the backend. Implement logging.
- [ ] **`L-0002`**: There is no logging in the frontend. Implement logging feature but with switch. Only if switch is turned on, logging should be activated
- [ ] **`L-0003`**: Administrator should have the possibility to set log level via frontend

### 3.7 Navigation

- [ ] **`N-0001`**: Implement general create page, so that one can decide if he/she wants to create an event, a challenge or a user

### 3.8 General

- [ ] **`GE-0001`**: Harmonize backend request returns: Use interfaces/__init__.py-create_game as template
- [ ] **`GE-0002`**: Replace `error` in make_response by `message`. This is more general
- [ ] **`GE-0003`**: The `Über TIO-App`-Page should be a overlay popup and not a page on its own
- [ ] **`GE-0004`**: There is a Makefile for backend. Improve it and make it work under any circumstances
- [ ] **`GE-0005`**: Implement multi language feature
- [ ] **`GE-0006`**: Write documentation ;)

### 3.9 Blob

- [ ] **`B-0001`**: Pictures should be replaced by Hex64, so that they can be stores in db

### 3.10 Ideas

- [ ] **`I-0001`**: Logging of failed login attempts
- [ ] **`I-0002`**: If login fails five times (or some other arbitrary number), login is blocked (but for security reason there should be no information to the user trying to login)
- [ ] **`I-0003`**: If user account is blocked due to failed login, email to administrator
- [ ] **`I-0004`**: Dashboard for statistics
- [ ] **`I-0005`**: Implement in-app-messaging
- [ ] **`I-0006`**: Implement reports (buzzword data science)
- [ ] **`I-0007`**: Implement some kind of caching system 

### 3.11 Misc
In the source code itself there are a lot of `# todo` / `// todo` sections in the code, with more open issues. So it's not just this
list, but the source code as well, with open issues. Unfortunately it's mixed: sometimes it's in german, sometimes in english. I am
not even sure, why i wasn't consisted in my choice of language :D But with some fitting translator it should be not a problem at all
to translate it to english or any language you desire.

---

## 4. Further Improvements
The app is far from being production ready, but it is a good project to improve your React skills. In this app almost everything in the  
frontend is done with React and its hooks. Here are some ideas which can improve the app to make it more efficient and more important, scalable  

- Replace useContext with Redux
- There is a lot of asynchronous stuff happening, which is ideal to be replaced by Redux-Saga
- There is no useful memoization of states, hence there are probably enough possibilities in the app to introduce Reselect
- Refactor code: this version of the app is the first version, which means, it is not optimized under any circumstances. Neither backend nor frontend
- Component architecture: There are a lot of components in the routes folder. Most of them can be refactored to components folder
- There is a pretty poor implementation of caching stuff in localStorage. This is a good opportunity to replace it with redux-persist
- There is like 0 testing in this project and since this project is fairly simple, writing all necessary tests should be pretty straight forward and you would definitely benefit from it
- The interface of the backend should be refactored to its different components
- Replace the auth system. It was for pure learning purposes. No offense, but don't assume, you can do better than already, by thousands, tested solutions out there ;P

---

## 5. How does the app work
Coming soon... or you can click and find out on your own until this section is ready ;P

---

## 6. Environment variables
The app is making use of environment variables. In particular

- TIO_DB_USER = 'some_user'
- TIO_DB_PW = 'some_pw'
- TIO_DB_SCHEMA = 'some_schema'
- MYSQL_ON = 0
- TIO_API_APP_KEY = 'some_api_key'
- TIO_API_REFRESH_KEY = 'some_refresh_key'
- TIO_API_ACCESS_KEY = 'some_access_key'

You can use a .env file (easiest solution I'd recommend or put all this in your environment variables of your OS).

---

## 7. Last words
This Readme is surely not complete in regard of open issues or functionality (`5.How does the app work`) or just stating the status quo of the app.
I did write down everything I remembered and/or had written down. Therefore:

**THIS IS A PROJECT FOR LEARNING PURPOSES**

But it probably has some potential to be extended and make it work (and sell, I guess) in production.

I learned a lot creating this project and hopefully you will do as well by extending the existing features.
Eventually, feel free to modify this app as you wish and add any feature/functionality you want. The open issues I wrote
above are a list of open issues to get you running, if you don't know what to do or where to start.

**Happy Coding**  
***Mousse***