import hashlib
import secrets
import random

def encrypt_password(password):

    if password is None:
        return ''

    encoded = password.encode()
    return str(hashlib.sha256(encoded).hexdigest())


def generate_random_token():
    return secrets.token_urlsafe(16)


def generate_random_code(size, floor=1):
    top = 10**size
    if floor > top:
        raise ValueError(f"Floor '{floor}' must be less than requested top '{top}'")

    return f'{random.randrange(floor, top):0{size}}'
