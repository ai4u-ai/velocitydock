from setuptools import find_packages
from setuptools import setup

REQUIRED_PACKAGES = ['Pillow','opencv-contrib-python','scipy','tensorflow','numpy','protobuf']
setup(
    name='annotations_converter_coco',
    version='0.2',
    install_requires=REQUIRED_PACKAGES,
    packages=find_packages(),
    include_package_data=True,
    description='converter'
)