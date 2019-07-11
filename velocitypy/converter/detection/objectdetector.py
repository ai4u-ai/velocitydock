""" Experimental edge_detector module for PySceneDetect.

This module implements the EdgeDetector, which compares the difference
in edges between adjacent frames against a set threshold/score, which if
exceeded, triggers a scene cut.
"""

# Third-Party Library Imports

# import the necessary packages
from skimage.measure import compare_ssim
from collections import Counter
import numpy
import cv2
import scipy
import tensorflow as tf
# New dependencies
import skvideo
from skvideo.motion.gme import globalEdgeMotion
from scipy.ndimage.morphology import binary_dilation

# PySceneDetect Library Imports
from scenedetect.scene_detector import SceneDetector

from utils.utils import get_bunding_boxes_from_contour, edge_detection, get_moving_objects


class ObjectDetector(SceneDetector):
    """Detects cuts using changes in edges found using the Canny operator.

    This detector uses edge information to detect scene transitions. The
    threshold sets the fraction of detected edge pixels that can change from one
    frame to the next in order to trigger a detected scene break. Images are
    converted to grayscale in this detector, so color changes won't trigger
    a scene break like with the ContentDetector.

    Paper reference: http://www.cs.cornell.edu/~rdz/Papers/ZMM-MM95.pdf
    """

    def __init__(self, threshold=0.4, min_scene_len=10, r_dist=6,maxDissapeard=20,display=True):
        super(ObjectDetector, self).__init__()
        self.threshold = threshold
        self.min_scene_len = min_scene_len  # minimum length of any given scene, in frames
        self.r_dist = r_dist  # distance over which motion is estimate (on scaled-down image)
        self.last_frame = None
        self.last_frames = []
        self.objects=[]
        self.object_ereas=[]
        self.last_scene_cut = None
        self._metric_keys = ['p_max', 'p_in', 'p_out']
        self.dissapeard=Counter([])
        self.maxDissapeard=maxDissapeard
        self.display=display

    #         self.cli_name = 'detect-content'

    def _percentage_distance(self, frame_in, frame_out, r):
        diamond = numpy.array([[0, 1, 0], [1, 1, 1], [0, 1, 0]])

        E_1 = binary_dilation(frame_in, structure=diamond, iterations=r)
        E_2 = binary_dilation(frame_out, structure=diamond, iterations=r)

        combo = numpy.float32(numpy.sum(E_1 & E_2))
        total_1 = numpy.float32(numpy.sum(E_1))

        return 1.0 - combo / total_1

    def process_frame(self, frame_num, frame_img):
        # type: (int, numpy.ndarray) -> List[int]
        """ Detects difference in edges between frames. Slow transitions or
        transitions that happen in color space that won't show in grayscale
        won't trigger this detector.

        Arguments:
            frame_num (int): Frame number of frame that is being passed.

            frame_img (Optional[int]): Decoded frame image (numpy.ndarray) to perform scene
                detection on. Can be None *only* if the self.is_processing_required() method
                (inhereted from the base SceneDetector class) returns True.

        Returns:
            List[int]: List of frames where scene cuts have been detected. There may be 0
            or more frames in the list, and not necessarily the same as frame_num.
        """
        cut_list = []
        metric_keys = self._metric_keys
        _unused = ''

        if self.last_frame is not None:
            # Fraction of edge pixels changing in new frame, max, entering, and leaving
            p_max, p_in, p_out = 0.0, 0.0, 0.0
            current_boxes = []
            matches=[]
            dist=0.0
            if (self.stats_manager is not None and
                    self.stats_manager.metrics_exist(frame_num, metric_keys)):
                p_max, p_in, p_out = self.stats_manager.get_metrics(
                    frame_num, metric_keys)

            else:
                # if len(self.last_frames)>0:
                #         curr_scene=self.last_frames+[frame_img]
                #         motionDataScene = skvideo.motion.blockMotion(curr_scene)
                #         motionMagnitudeScene = numpy.sqrt(numpy.sum(motionDataScene ** 2, axis=3))
                #         histScene, bins = numpy.histogram(motionMagnitudeScene, bins=40, range=(-0.5, 40.5))
                #         motionData = skvideo.motion.blockMotion([self.last_frame,frame_img])
                #         motionMagnitude = numpy.sqrt(numpy.sum(motionData** 2, axis=3))
                #         hist, bins = numpy.histogram(motionMagnitude,  bins=40, range=(-0.5, 40.5))
                #         center = (bins[1:] + bins[:-1]) / 2.0
                #         dist=numpy.linalg.norm(histScene-hist)
                #         print(dist)


                copy_frm = numpy.array(frame_img)
                copy_lastfr=numpy.array(self.last_frame)
                # current_boxes=get_bunding_boxes_from_contour(edge_detection(copy_frm),self.threshold)
                current_boxes,cont_areas=get_moving_objects(copy_lastfr,copy_frm,self.threshold)

                cropped_current = []
                for  index,box in enumerate(current_boxes):
                    (x, y, w,  h) = box

                    cropped = copy_frm[y:y+h, x:x+w]
                    if len(cropped) > 0:
                        cropped_current.append(cropped)
                    else:
                        del current_boxes[index]
                        del cont_areas[index]
                        # cv2.rectangle(copy_frm, (x, y), (x + w, y + h), (0, 255, 255), 1)

                # cv2.imshow('frame_img', cv2.resize(copy_frm, (800, 800)))
                key = cv2.waitKey(1) & 0xFF
                i = len(current_boxes)

                # current_boxes current_boxes_=
                # for ii in range(i):
                #     current_boxes_.append(current_boxes[ii])
                #
                # current_boxes,weights=cv2.groupRectangles(list(current_boxes_), 1,0.02)
                #
                # for index, box in enumerate(current_boxes):
                #     (x, y, w, h) = box
                #     cropped = copy_frm[y:y+h,x:x+w]
                #     if len(cropped)>0:
                #         cropped_current.append(cropped)
                #         cv2.putText(copy_frm, str(index), (x, y), cv2.FONT_HERSHEY_SIMPLEX, 0.2, 55)
                #         cv2.rectangle(copy_frm, (x, y), (x + w, y + h), (0, 255, 0), 1)


                last_frame=numpy.array(self.last_frame)
                matches=[]
                for index,box in  enumerate(self.objects):
                    (x, y, w, h) = box
                    (startX, startY, endX, endY) = (int(x), int(y), int(x + w), int(y + h))
                    cX = int((startX + endX) / 2.0)
                    cY = int((startY + endY) / 2.0)
                    cropped = last_frame[y:y+h,x:x+w]
                    distances = []
                    if len(cropped)>0:
                        grayA = cv2.cvtColor(cropped, cv2.COLOR_BGR2GRAY)
                        # cv2.putText(last_frame, str(index), (x, y), cv2.FONT_HERSHEY_SIMPLEX, 0.2, 255)

                        cropped_current = numpy.array(cropped_current)
                        for index_,cr_curr in enumerate(cropped_current) :
                            (x_, y_, w_, h_) = current_boxes[index_]
                            area_diff=numpy.abs((w*h)-(w_*h_))
                            area_diff=area_diff/(w*h)
                            print('------'+str(area_diff))
                            if area_diff <0.5:
                                try:
                                    grayB = cv2.cvtColor(cv2.resize(cr_curr,(cropped.shape[1],cropped.shape[0])), cv2.COLOR_BGR2GRAY)
                                    (score, diff) = compare_ssim(grayA, grayB, full=True)



                                    distances.append(score)
                                except Exception as err:
                                    # print(err)
                                    distances.append(-1)
                            else:
                                distances.append(-1)
                    try:


                        best_match=numpy.argmax(distances)

                        (x_, y_, w_, h_) = current_boxes[best_match]
                        if distances[best_match]>0.6:
                            (startX_, startY_, endX_, endY_)=(int(x_), int(y_), int(x_ + w_), int(y_ + h_))
                            cX_ = int((startX_ + endX_) / 2.0)
                            cY_ = int((startY_ + endY_) / 2.0)


                            dist_centroids=scipy.spatial.distance.cdist([[cX_,cY_]],[[cX,cY]])
                            dist_centroids=numpy.squeeze(dist_centroids)
                            print('----------- dist cetnr'+str(dist_centroids))
                            if dist_centroids>20:
                                matches.append([index,index_])
                                # cv2.rectangle(last_frame, (x, y), (x + w, y + h), (255, 255, 0), 1)
                                # cv2.putText(last_frame, str(index), (x, y), cv2.FONT_HERSHEY_SIMPLEX, 0.2, 255)
                                # # matches.append(current_boxes[best_match])
                                # cv2.putText(copy_frm, str(round(distances[best_match],2))+' '+str(index)+' '+str(round(float(dist_centroids),2)),
                                #             (cX, cY), cv2.FONT_HERSHEY_SIMPLEX, 0.2, 255)
                                #
                                # cv2.rectangle(copy_frm, (x_, y_), (x_ + w_, y_ + h_), (0, 255, 255), 1)
                                # stacked = numpy.hstack((last_frame, copy_frm))
                                # cv2.imshow('frame_img', cv2.resize(stacked, (800, 800)))
                                # key = cv2.waitKey(15) & 0xFF
                        print('')
                    except Exception as err:
                         print(err)

                        # cropped=cropped[numpy.newaxis,:]
                        # cropped_current=numpy.array(cropped_current)

                        # try:
                        #     cropped_current_ = [cv2.resize(c, ( cropped.shape[1],cropped.shape[0])).flatten() for c in
                        #                         cropped_current if len(c) > 0]
                        #     D = scipy.spatial.distance.cdist(cropped_current_, [cropped.flatten()],  metric='euclidean')
                        #     for index,dist in enumerate(D):
                        #         (x,y,w,h)=current_boxes[index]
                        #         cv2.putText(last_frame, str(index), (x, y), cv2.FONT_HERSHEY_SIMPLEX, 0.2, 255)
                        #         cv2.rectangle(last_frame, (x, y), (x + w, y + h), (255, 255, 0), 1)
                        #         cv2.putText(copy_frm, str(numpy.squeeze(dist)), (x, y), cv2.FONT_HERSHEY_SIMPLEX, 0.2, 255)
                        #
                        #
                        #     print(D)
                        # except Exception as err:
                        #         print(err)
                matches=numpy.array(matches)
                current_boxes=numpy.array(current_boxes)
                refound_objects=numpy.array(self.objects)

                if self.display:
                    for index, object in enumerate(self.objects):
                        (x_, y_, w_, h_) = object
                        (startX_, startY_, endX_, endY_) = (int(x_), int(y_), int(x_ + w_), int(y_ + h_))
                        cX_ = int((startX_ + endX_) / 2.0)
                        cY_ = int((startY_ + endY_) / 2.0)

                        cv2.putText(last_frame, str(index) ,
                                    (cX_, cY_), cv2.FONT_HERSHEY_SIMPLEX, 0.2, 255)

                        cv2.rectangle(last_frame, (x_, y_), (x_ + w_, y_ + h_), (0, 255, 255), 1)

                if len(matches)>0:
                    mathced_prev=matches[:,0]
                    indices=numpy.arange(0,len(self.objects),dtype=numpy.int32)
                    intersection=numpy.intersect1d(mathced_prev,indices)
                    m=[index for index in indices if index not in intersection]
                    missing=indices[m]
                    self.dissapeard.update(missing)

                    indices_current=numpy.arange(0,len(current_boxes),dtype=numpy.int32)
                    matched_current=matches[:,1]
                    unmatched=numpy.setdiff1d(indices_current, matched_current)
                    refound_objects[intersection]=current_boxes[matches[:,1]]
                    refound_objects=numpy.concatenate((refound_objects,current_boxes[unmatched]),axis=0)

                    keys_to_del=numpy.array([key for key, count in self.dissapeard.most_common()  if count > self.maxDissapeard])

                    self.objects=numpy.array([ob for index, ob in enumerate(refound_objects) if index not in keys_to_del])

                    for key in keys_to_del:
                        for i in range(self.dissapeard.get(key)):
                            self.dissapeard.subtract([key])
                    if self.display:
                        for index, object in [(index,object) for index,object in enumerate(self.objects) if key not in missing]:
                            (x_,y_,w_,h_)=object
                            (startX_, startY_, endX_, endY_) = (int(x_), int(y_), int(x_ + w_), int(y_ + h_))
                            cX_ = int((startX_ + endX_) / 2.0)
                            cY_ = int((startY_ + endY_) / 2.0)

                            cv2.putText(copy_frm, str(index) ,
                                            (cX_, cY_), cv2.FONT_HERSHEY_SIMPLEX, 0.2, 255)

                            cv2.rectangle(copy_frm, (x_, y_), (x_ + w_, y_ + h_), (0, 255, 255), 1)



                else:
                    self.objects=current_boxes
                # for match in matches:
                #     mathced_prev,match_current=match
                #     self.objects[mathced_prev]=current_boxes[match_current]
                #     cv2.rectangle(last_frame, (x, y), (x + w, y + h), (255, 255, 0), 1)
                #     cv2.putText(last_frame, str(index), (x, y), cv2.FONT_HERSHEY_SIMPLEX, 0.2, 255)
                #     # matches.append(current_boxes[best_match])
                #     cv2.putText(copy_frm, str(round(distances[best_match],2))+' '+str(index)+' '+str(round(float(dist_centroids),2)),
                #                 (cX, cY), cv2.FONT_HERSHEY_SIMPLEX, 0.2, 255)
                #
                #     cv2.rectangle(copy_frm, (x_, y_), (x_ + w_, y_ + h_), (0, 255, 255), 1)
                #     stacked = numpy.hstack((last_frame, copy_frm))
                #     cv2.imshow('frame_img', cv2.resize(stacked, (800, 800)))
                #     key = cv2.waitKey(15) & 0xFF
                # self.objects = current_boxes
                # self.object_ereas=cont_areas
                if self.display:
                    stacked = numpy.hstack((last_frame, copy_frm))
                    cv2.imshow('frame_img', cv2.resize(stacked, (800, 800)))
                    key = cv2.waitKey(15) & 0xFF
                    print('')
                # if len(cont_areas)>0:
                #     print(numpy.max(cont_areas))
                # curr_bw = cv2.cvtColor(frame_img, cv2.COLOR_BGR2GRAY)
                # last_bw = cv2.cvtColor(self.last_frame, cv2.COLOR_BGR2GRAY)
                #
                # # Some calculation to determine canny thresholds
                # curr_median = numpy.median(curr_bw)
                # last_median = numpy.median(last_bw)
                # sigma = 0.33
                # curr_low = int(max(0, (1.0 - sigma) * curr_median))
                # last_low = int(max(0, (1.0 - sigma) * last_median))
                # curr_high = int(min(255, (1.0 + sigma) * curr_median))
                # last_high = int(min(255, (1.0 + sigma) * last_median))
                #
                # # Do our Canny edge detection
                # curr_edges = cv2.Canny(curr_bw, curr_low, curr_high)
                # last_edges = cv2.Canny(last_bw, last_low, last_high)
                #
                # # Estimate the motion in the frame using skvideo
                # r_dist = self.r_dist
                # disp = globalEdgeMotion(numpy.array(last_edges, dtype=bool),
                #                         numpy.array(curr_edges, dtype=bool),
                #                         r=r_dist,
                #                         method='hamming')
                #
                # # Translate our current frame to line it up with previous frame
                # curr_edges = numpy.roll(curr_edges, disp[0], axis=0)
                # curr_edges = numpy.roll(curr_edges, disp[1], axis=1)
                #
                # # Calculate fraction of edge pixels changing using scipy
                # r_iter = 6  # Number of morphological operations performed
                # p_in = self._percentage_distance(last_edges, curr_edges, r_iter)
                # p_out = self._percentage_distance(curr_edges, last_edges, r_iter)
                # p_max = numpy.max((p_in, p_out))
                #
                if self.stats_manager is not None and len(matches)>0:
                    self.stats_manager.set_metrics(frame_num, {
                        metric_keys[0]: len(matches)
                        # metric_keys[1]: numpy.max(cont_areas),
                        # metric_keys[2]: numpy.min(cont_areas)
                                                   })

            if len(matches) > 0:
                if self.last_scene_cut is None or (
                        (frame_num - self.last_scene_cut) >= self.min_scene_len):
                    cut_list.append(frame_num)
                    self.last_scene_cut = frame_num
                self.last_frames.append(frame_img)

            if self.last_frame is not None and self.last_frame is not _unused:
                del self.last_frame

        # If we have the next frame computed, don't copy the current frame
        # into last_frame since we won't use it on the next call anyways.
        if (self.stats_manager is not None and
                self.stats_manager.metrics_exist(frame_num + 1, metric_keys)):
            self.last_frame = _unused
        else:
            self.last_frame = frame_img.copy()

        return cut_list

    # def post_process(self, frame_num):
    #    """ Not used for EdgeDetector, as unlike ThresholdDetector, cuts
    #    are always written as they are found.
    #    """
    #    return []