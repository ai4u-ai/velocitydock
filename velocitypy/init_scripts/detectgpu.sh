#!/bin/bash
eval "$(conda shell.bash hook)"
export PATH=~/anaconda3/bin:$PATH
conda activate velocitypy
NUM_GPUS_MASTER=`nvidia-smi -L | wc -l`
if [ -z "$NUM_GPUS_MASTER"] 
then
	 echo "Empty"
	 source ~/anaconda3/bin/activate ~/anaconda3/envs/velocitypy && pip uninstall tensorflow-gpu && pip install tensorflow
else
	echo "Detected $NUM_GPUS_MASTER GPUs"
	source ~/anaconda3/bin/activate ~/anaconda3/envs/velocitypy && pip uninstall tensorflow && pip install tensorflow-gpu





fi
