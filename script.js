const video = document.getElementById('video');
const startBtn = document.getElementById('startBtn');
const retryBtn = document.getElementById('retryBtn');
const downloadBtn = document.getElementById('downloadBtn');
const canvases = [
  document.createElement('canvas'),
  document.createElement('canvas'),
  document.createElement('canvas'),
  document.createElement('canvas')
];
const countdown = document.getElementById('countdown');
const actionButtons = document.getElementById('action-buttons');

let stream;

// 웹캠 시작
async function startCamera() {
  stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
}

// 캡처
function captureToCanvas(index) {
  const canvas = canvases[index];
  const ctx = canvas.getContext('2d');
  canvas.width = 240;
  canvas.height = 180;
  ctx.drawImage(video, 0, 0, 240, 180);
}

function updateFinalImages() {
  const imgs = [img1, img2, img3, img4];
  for (let i = 0; i < 4; i++) {
    imgs[i].src = canvases[i].toDataURL();
  }
  document.getElementById('final-output').style.display = 'block';
  actionButtons.style.display = 'block';
}

// 카운트다운
function startCountdown(seconds) {
  return new Promise(resolve => {
    let count = seconds;
    countdown.textContent = count;
    const interval = setInterval(() => {
      count--;
      countdown.textContent = count;
      if (count <= 0) {
        clearInterval(interval);
        countdown.textContent = '';
        resolve();
      }
    }, 1000);
  });
}

// 최종 캡처 → 다운로드
function captureFinalImage() {
  html2canvas(document.getElementById('capture-area')).then(canvas => {
    const link = document.createElement('a');
    link.download = '삼반네컷.png';
    link.href = canvas.toDataURL();
    link.click();
  });
}

// 버튼 이벤트
startBtn.addEventListener('click', async () => {
  startBtn.disabled = true;
  for (let i = 0; i < 4; i++) {
    await startCountdown(10);
    captureToCanvas(i);
  }
  updateFinalImages();
  actionButtons.style.display = 'block';
});

retryBtn.addEventListener('click', () => {
  for (let canvas of canvases) {
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  }
  startBtn.disabled = false;
  actionButtons.style.display = 'none';
});

downloadBtn.addEventListener('click', () => {
  captureFinalImage();
});

startCamera();
