import re
from os.path import expanduser

from invoke import Collection, task, Responder, watchers, run
from invoke.runners import Result
import yaml
import os
import subprocess

path = ""


@task
def deploy(c):
    c.run("python setup.py sdist")
    c.run("twine upload dist/*")


@task
def git_clone(c):
    c.run("git clone https://github.com/thtrieu/darkflow.git tmp/darkflow")
    c.run("cd tmp/darkflow")
    c.config['path'] = "tmp/darkflow"
    c.config['name'] = 'darkflow'


def find_conda_env_python(env_name):
    env = {'env_name': env_name}
    cmd2 = subprocess.Popen('conda list -n {} |grep "^python\s" '.format(env_name), shell=True,
                            stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    if cmd2.stderr:
        for err in cmd2.stderr:
            if 'EnvironmentLocationNotFound' in err.decode('utf8'):
                return

    for line2 in cmd2.stdout:
        # print(re.search(r'\s*([\d.]+)', line2).group(1))

        env['python'] = re.search(r'\s*([\d.]+)', line2.decode('utf8')).group(1)
    return env


def find_anaconda_pythone_nvs():
    cmd = subprocess.Popen('conda env list | grep -v "^$\|#" ', shell=True, stdout=subprocess.PIPE)
    conda_envs = []
    for line in cmd.stdout:
        # print (line.split(' ')[0])
        env = {'name': line.split(' ')[0]}
        if (line.split(' ')[0] is not ''):
            cmd2 = subprocess.Popen('conda list -n {} |grep "^python\s" '.format(line.split(' ')[0]), shell=True,
                                    stdout=subprocess.PIPE)

            for line2 in cmd2.stdout:
                # print(re.search(r'\s*([\d.]+)', line2).group(1))
                env['python'] = re.search(r'\s*([\d.]+)', line2).group(1)
        conda_envs.append(env)
    return conda_envs


@task(git_clone)
def read_yml(c):
    print(c.config['path'])
    with c.cd(c.config['path']):
        with open(os.path.join(c.config['path'], ".travis.yml"), 'r') as stream:
            try:
                responder = Responder(
                    pattern=r"Proceed ([y]/n)?",
                    response="y\n",
                )
                yml = yaml.safe_load(stream)

                print('conda create -n {} python={}'.format(c.config['name'], yml['python'][0]))
                print(c.run('conda create -n {} python={}'.format(c.config['name'], yml['python'][0]),
                            watchers=[responder]))

                for command in yml['install']:
                    c.run(command)
            except yaml.YAMLError as exc:
                print(exc)


@task
def install_algo(c, yml_path, algo, env_name):
    user_home_path = expanduser("~")
    with open(yml_path, 'r') as stream:

        try:

            yml = yaml.safe_load(stream)
            c.config['yml'] = yml
            if algo in c.config['yml'].keys():
                algo = c.config['yml'][algo]
                url = algo['git']['url']

                name = url.split('://')[-1].split('.git')[0].replace('/', '@')
                if env_name is None:
                    env_name = name
                env = find_conda_env_python(env_name)
                if env is None:
                    print('Make new environment baby because there is none existing')
                    responder = Responder(
                        pattern=r"Proceed ([y]/n)?",
                        response="y\n",
                    )

                    print(c.run('conda create -n {} python={}'.format(env_name, algo['python']),
                                watchers=[responder]))

                if env is not None:
                    print('Ooo what to do now', env)
                    print(algo['python'])
                    if env['python'].split('.')[:2] == str(algo['python']).split('.')[:2]:
                        print('activating existing')


                    else:
                        print(c.run('conda create -n {} python={}'.format(env_name, algo['python']),
                                    watchers=[responder]))

                if not os.path.isdir(os.path.join(user_home_path,'algorithms', name)):
                    print('Cloning git')
                    c.run('git clone {} {}'.format(algo['git']['url'], os.path.join(user_home_path,'algorithms', name)))
                else:
                    print('Pulling git')
                    with c.cd(os.path.join(user_home_path,'algorithms', name)):
                        c.run('git pull {}'.format(algo['git']['url']))

                with c.cd(os.path.join(user_home_path,'algorithms', name)):

                    for command in algo['install']:
                        c.run('conda run -n {}  {}'.format(env_name, command))

                for cd_comm in algo['cd_installs']:
                        cd_comm=cd_comm['cd']
                        path = cd_comm['path'].replace('<PATH_TO>', os.path.join(user_home_path,'algorithms'))
                        try:
                            for command in cd_comm['install']:
                                with c.cd(path):
                                    command=command.replace('<PATH_TO>',  os.path.join(user_home_path,'algorithms'))
                                    c.run('conda run -n {}  {}'.format(env_name, command))
                        except Exception as exc:
                            print('installs exception',exc)
                for git_comm in algo['git_installs']:
                        git_comm=git_comm['git_inst']
                        c.run('git clone {} {}'.format(git_comm,
                                                       os.path.join(user_home_path, 'libs')))
                        path = git_comm['path'].replace('<PATH_TO>', os.path.join(user_home_path,'libs'))
                        try:
                            for command in git_comm['install']:
                                with c.cd(path):
                                    command=command.replace('<PATH_TO>',  os.path.join(user_home_path, 'algorithms', name,'models','research'))
                                    c.run(command)
                        except Exception as exc:
                            print('installs exception',exc)
                for exp_var in algo['exp_vars']:
                    with c.cd(os.path.join(user_home_path, 'algorithms', name,'models','research')):
                        command = exp_var.replace('<PATH_TO>',  os.path.join(user_home_path,'algorithms'))
                        c.run(command)

                with c.cd(os.path.join(user_home_path,'algorithms', name)):
                    c.run('conda run -n {} conda env export > environment.yml'.format(env_name))
        except yaml.YAMLError as exc:
            print(exc)


@task
def run_git_installs(c, yml_path, algo):
    user_home_path = expanduser("~")
    with open(yml_path, 'r') as stream:
        yml = yaml.safe_load(stream)
        c.config['yml'] = yml
        algo = c.config['yml'][algo]
        url = algo['git']['url']
        name = url.split('://')[-1].split('.git')[0].replace('/', '@')
        for git_comm in algo['git_installs']:
            git_url= git_comm['git_inst']['git']
            name_gitinst = git_url.split('://')[-1].split('.git')[0].replace('/', '@')
            if not os.path.isdir( os.path.join(user_home_path, 'libs',name_gitinst)):
                c.run('git clone {} {}'.format(git_url,os.path.join(user_home_path, 'libs',name_gitinst)))
            path = git_comm['git_inst']['path'].replace('<PATH_TO>', os.path.join(user_home_path, 'libs',name_gitinst))
            try:
                for command in git_comm['git_inst']['install']:
                    with c.cd(path):
                        command = command.replace('<PATH_TO>',
                                                  os.path.join(user_home_path, 'algorithms', name))
                        c.run(command)
                if 'cd' in git_comm['git_inst'].keys():
                    path=git_comm['git_inst']['cd']['path'].replace('<PATH_TO>',os.path.join(user_home_path, 'algorithms', name))
                    with c.cd(path):
                        for command in git_comm['git_inst']['cd']['install']:
                            c.run(command)
            except Exception as exc:
                print('installs exception', exc)
@task
def set_python_path(c,yml_path,algo):
    user_home_path = expanduser("~")
    with open(yml_path, 'r') as stream:
        yml = yaml.safe_load(stream)
        c.config['yml'] = yml
        algo = c.config['yml'][algo]
        url = algo['git']['url']
        name = url.split('://')[-1].split('.git')[0].replace('/', '@')
        for exp_var in algo['exp_vars']:
            with c.cd(os.path.join(user_home_path, 'algorithms', name,  'research')):
                c.run("echo  $PYTHONPATH")
                print(exp_var.replace('<PATH_TO>', os.path.join(user_home_path, 'algorithms')))
                command = exp_var.replace('<PATH_TO>', os.path.join(user_home_path, 'algorithms'))
                c.run(command)

@task
def read_yml_commands(c, yml_path):
    with open(yml_path, 'r') as stream:

        try:

            yml = yaml.safe_load(stream)
            c.config['yml'] = yml
            for algo in c.config['yml']['algorithms']:
                # print(algo)

                if algo in c.config['yml'].keys():
                    algo = c.config['yml'][algo]
                    url = algo['git']['url']
                    name = url.split('://')[-1].split('.git')[0].replace('/', '@')

                    env = find_conda_env_python(name)
                    if env is None:
                        print('Make new environment baby because there is none existing')
                        responder = Responder(
                            pattern=r"Proceed ([y]/n)?",
                            response="y\n",
                        )

                        print(c.run('conda create -n {} python={}'.format(name, algo['python']),
                                    watchers=[responder]))

                    if env is not None:
                        print('Ooo what to do now', env)
                        print(algo['python'])
                        if env['python'].split('.')[:2] == str(algo['python']).split('.')[:2]:
                            print('activating existing')


                        else:
                            print(c.run('conda create -n {} python={}'.format(name, algo['python']),
                                        watchers=[responder]))

                    if not os.path.isdir(os.path.join('algorithms', name)):
                        print('Cloning git')
                        c.run('git clone {} {}'.format(algo['git']['url'], os.path.join('algorithms', name)))
                    else:
                        print('Pulling git')
                        with c.cd(os.path.join('algorithms', name)):
                            c.run('git pull {}'.format(algo['git']['url']))
                    with c.cd(os.path.join('algorithms', name)):

                        for command in algo['install']:
                            c.run('conda run -n {}  {}'.format(name, command))
                        c.run('conda run -n {} conda env export > environment.yml'.format(name))
        except yaml.YAMLError as exc:
            print(exc)


@task
def run_test(c, path):
    for file in os.listdir(path):
        print(os.path.join(path, file))
        print(c.run('conda env create -f {}'.format(os.path.join(path, file))))


namespace = Collection(git_clone, read_yml, read_yml_commands, run_test,install_algo,set_python_path, run_git_installs)
