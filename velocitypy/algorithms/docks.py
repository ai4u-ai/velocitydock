from invoke import task
from invoke import Collection, task

@task
def clean(c):

    #c.run("python setup.py build")
    print('cleaning')

@task(clean)
def build(c):

    #c.run("python setup.py build")
    print('building')

@task(build)
def deploy(c):

    #c.run("python setup.py build")
    print('deploying')

namespace = Collection(deploy, build,clean)