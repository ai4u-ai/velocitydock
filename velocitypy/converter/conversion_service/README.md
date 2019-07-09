PROTOS
python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=.

Scene detect
scenedetect -i 2018-07-13.mp4 -o output_dir detect-content -t 9 list-scenes save-images split-video
