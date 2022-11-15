import os

path = "Users/14707/PycharmProjects/PetitProject/client/public"
start = "Users/14707/PycharmProjects/PetitProject/petit/base/"

relative_path = os.path.relpath(path, start)

print(relative_path)
