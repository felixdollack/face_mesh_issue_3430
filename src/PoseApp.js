// App.js
import { useRef, useEffect } from "react";
import * as cam from '@mediapipe/camera_utils';
import Webcam from 'react-webcam';
import * as mediapipeUtils from '@mediapipe/drawing_utils';
import { Pose, POSE_CONNECTIONS } from '@mediapipe/pose'

const solutionOptions = {
    modelComplexity: 1,
    smoothLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
};

function PoseApp() {
    const webcamRef = useRef(0);
    const canvasRef = useRef(0);

    function onPoseResults(results) {
    // Define the canvas elements
    canvasRef.current.width = webcamRef.current.video.videoWidth;
    canvasRef.current.height = webcamRef.current.video.videoHeight;
    // Check for useing the front camera
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");
    // Define the girods here
    // End
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
    mediapipeUtils.drawConnectors(canvasCtx,
      results.poseLandmarks, POSE_CONNECTIONS,
      { color: '#FFFFFF', lineWidth: 2 });
    // The dots are the landmarks
    mediapipeUtils.drawLandmarks(canvasCtx, results.poseLandmarks,
      { color: '#FFFFFF', lineWidth: 2, radius: 2 });
    mediapipeUtils.drawLandmarks(canvasCtx, results.poseWorldLandmarks,
      { color: '#FFFFFF', lineWidth: 2, radius: 2 });
    canvasCtx.restore();
  }

    useEffect(() => {
        var camera = null;
        const pipe = new Pose({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
            }
        });
        pipe.setOptions(solutionOptions);
        pipe.onResults(onPoseResults)

        /* CREATE WEB CAMERA */
        if (typeof webcamRef.current !== "undefined" && webcamRef.current !== null) {
            camera = new cam.Camera(webcamRef.current.video, {
                onFrame: async () => {
                    await pipe.send({ image: webcamRef.current.video })
                },
                width: 1280,
                height: 720
            });
            camera.start();
        }
        return () => {
            pipe.close();
            if (camera) {
                camera = null;
            }
        }
    }, [])

    return (
        <div className="App">
            <Webcam
                ref={webcamRef}
                style={{
                    position: "absolute",
                    marginLeft: "0px",
                    marginRight: "0px",
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    zindex: 9,
                    width: 320,
                    height: 240,
                    marginBottom: "0px",
                }} />
            <canvas
                ref={canvasRef}
                style={{
                    position: "absolute",
                    marginLeft: "0px",
                    marginRight: "0px",
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    zindex: 9,
                    width: 320,
                    height: 240,
                    marginBottom: "0px"
                }}>
            </canvas>
        </div>
    );
}
export default PoseApp;
