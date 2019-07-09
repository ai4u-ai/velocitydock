import pickle

try:
    with (open('926813.2980000001.p', "rb")) as openfile:
        print(pickle.load(openfile))
except Exception as err:
    print(err)