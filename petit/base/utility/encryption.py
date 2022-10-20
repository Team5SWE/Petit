import hashlib
import secrets

def encrypt_password(password):

    if password is None:
        return ''

    encoded = password.encode()
    return str(hashlib.sha256(encoded).hexdigest())

def generate_random_token():
    return secrets.token_urlsafe(16)
