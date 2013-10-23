var myStream, pc2;

function gotStream(stream) {

  // Audio setup
  // window.AudioContext = window.AudioContext || window.webkitAudioContext;
  // var audioContext = new AudioContext();
  
  // var mediaStreamSource = audioContext.createMediaStreamSource(stream);
  // mediaStreamSource.connect(audioContext.destination);

  // Video setup
  var video = document.querySelector('video');
  video.src = window.URL.createObjectURL(stream);

  myStream = new webkitRTCPeerConnection({
    "iceServers": [{ "url": "stun:stun.l.google.com:19302" }],
    "onaddstream": function() {
      debugger;
    }
  });

  myStream.addStream(stream);

  $.getJSON('/room', function(data) {
    if (data.room === false) {
      setupP2P(myStream);
    } else {
      connectP2P(myStream, data.room);
    }
  });
}

function setupP2P(myStream) {
  myStream.createOffer(function(sessionDescription) {
    myStream.setLocalDescription(sessionDescription);

    $.post('/announce', sessionDescription);

    checkAcknowledged(myStream);

  }, null, { 'mandatory': { 'OfferToReceiveAudio': false, 'OfferToReceiveVideo': true } });
}

function checkAcknowledged(myStream) {
  $.getJSON('/hasAcknowledged', function(data) {
    if (data.acknowledged) {
      myStream.setRemoteDescription(new RTCSessionDescription(data.acknowledged));
    } else {
      setTimeout(function() {
        checkAcknowledged(myStream);
      }, 1000);
    }
  });
}

function connectP2P(myStream, sdp) {
  myStream.setRemoteDescription(new RTCSessionDescription(sdp));

  myStream.createAnswer(function(sessionDescription) {
    myStream.setLocalDescription(sessionDescription);

    $.post('/acknowledged', sessionDescription);

  }, null, { 'mandatory': { 'OfferToReceiveAudio': false, 'OfferToReceiveVideo': true } });
}


function loadMedia() {
  navigator.webkitGetUserMedia({ audio: false, video: true }, gotStream);
}

loadMedia();
