#! /bin/bash
eval "$(conda shell.bash hook)"
export PYTHONPATH=$PYTHONPATH:/home/ubuntu/algorithms/github.com@tensorflow@models/research/:/home/ubuntu/algorithms/github.com@tensorflow@models/research/slim
export PYTHONPATH=$PYTHONPATH:/home/ubuntu/algorithms/github.com@tensorflow@models/research/:/home/ubuntu/algorithms/github.com@tensorflow@models/research/slim
export PATH=/home/ubuntu/anaconda3/bin:$PATH
export LD_LIBRARY_PATH=/usr/local/cuda/lib64
source ~/anaconda3/etc/profile.d/conda.sh
NUM_GPUS_MASTER=`nvidia-smi -L | wc -l`
if [ -z "$NUM_GPUS_MASTER"]
sudo kill `sudo lsof -t -i:5000`
sudo kill `sudo lsof -t -i:50051`
sudo kill `sudo lsof -t -i:3000`
then
	        echo "Empty"
	        conda activate velocitypy
	        echo $CONDA_DEFAULT_ENV
            conda run -n velocitypy python  /home/ubuntu/velocitydock/velocitypy/trainer_server.py>>  /home/ubuntu/trainer_server.log 2>&1 &
            conda run -n velocitypy python  /home/ubuntu/velocitydock/velocitypy/downloadservice.py>> /home/ubuntu/downloadservice.log 2>&1 &
            conda run -n velocitypy python  /home/ubuntu/velocitydock/velocitypy/converter/conversion_service/annotations_converter_service.py>> /home/ubuntu/conversionservice.log 2>&1 &
else
	        conda activate velocitypy_gpu
	        echo "Detected $NUM_GPUS_MASTER GPUs"

	        va=$(python testgpu.py)
	        myvariable=$(whoami)
	        echo "Running scripts as $myvariable"
	        echo "Tensorflow  detect gpu's " $va

            python /home/ubuntu/velocitydock/velocitypy/trainer_server.py>>  /home/ubuntu/trainer_server.log 2>&1 &
	        source ~/anaconda3/bin/activate ~/anaconda3/envs/velocitypy_gpu &&  ~/anaconda3/envs/velocitypy_gpu/bin/python ~/velocitydock/velocitypy/downloadservice.py>>~/downloadservice.log 2>&1 &
            source ~/anaconda3/bin/activate ~/anaconda3/envs/velocitypy_gpu &&  ~/anaconda3/envs/velocitypy_gpu/bin/python ~/velocitydock/velocitypy/converter/conversion_service/annotations_converter_service.py>>~/conversionservice.log 2>&1 &

fi

node /home/ubuntu/velocitydock/vidStreamer.js>> /home/ubuntu/webapp.log 2>&1