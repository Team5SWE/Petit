import hashlib

def encrypt_password(password):

    if password is None:
        return ''

    encoded = password.encode()
    return str(hashlib.sha256(encoded).hexdigest())