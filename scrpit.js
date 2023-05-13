//here using "faceapi.js" api for face detection
//load models from the models folder and then only start the webcam
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),//here 
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
]).then(startWebcam);//this line calling startWebCam function


//startWebCam function; this will start the camera.
function startWebcam() {
    navigator.mediaDevices.getUserMedia({
        video: true, //only video permission is accessed
        audio: false, //audio is not permitted
    })
        .then((stream) => { //if successful then execute this and show video/image to screen
            video.srcObject = stream;
        })
        .catch((error) => { //if not then throw error
            console.error(error);
        });
}

//here making a canvas
//which is having a blue box structure
video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);

    //resizing blue box 5 times cause of small size
    faceapi.matchDimensions(canvas, { height: 5 * video.height, width: 5 * video.width });


    //detecting faces 
    //here detectAllFaces() is detecting all possible faces in camera
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());

        //this is showing the aleart messeges
        document.getElementById("showText").innerHTML = ""; //clearing the outputs before showing others.

        //declaring constant as length of declarations
        const numberOfStudents = detections.length;

        //more than one face alert
        function moreThanOneFace() {
            document.getElementById("showText").innerHTML += "Aleart! More Than One Face Detected!! Number Of Faces : ";
            document.getElementById("showText").innerHTML += numberOfStudents; //giving numbers of faces detected
        }

        //only one face alert
        function onlyOneFace() {
            document.getElementById("showText").innerHTML += "Only One Face Detected!";
        }

        //no faces alert
        function noFace() {
            document.getElementById("showText").innerHTML += "No Face Detected!";
        }

        //resizing resize-detections or blue box 5 times. 
        const resizeDetections = faceapi.resizeResults(detections, { height: 5 * video.height, width: 5 * video.width });

        //declaring 2d box (blue boxes)
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        //drawing on canvas
        faceapi.draw.drawDetections(canvas, resizeDetections);

        //more than one face alert
        if (detections.length > 1) {
            console.log("Two face Detected");
            moreThanOneFace();
        }
        //only one face alert
        else if (detections.length == 1) {
            console.log("One Face Detected");
            onlyOneFace();
        }
        //no faces alert
        else {
            console.log("No Face Detected");
            noFace();
        }


    }, 1000)//repeat this every 1000ms

})