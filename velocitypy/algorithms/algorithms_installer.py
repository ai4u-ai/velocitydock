import pip
from pip._internal.utils.misc import get_installed_distributions
required_pkgs = ['git+https://github.com/thtrieu/darkflow.git']
installed_pkgs = [pkg.key for pkg in get_installed_distributions()]

for package in required_pkgs:
    print(package)
    if package not in installed_pkgs:
        print('missing',package)

        #with suppress_stdout():
        pip._internal.main(['install', package])