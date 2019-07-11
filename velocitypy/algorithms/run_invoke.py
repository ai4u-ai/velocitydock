from invoke import run
cmd3="invoke run-git-installs .darkflow.yml objectdetection"
cmd2="invoke set-python-path .darkflow.yml objectdetection "
cmd = "invoke install-algo .darkflow.yml objectdetection velocitypy"
cmd1="invoke create-bulk-envs envs"
result = run(cmd3, hide=True, warn=True)
print(result)