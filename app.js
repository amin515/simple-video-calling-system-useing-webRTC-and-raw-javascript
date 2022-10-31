



// global variables
let peerConnection ;
let localStream;
let remoteStream;







// connect webRTC iceCandidate
let server = {
    iceServers : [
         {
            urls : [
                'stun:stun.l.google.com:19302',
                'stun:stun1.l.google.com:19302',
                'stun:stun2.l.google.com:19302'
            ]
         }
    ]
}

// create global connect
const globalConnectInit = async() => {
  
    localStream = await navigator.mediaDevices.getUserMedia({ video : true, audio : true})
    document.getElementById('screen2').srcObject = localStream;
    localStream.getAudioTracks()[0].enabled = false;
}


globalConnectInit()


// create  offer
const createOffer = async () => {

    // create peer connection
    peerConnection = new RTCPeerConnection(server);


    remoteStream = new MediaStream();
    document.getElementById('screen1').srcObject = remoteStream;


    
   //this localstream is remote stream initialised
   //(1)
   localStream.getTracks().forEach( stream => {
     peerConnection.addTrack(stream, localStream);
   })

   // (2)
   peerConnection.ontrack = async ( event ) => {
        event.streams[0].getTracks().forEach( tracks => {
        remoteStream.addTrack(tracks)
     })
   }

  
    
    // check ice candidate
    peerConnection.onicecandidate = async ( event ) => {
      if(event.candidate){
        document.getElementById('offer-sdp').value = JSON.stringify(peerConnection.localDescription) 
      }
    }
    


    // sent offer to targeted switch
    let offer = await peerConnection.createOffer();
    document.getElementById('offer-sdp').value = JSON.stringify(offer);
    await  peerConnection.setLocalDescription(offer);



}





// create  answer
const createAnswer = async () => {

    // create peer connection
    peerConnection = new RTCPeerConnection(server);


    remoteStream = new MediaStream();
    document.getElementById('screen1').srcObject = remoteStream;



   //this localstream is remote stream initialised
   //(1)
   localStream.getTracks().forEach( stream => {
     peerConnection.addTrack(stream, localStream);
   })

   // (2)
   peerConnection.ontrack = async ( event ) => {
        event.streams[0].getTracks().forEach( tracks => {
        remoteStream.addTrack(tracks)
     })
   }

  
    
    // check ice candidate
    peerConnection.onicecandidate = async ( event ) => {
      if(event.candidate){
        document.getElementById('offer-sdp').value = JSON.stringify(peerConnection.localDescription) 
      }
    }
    
    // received offer
    let offer = document.getElementById('offer-sdp').value;
    offer = JSON.parse(offer);
    peerConnection.setRemoteDescription(offer);





    // received offer to targeted switch
    let answer = await peerConnection.createAnswer();
    document.getElementById('answer-sdp').value = JSON.stringify(answer);
    await  peerConnection.setLocalDescription(answer);



}





// add answer

let addAnswer = async() => {
 let answer = document.getElementById('add-asnwer-sdp').value;
     answer = JSON.parse(answer);
     await peerConnection.setRemoteDescription(answer);
}













// click to get offer data
document.getElementById('create-offer').onclick = () => {
    createOffer();
}

// click to get answer data
document.getElementById('answer-offer').onclick = () => {
    createAnswer();
}

// click to add answer

document.getElementById('add-answer').onclick = () => {
  addAnswer();
}


// camera enabled with switch toggle;
let camera_status = true;
document.getElementById('cambtn').onclick = () => {
    camera_status = !camera_status;
    localStream.getVideoTracks()[0].enabled = camera_status;
    document.getElementById('cambtn').classList.toggle('active');
}



// mic enabled with switch toggle;
let mic_status = true;
document.getElementById('micBtn').onclick = () => {
    mic_status = !mic_status;
    localStream.getAudioTracks()[0].enabled = mic_status;
    document.getElementById('micBtn').classList.toggle('active');
}