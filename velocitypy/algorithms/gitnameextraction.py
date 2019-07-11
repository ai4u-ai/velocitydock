import subprocess

import yaml

with open('.darkflow.yml', 'r') as stream:
    try:
        yml = yaml.safe_load(stream)
        print(yml['objectdetection']['cd_installs'])
        for cd_comm in yml['objectdetection']['cd_installs']:
            path = cd_comm['cd']['path'].replace('<PATH_TO>', 'algorithms')
            print(path)
        for exp_var in yml['objectdetection']['exp_vars']:
            print(exp_var)

    except Exception as exc:
        print(exc)