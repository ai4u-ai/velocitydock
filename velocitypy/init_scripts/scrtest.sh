 eval "$(conda shell.bash hook)"
conda activate velocitypy_gpu
echo $CONDA_DEFAULT_ENV
python testgpu.py
