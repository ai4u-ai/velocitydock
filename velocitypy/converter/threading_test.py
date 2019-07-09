from argparse import Namespace
import pickle
import threading
import time
import queue
import cv2
import imutils
import utils

frames = queue.Queue()

class ImageGrabber(threading.Thread):
    def __init__(self, path,time):
        threading.Thread.__init__(self)
        self.path=path
        self.vidcap=cv2.VideoCapture(path)
        self.time=time
    def run(self):
        global frames
        self.vidcap.set(cv2.CAP_PROP_POS_MSEC, self.time - 500)
        # just cue to 20 sec. position
        success, firstFrame = self.vidcap.read()
        self.vidcap.set(cv2.CAP_PROP_POS_MSEC, self.time)
        ret,frame=self.vidcap.read()
        firstFrame = cv2.cvtColor(firstFrame, cv2.COLOR_BGR2GRAY)
        firstFrame = cv2.GaussianBlur(firstFrame, (21, 21), 0)
        # image = cv2.resize(image, (416, 416))
        # print(image.shape[:2])
        self.vidcap.set(cv2.CAP_PROP_POS_MSEC, annotation['currentTime'])
        flag, frame = self.vidcap.read()
        # The frame is ready and already captured

        # frame = imutils.resize(frame, width=6000)
        # cells_first = utils.split(first_l)
        # cells_second = utils.split(frame_l)
        print(self.vidcap.get(cv2.CAP_PROP_POS_MSEC))

        # frame = imutils.resize(frame, width=1800)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        gray = cv2.GaussianBlur(gray, (21, 21), 0)
        # if the first frame is None, initialize it

        # firstFrameGr = cv2.cvtColor(first, cv2.COLOR_BGR2GRAY)
        # firstFrame = cv2.GaussianBlur(firstFrameGr, (21, 21), 0)
        # compute the absolute difference between the current frame and
        # first frame
        frameDelta = cv2.absdiff(firstFrame, gray)
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
        # (cnts, _) = contours.sort_contours(cnts, method='top-to-bottom')
        pixelsPerMetric = None
        text = ""

        # embeddings=[]
        # if len(cnts)>0:
        #     embeddings = get_ebmeddings(cnts,frame)

        oldX = int(annotation['origSize']['width'])
        oldY = int(annotation['origSize']['height'])
        selector = Namespace(**annotation['objectSelector'])
        x1 = int(selector.x1)
        x2 = int(selector.x2)
        y1 = int(selector.y1)
        y2 = int(selector.y2)
        class_label = annotation['objectSelector']['class']['name']

        anno = {}

        anno['folder'] = 'images'
        anno['filename'] = str(index).zfill(5) + ".jpg"
        anno['size'] = {}
        anno['size']['width'] = str(frame.shape[1])
        anno['size']['height'] = str(frame.shape[0])
        newX = int(frame.shape[1])
        newY = int(frame.shape[0])

        x1, y1 = utils.recalc_coordinates(newX=newX, newY=newY, oldX=oldX, oldY=oldY, x=x1, y=y1)
        x2, y2 = utils.recalc_coordinates(newX=newX, newY=newY, oldX=oldX, oldY=oldY, x=x2, y=y2)
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 255), 2)

        rects = []
        for c in cnts:

            # if the contour is too small, ignore it
            if cv2.contourArea(c) < 5:
                continue

            # compute the bounding box for the contour, draw it on the frame,
            # and update the text

            (x, y, w, h) = cv2.boundingRect(c)
            # check intersect
            if x1 < x and x1 < x + w and x2 > x + w and y1 < y and y1 < y + h and y2 > y and y2 > y + h:



            else:
                print('not in')
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            rects.append((int(x), int(y), int(x + w), int(y + h)))

        frames.put({'frame':frame,'time':str(self.time)})
            # time.sleep(0.1)


class Main(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)

    def run(self):
        global frames
        while True:
            if(not frames.empty()):
                self.Currframe=frames.get()
                cv2.imwrite(self.Currframe['time']+'.jpeg', cv2.resize( self.Currframe['frame'], (800, 800)))

                print('got frame '+self.Currframe['time'])
            ##------------------------##
            ## your opencv logic here ##
            ## -----------------------##



main = Main()
grabbers=[]
main.start()

with (open('5b653a6e5b7c4e81330de4ca.p', "rb")) as openfile:
        annotations= pickle.load(openfile)
        for index, annotation in enumerate(annotations['annotation'][5:8]):
            print('iterating  '+str(annotations['_id'])+' '+str(index))
            grabber = ImageGrabber(
                '/Volumes/LaCie/deme/DEME_Object_Recognition_VIDEOS/Object_Recognition/2018-07-04/vids/2018-07-04.mp4',annotation['currentTime'])

            # grabber.start()
            grabbers.append(grabber)


for grabber in grabbers:
    # grabber.start()
    print('start')
    grabber.start()
for grabber in grabbers:
    # grabber.start()
    grabber.join()

main.join()
