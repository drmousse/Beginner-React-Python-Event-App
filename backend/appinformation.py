#!/usr/bin/python3
# -*- coding: utf-8 -*-

# core imports
# custom imports

# FUNCTIONS
def app_information():
    # version guidelines:
    #   version 3.2.1.20240705.0004a
    #   -> 3 major update number
    #   -> 2 if app gets new features
    #   -> 1 for bugfixes
    #   20240705 -> YYYYMMDD
    #   0004 -> HHMM
    #   a -> indicates if it is alpha or beta or stable release => a/b/s
    return {
        'version': '0.3.1.20240726.0100a',
        'name': 'TIO EVENT APP',
        'coding_name': 'drmousse',
        'copyright': '(C) 2024 Some Company',
        'responsibleName': 'Max Mustermann',
        'responsibleStreet': 'Musterstraße',
        'responsibleZipCity': '12345 Musterhausen',
    }
