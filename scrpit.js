
//connecting camera with the help of video id

//load models from the models folder and then only start the webcam
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
]).then(startWebcam);//this line calling startWebCam


//startWebCam function
function startWebcam() {
    navigator.mediaDevices.getUserMedia({ 
        video: true, //only video permission is accessed
        audio: false,
    })
        .then((stream) => { //if successful then execute this
            video.srcObject = stream;
        })
        .catch((error) => { //if not then throw error
            console.error(error);
        });
}

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);

    //resizing detections 5 times
    faceapi.matchDimensions(canvas, { height: 5 * video.height, width: 5 * video.width });

    //repeat this every 100ms
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();

        //resizing resize-detections 5 times. 
        const resizeDetections = faceapi.resizeResults(detections, { height: 5 * video.height, width: 5 * video.width });
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizeDetections);
        console.log(detections);
    }, 100)
})