// App.js
import { useRef, useEffect } from "react";
import * as cam from '@mediapipe/camera_utils';
import Webcam from 'react-webcam';
import * as mediapipeUtils from '@mediapipe/drawing_utils';
import { FaceMesh } from '@mediapipe/face_mesh';

const solutionOptions = {
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
    maxNumFaces: 1
};

function FaceMeshApp() {
    const webcamRef = useRef(0);
    const canvasRef = useRef(0);

    function onFaceMeshResults(results) {
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
        if (results.multiFaceLandmarks.size > 0) {
            for (const landmarks of results.multiFaceLandmarks) {
                console.log(landmarks);
                mediapipeUtils.drawLandmarks(
                    canvasCtx, landmarks,
                    FaceMesh.FACEMESH_TESSELATION,
                    {color: '#FF0000', lineWidth: 0.5}
                );
                mediapipeUtils.drawConnectors(
                    canvasCtx, landmarks,
                    mediapipeUtils.FACEMESH_TESSELATION,
                    {color: '#C0C0C070', lineWidth: 1}
                );
                mediapipeUtils.drawConnectors(
                    canvasCtx, landmarks,
                    mediapipeUtils.FACEMESH_RIGHT_EYE,
                    {color: '#FF3030'}
                );
                mediapipeUtils.drawConnectors(
                    canvasCtx, landmarks,
                    mediapipeUtils.FACEMESH_RIGHT_EYEBROW,
                    {color: '#FF3030'}
                );
                mediapipeUtils.drawConnectors(
                    canvasCtx, landmarks,
                    mediapipeUtils.FACEMESH_RIGHT_IRIS,
                    {color: '#FF3030'}
                );
                mediapipeUtils.drawConnectors(
                    canvasCtx, landmarks,
                    mediapipeUtils.FACEMESH_LEFT_EYE,
                    {color: '#30FF30'}
                );
                mediapipeUtils.drawConnectors(
                    canvasCtx, landmarks,
                    mediapipeUtils.FACEMESH_LEFT_EYEBROW,
                    {color: '#30FF30'}
                );
                mediapipeUtils.drawConnectors(
                    canvasCtx, landmarks,
                    mediapipeUtils.FACEMESH_LEFT_IRIS,
                    {color: '#30FF30'}
                );
                mediapipeUtils.drawConnectors(
                    canvasCtx, landmarks,
                    mediapipeUtils.FACEMESH_FACE_OVAL,
                    {color: '#E0E0E0'}
                );
                mediapipeUtils.drawConnectors(
                    canvasCtx, landmarks,
                    mediapipeUtils.FACEMESH_LIPS,
                    {color: '#E0E0E0'}
                );
            }
        }
        canvasCtx.restore();
    }

    useEffect(() => {
        var camera = null;
        const pipe = new FaceMesh({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
            },
        });
        pipe.setOptions(solutionOptions);
        pipe.onResults(onFaceMeshResults);

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
export default FaceMeshApp;
