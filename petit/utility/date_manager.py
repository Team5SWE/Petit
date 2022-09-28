import datetime


def has_expired(date_string, time_string):
    """
    date in format (month/day/year)
    time in format (HH:MM:SS)

    Compares date and time provided with current time

    """
    # d = datetime.datetime.strptime(s, "%d %b %Y  %H:%M:%S") => d.year = 2022

    date_time_string = date_string+' '+time_string+':00'
    date_to_check = datetime.datetime.strptime(date_time_string, '%m/%d/%y %H:%M:%S')

    today = datetime.datetime.today()

    return today > date_to_check
