#!/usr/bin/python3
# -*- coding: utf-8

# core imports
from sqlalchemy import String, DateTime, BINARY

# custom imports
import tioglobals
from . import TioDB


# classes
class EventSession(TioDB.db.Model):
    __tablename__ = 'tio_event_session'
    __classname__ = 'tio_event_session'

    event_id = TioDB.db.Column(String(tioglobals.LENGTH_ID), primary_key=True)
    session_id = TioDB.db.Column(BINARY(70), nullable=False)

    @classmethod
    def ObjectByPK(cls, counter_name):
        raise NotImplemented

    @classmethod
    def ObjectsByKeys(cls, **kwargs):
        obj = []
        _objs = TioDB.db.session.execute(TioDB.db.select(cls).filter_by(**kwargs)).all()
        for _o in _objs:
            obj.append(_o[0])

        return obj

    @classmethod
    def AllObjects(cls):
        raise NotImplemented

    # INSTANCE METHODS
    def update(self, key, value):
        """
        This method is used to update a value in database and commit it immediately.
        :param key: str
        :param value: str | int | float | datetime.datetime
        :return: None
        """
        setattr(self, key, value)
        TioDB.db.session.commit()

    def commit(self):
        """
        This method is used to commit changes to the database.
        Especially useful if multiple changes were made, so you only have to commit once.
        :return: None
        """
        TioDB.db.session.commit()

    def convert_to_dict(self):
        return {col.name: getattr(self, col.name) for col in self.__table__.columns}
