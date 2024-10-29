#!/usr/bin/python3
# -*- coding: utf-8 -*-


# imports
from models import TioDB, OLC, Roles, Games, EventFormat
from tools import generate_id
from interfaces import create_user

# globals
# functions
# classes


def init_olc():
    olcs = [
        OLC(status=0, type='event', color='white', name='Neu'),
        OLC(status=50, type='event', color='blue', name='Live'),
        OLC(status=100, type='event', color='green', name='Abgeschlossen'),
        OLC(status=180, type='event', color='grey', name='Verworfen'),
        OLC(status=0, type='game', color='white', name='Neu'),
        OLC(status=50, type='game', color='blue', name='Live'),
        OLC(status=100, type='game', color='green', name='Abgeschlossen'),
        OLC(status=180, type='game', color='grey', name='Verworfen'),
    ]
    TioDB.add_objects(olcs)


def init_roles():
    roles = [
        Roles(role_id=generate_id(Roles.__tablename__), type='CommonRole', name='Admin'),
        Roles(role_id=generate_id(Roles.__tablename__), type='CommonRole', name='User'),
        Roles(role_id=generate_id(Roles.__tablename__), type='CommonRole', name='Manager'),
        Roles(role_id=generate_id(Roles.__tablename__), type='CommonRole', name='Customer'),
        Roles(role_id=generate_id(Roles.__tablename__), type='EventRole', name='Event-Lead'),
        Roles(role_id=generate_id(Roles.__tablename__), type='EventRole', name='Event-Rocker'),
    ]
    TioDB.add_objects(roles)


def init_users():
    users = [
        ({'login': 'admin@tio.de',
          'firstname': 'Administrator',
          'lastname': 'System',
          'email': 'admin@tio.de',
          'gender': '',
          'title': 'Mr.',
          'function': 'CTO',
          'active': 1,
          'first_login': 0},
         'admin',
         [{'role_id': 'TR000000000001'}, {'role_id': 'TR000000000002'}, {'role_id': 'TR000000000003'}]
         )
    ]

    for user, pw, roles in users:
        new_user, _, _ = create_user(user, pw, roles)


def init_games():
    games = [
        Games(game_id=generate_id(Games.__tablename__), name='Quiz Show', description='', score_type='Punkte', score_counting='Aufsteigend', duration=20, active=1),
        Games(game_id=generate_id(Games.__tablename__), name='Mario Kart', description='', score_type='Punkte', score_counting='Aufsteigend', duration=20, active=1)
    ]
    TioDB.add_objects(games)


def init_event_formats():
    event_format = [
        EventFormat(format_id=generate_id(EventFormat.__tablename__), name='Event Format 1'),
    ]
    TioDB.add_objects(event_format)


def init_tables():
    init_olc()
    init_roles()
    init_users()
    init_games()
    init_event_formats()


if __name__ == '__main__':
    with TioDB.app.app_context():
        TioDB.db.drop_all()
        TioDB.db.create_all()
        init_tables()
