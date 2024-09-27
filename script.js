// Variable declarations
const video = document.getElementById('video'),
	resultText = document.getElementById('speech-script'),
	heartDiv = document.getElementById('heartbeat-wrap'),
	titleH1 = document.getElementById('title'),
	heart = document.getElementById('heartbeat'),
	heartFlyContainer = document.getElementById("heartfly-wrap");
let timer;

// Start camera
async function startCamera() {
	try {
		const stream = await navigator.mediaDevices.getUserMedia({ video: true });
		video.srcObject = stream;
	} catch (error) {
		console.error("Error accessing the camera: ", error);
	}
}

// Speech recognition
function startRecognition() {
	const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
	recognition.lang = 'ja-JP';
	recognition.interimResults = true;
	recognition.continuous = true;

	let finalTranscript = '';

	recognition.onresult = (event) => {
		let interimTranscript = '';
		for (let i = event.resultIndex; i < event.results.length; i++) {
			let transcript = event.results[i][0].transcript;

			if (event.results[i].isFinal) {
				finalTranscript += transcript;
			} else {
				interimTranscript = transcript;
			}

			checkTranscript(transcript);
		}
		resultText.innerHTML = `${finalTranscript}<i style="color:#ddd;">${interimTranscript}</i>`;

		// Reset
		if (finalTranscript.length >= 100) {
			finalTranscript = '';
		}
	}

	recognition.start();
}

// Check transcript and show heart
function checkTranscript(transcript) {
	if (transcript.includes('愛してる') || transcript.includes('愛している') || transcript.includes('一番好き')) {
		showHeart(0.65, "キュン！ありがとう！", "", 300, "heartbeat 0.7s", 4000);
		createHearts(30);
		showLove(7000);
	} else if (transcript.includes('君が好き') || transcript.includes('大好き')) {
		showHeart(0.5, "ありがとう！", "ありがとう！", 250, "heartbeat 1s", 6000);
	} else if (transcript.includes('好き')) {
		showHeart(0.3, "え！私のこと？！", "「好き」と言ってみて！", 120, "pulse 1s", 5000);
	}
}

// Show Heart
function showHeart(bgOpacity, firstText, lastText, heartSize, heartAnimation, duration) {
	heartDiv.style.opacity = 1;
	heartDiv.style.background = `radial-gradient(rgba(255, 142, 189, 0), rgba(255, 142, 189, ${bgOpacity}))`;
	titleH1.innerText = firstText;
	titleH1.style.textShadow = "none";
	heart.style.width = heartSize + "px";
	heart.style.animation = `${heartAnimation} ease infinite`;

	clearTimeout(timer);
	timer = setTimeout(() => {
		heartDiv.style.opacity = 0;
		titleH1.innerText = lastText;
	}, duration);
}

// Show Love
function showLove(duration) {
	clearTimeout(timer);
	timer = setTimeout(() => {
		removeHearts();
		heartDiv.style.opacity = 0;
		titleH1.style.animation = "fade-in 2s ease-in-out";
		titleH1.innerHTML = `実は私も好きだよ！
		<div id="floating-heart-wrap">
			<div class="heart floating-heart"></div>
			<div class="heart floating-heart"></div>
			<div class="heart floating-heart"></div>
		</div>`;
		titleH1.style.textShadow = "#ff8ebd 0 0 30px";
		let heartFloatContainer = document.getElementById("floating-heart-wrap");
		heartFloatContainer.style.opacity = 1;
	}, duration);
}

// ---- For Flying In Hearts ----
function random(num) {
	return Math.floor(Math.random() * num);
}

function getRandomStyles() {
	var mt = random(200);
	let ml = random(50);
	let dur = random(5) + 2;
	return `
  margin: ${mt}px 0 0 ${ml}px;
  animation: float ${dur}s ease-in infinite;
  `;
}

function createHearts(num) {
	for (let i = num; i > 0; i--) {
		let heart = document.createElement("div");
		heart.className = "heart";
		heart.style.cssText = getRandomStyles();
		heartFlyContainer.append(heart);
	}
}

function removeHearts() {
	heartFlyContainer.style.opacity = 0;
	setTimeout(() => {
		heartFlyContainer.remove()
	}, 500)
}
// ------------------------

// Start camera and recognition on window load
window.onload = () => {
	startCamera();
	startRecognition();
};