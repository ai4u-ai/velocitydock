import glob
import math
import os
import pickle

import cv2
import imutils
from imutils import contours
from argparse import Namespace

from filereader import ReadAnnoError

basepath = '/Users/ivanjacobs/Documents/development/deme/'
def convert_coordiates(image,annotation):
    newX = float(image.shape[1])
    newY = float(image.shape[0])
    oldX = float(annotation['origSize']['width'])
    oldY = float(annotation['origSize']['height'])
    selector = Namespace(**annotation['objectSelector'])
    x1 = int(selector.x1)
    x2 = int(selector.x2)
    y1 = int(selector.y1)
    y2 = int(selector.y2)
    class_label = annotation['objectSelector']['class']['name']
    x1, y1 = recalc_coordinates(newX=newX, newY=newY, oldX=oldX, oldY=oldY, x=x1, y=y1)
    x2, y2 = recalc_coordinates(newX=newX, newY=newY, oldX=oldX, oldY=oldY, x=x2, y=y2)
    return (x1,y1,x2,y2)

def list_annotations():

    filepath = os.path.abspath(os.path.join(basepath,'conversion/annotations'))
    # os.chdir(filepath)find_all_classes
    return [os.path.abspath(os.path.join(filepath,anno)) for anno in glob.glob(os.path.join(filepath,"*.p"))]
def read_annotations():
    annotations=[]
    for annotation in list_annotations():
        try:
            with (open(annotation,"rb")) as openfile:
                yield pickle.load(openfile)
        except Exception as err:
           raise ReadAnnoError(err,err,annotation)
def find_all_classes():
    classess = {}
    for annotations in read_annotations():
        for index, annotation in enumerate(annotations['annotation']):
            classess[annotation['objectSelector']['class']['name']] = annotation['objectSelector']['class']['name']
    return list(classess.keys())
def save_xml(folder, index, xml):
    if not os.path.exists(folder):
        os.makedirs(folder)
    with open(os.path.join(folder, str(index).zfill(5) + ".xml"), 'w')as file:
        file.write(xml.decode("utf-8"))
        file.close()


def save_image(folder, index, class_label, image):
    if not os.path.exists(folder):
        os.makedirs(folder)
    return cv2.imwrite(os.path.join(folder, str(index).zfill(5) + ".jpg"), image)


def recalc_coordinates(oldX, oldY, newX, newY, x, y):
    Rx = newX / oldX
    Ry = newY / oldY
    return (int(Rx * x), int(Ry * y))

def msToTime(duration) :
    milliseconds = int((duration%1000)/100)
    print(milliseconds)
    seconds = int((duration/1000)%60)
    print(seconds)
    minutes = int((duration/(1000*60))%60)
    print(seconds)
    hours = int((duration/(1000*60*60))%24)

    hours = "0" + str(hours) if hours < 10   else str(hours)
    minutes ="0" + str(minutes) if (minutes < 10) else  str(minutes)
    seconds ="0" + str(seconds) if (seconds < 10) else str(seconds)

    return hours + ":" + minutes + ":" + seconds + "." + str(milliseconds)
def round_to_frame_interval(miliseconds,fps):
    milisedonds_per_frame = (1000 / fps)
    return  math.ceil(miliseconds / milisedonds_per_frame) * milisedonds_per_frame


def miliseconds_to_framenumber(milliseconds,fps):
    rounded_miliseconds_to_framerate=round_to_frame_interval(milliseconds,fps)
    frame_number=rounded_miliseconds_to_framerate*fps/1000
    return int(frame_number)
def in_area(box,area):

    (x, y, w, h) =box

    (x1, y1, x2,y2) = area

    in_area=x1 < x and x1 < x + w and x2 > x + w and y1 < y and y1 < y + h and y2 > y and y2 > y + h

    return in_area

def get_bounding_boxes_rel_area(image,area,threshold=150):
    cnts=edge_detection(image)

    boxes_in=[box for box in get_bunding_boxes_from_contour(cnts,threshold) if in_area(box,area)]

    boxes_out = [box for box in get_bunding_boxes_from_contour(cnts, threshold) if not in_area(box, area)]
    return boxes_in,boxes_out

def get_bunding_boxes_from_contour(cnts,threshold=150):
    boxes=[]
    for c in cnts:
        if cv2.contourArea(c) < threshold:
            continue

        boxes.append(cv2.boundingRect(c))

    return  boxes



def edge_detection(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray, (1, 1), 0)

    # perform edge detection, then perform a dilation + erosion to
    # close gaps in between object edges
    edged = cv2.Canny(gray, 50, 100)
    edged = cv2.dilate(edged, None, iterations=1)
    edged = cv2.erode(edged, None, iterations=1)

    # find contours in the edge map
    cnts = cv2.findContours(edged.copy(), cv2.RETR_EXTERNAL,
                            cv2.CHAIN_APPROX_SIMPLE)
    cnts = cnts[0] if imutils.is_cv2() else cnts[1]

    # sort the contours from left-to-right and initialize the bounding box
    # point colors
    (cnts, _) = contours.sort_contours(cnts)
    return cnts

def get_moving_objects(firstFrame, secondFrame, threshold=800):

    firstFrame = cv2.cvtColor(firstFrame, cv2.COLOR_BGR2GRAY)
    firstFrame = cv2.GaussianBlur(firstFrame, (1, 1), 0)
    secondgrayFrame= cv2.cvtColor(secondFrame, cv2.COLOR_BGR2GRAY)
    secondgrayFrame = cv2.GaussianBlur(secondgrayFrame, (1, 1), 0)
    # firstFrameGr = cv2.cvtColor(first, cv2.COLOR_BGR2GRAY)
    # firstFrame = cv2.GaussianBlur(firstFrameGr, (21, 21), 0)
    # compute the absolute difference between the current frame and
    # first frame
    frameDelta = cv2.absdiff(firstFrame, secondgrayFrame)
    thresh = cv2.threshold(frameDelta, 25, 255, cv2.THRESH_BINARY)[1]

    # dilate the thresholded image to fill in holes, then find contours
    # on thresholded image
    thresh = cv2.dilate(thresh, None, iterations=2)
    cnts = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL,
                            cv2.CHAIN_APPROX_SIMPLE)
    cnts = cnts[0] if imutils.is_cv2() else cnts[1]
    # sort the contours from left-to-right and initialize the
    # 'pixels per metric' calibration variable
    # if len(cnts)==0:
    #     continue
    (cnts, _) = contours.sort_contours(cnts, method='top-to-bottom')
    pixelsPerMetric = None
    text = ""

    # embeddings=[]
    # if len(cnts)>0:
    #     embeddings = get_ebmeddings(cnts,frame)
    rects = []
    cont_areas=[]
    for c in cnts:

        # if the contour is too small, ignore it
        # print(cv2.contourArea(c))
        if cv2.contourArea(c) < threshold:
            continue
        cont_areas.append(cv2.contourArea(c))
        # compute the bounding box for the contour, draw it on the frame,
        # and update the text

        (x, y, w, h) = cv2.boundingRect(c)

        rects.append((x, y, w, h))
    return rects,cont_areas