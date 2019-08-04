#!/bin/bash
eval "$(conda shell.bash hook)"
export PATH=~/anaconda3/bin:$PATH

NUM_GPUS_MASTER=`nvidia-smi -L | wc -l`
if [ -z "$NUM_GPUS_MASTER"] 
then
	 echo "Empty"
	 echo 'y' | source ~/anaconda3/bin/activate ~/anaconda3/envs/velocitypy && pip uninstall tensorflow-gpu && pip install  --ignore-installed --upgrade  tensorflow
else
	echo "Detected $NUM_GPUS_MASTER GPUs"
	conda activate velocitypy_gpu
	echo "activated conda env:$CONDA_DEFAULT_ENV"
	va=$(python testgpu.py)
    while [ "$va" = "no" ]; do
        sleep 5
        conda activate velocitypy_gpu
	    va=$(python testgpu.py)
	done
    if [ "$va" = "yes" ]; then
         echo "Tensorflow  detect gpu's " $va
    fi




fi
