#!/bin/bash
eval "$(conda shell.bash hook)"
export PYTHONPATH=$PYTHONPATH:/home/ubuntu/algorithms/github.com@tensorflow@models/research/:/home/ubuntu/algorithms/github.com@tensorflow@models/research/slim
export PYTHONPATH=$PYTHONPATH:/home/ubuntu/algorithms/github.com@tensorflow@models/research/:/home/ubuntu/algorithms/github.com@tensorflow@models/research/slim
export PATH=~/anaconda3/bin:$PATH
NUM_GPUS_MASTER=`nvidia-smi -L | wc -l`
source ~/anaconda3/etc/profile.d/conda.sh
conda activate my_env
if [ -z "$NUM_GPUS_MASTER"]
then
	        echo "Empty"
	        conda activate velocitypy
            source ~/anaconda3/bin/activate ~/anaconda3/envs/velocitypy &&  ~/anaconda3/envs/velocitypy/bin/python ~/velocitydock/velocitypy/trainer_server.py>> ~/trainer_server.log 2>&1 &
            source ~/anaconda3/bin/activate ~/anaconda3/envs/velocitypy &&  ~/anaconda3/envs/velocitypy/bin/python ~/velocitydock/velocitypy/downloadservice.py>>~/downloadservice.log 2>&1 &
            source ~/anaconda3/bin/activate ~/anaconda3/envs/velocitypy &&  ~/anaconda3/envs/velocitypy/bin/python ~/velocitydock/velocitypy/converter/conversion_service/annotations_converter_service.py>>~/conversionservice.log 2>&1 &
else
	        echo "Detected $NUM_GPUS_MASTER GPUs"
	        conda activate velocitypy_gpu
	        source ~/anaconda3/bin/activate ~/anaconda3/envs/velocitypy_gpu &&  ~/anaconda3/envs/velocitypy_gpu/bin/python ~/velocitydock/velocitypy/trainer_server.py>> ~/trainer_server.log 2>&1 &
            source ~/anaconda3/bin/activate ~/anaconda3/envs/velocitypy_gpu &&  ~/anaconda3/envs/velocitypy_gpu/bin/python ~/velocitydock/velocitypy/downloadservice.py>>~/downloadservice.log 2>&1 &
            source ~/anaconda3/bin/activate ~/anaconda3/envs/velocitypy_gpu &&  ~/anaconda3/envs/velocitypy_gpu/bin/python ~/velocitydock/velocitypy/converter/conversion_service/annotations_converter_service.py>>~/conversionservice.log 2>&1 &

fi