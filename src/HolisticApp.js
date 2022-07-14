// App.js
import { useRef, useEffect } from "react";
import * as cam from '@mediapipe/camera_utils';
import Webcam from 'react-webcam';
import * as mediapipeUtils from '@mediapipe/drawing_utils';
import { Holistic } from '@mediapipe/holistic';

const solutionOptions = {
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: false,
    refineFaceLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
};

function HolisticApp() {
    const webcamRef = useRef(0);
    const canvasRef = useRef(0);

    function onHolisticResults(results) {
        // Define the canvas elements
        canvasRef.current.width = webcamRef.current.video.videoWidth
        canvasRef.current.height = webcamRef.current.video.videoHeight
        // Check for useing the front camera
        const canvasElement = canvasRef.current;
        const canvasCtx = canvasElement.getContext("2d")
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(
            results.image, 0, 0, canvasElement.width, canvasElement.height
        )
        // draw
        // does work
        mediapipeUtils.drawLandmarks(
            canvasCtx, results.faceLandmarks, Holistic.FACEMESH_TESSELATION,
            {color: '#FF0000'}
        );
        // does not work
        mediapipeUtils.drawConnectors(
            canvasCtx, results.faceLandmarks, Holistic.FACEMESH_TESSELATION,
            {color: '#C0C0C0', lineWidth: 1}
        );
        canvasCtx.restore();
    }

    useEffect(() => {
        var camera = null;
        const pipe = new Holistic({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
            },
        });
        pipe.setOptions(solutionOptions);
        pipe.onResults(onHolisticResults);

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
export default HolisticApp;
