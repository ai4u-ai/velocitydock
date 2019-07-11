from __future__ import print_function
import os

from scenedetect.video_manager import VideoManager
from scenedetect.scene_manager import SceneManager
from scenedetect.stats_manager import StatsManager
from scenedetect.video_splitter import split_video_ffmpeg, split_video_mkvmerge
from detection.objectdetector import ObjectDetector

from detection.edgedetector import EdgeDetector
from scenedetect.detectors import ContentDetector

STATS_FILE_PATH = 'testvideo.stats.csv'


def get_output_file_path(file_path, output_dir):
    # type: (str, Optional[str]) -> str
    """ Get Output File Path: Gets full path to output file passed as argument, in
    the specified global output directory (scenedetect -o/--output) if set, creating
    any required directories along the way.
    Arguments:
        file_path (str): File name to get path for.  If file_path is an absolute
            path (e.g. starts at a drive/root), no modification of the path
            is performed, only ensuring that all output directories are created.
        output_dir (Optional[str]): An optional output directory to override the
            global output directory option, if set.
    Returns:
        (str) Full path to output file suitable for writing.
    """
    if file_path is None:
        return None

    # If an output directory is defined and the file path is a relative path, open
    # the file handle in the output directory instead of the working directory.
    if output_dir is not None and not os.path.isabs(file_path):
        file_path = os.path.join(output_dir, file_path)
    # Now that file_path is an absolute path, let's make sure all the directories
    # exist for us to start writing files there.
    try:
        os.makedirs(os.path.split(os.path.abspath(file_path))[0])
    except OSError:
        pass
    return file_path

def main():

    # Create a video_manager point to video file testvideo.mp4. Note that multiple
    # videos can be appended by simply specifying more file paths in the list
    # passed to the VideoManager constructor. Note that appending multiple videos
    # requires that they all have the same frame size, and optionally, framerate.
    video_manager = VideoManager(['/Volumes/LaCie/deme/DEME_Object_Recognition_VIDEOS/videos/objects/2018-07-16.mp4-Scene-041_scaled.mp4'])
    stats_manager = StatsManager()
    scene_manager = SceneManager(stats_manager)
    # Add ContentDetector algorithm (constructor takes detector options like threshold).
    scene_manager.add_detector(ObjectDetector(threshold=50,min_scene_len=50))
    base_timecode = video_manager.get_base_timecode()

    try:
        # If stats file exists, load it.
        if os.path.exists(STATS_FILE_PATH):
            # Read stats from CSV file opened in read mode:
            with open(STATS_FILE_PATH, 'r') as stats_file:
                stats_manager.load_from_csv(stats_file, base_timecode)

        start_time = base_timecode    # 00:00:00.667
        end_time = base_timecode + 1200.0     # 00:00:20.000
        # Set video_manager duration to read frames from 00:00:00 to 00:00:20.
        video_manager.set_duration(start_time=start_time)

        # Set downscale factor to improve processing speed (no args means default).
        video_manager.set_downscale_factor()

        # Start video_manager.
        video_manager.start()

        # Perform scene detection on video_manager.
        scene_manager.detect_scenes(frame_source=video_manager)

        # Obtain list of detected scenes.
        scene_list = scene_manager.get_scene_list(base_timecode)
        video_paths=video_manager.get_video_paths()
        video_name = os.path.basename(video_paths[0])
        # Like FrameTimecodes, each scene in the scene_list can be sorted if the
        # list of scenes becomes unsorted.

        print('List of scenes obtained:')
        for i, scene in enumerate(scene_list):
            print('    Scene %2d: Start %s / Frame %d, End %s / Frame %d' % (
                i+1,
                scene[0].get_timecode(), scene[0].get_frames(),
                scene[1].get_timecode(), scene[1].get_frames(),))

        # We only write to the stats file if a save is required:
        if stats_manager.is_save_required():
            with open(STATS_FILE_PATH, 'w') as stats_file:
                stats_manager.save_to_csv(stats_file, base_timecode)
        split_name_format = '$VIDEO_NAME-Scene-$SCENE_NUMBER.mp4'
        output_file_prefix=get_output_file_path(split_name_format,'/Volumes/LaCie/deme/DEME_Object_Recognition_VIDEOS/videos/objects')
        split_video_ffmpeg(video_paths, scene_list,output_file_prefix,
                             video_name)


    finally:
        video_manager.release()

if __name__ == "__main__":
    main()