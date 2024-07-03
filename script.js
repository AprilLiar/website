// Carousel functionality
let currentIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.style.transform = `translateX(${(i - index) * 100}%)`;
    });
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
}

// Automatically change slides every 3 seconds
setInterval(nextSlide, 3000);

// Initial display
showSlide(currentIndex);

// Spin Wheel functionality
const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const popup = document.getElementById('popup');
const closePopup = document.querySelector('.close');
const resultText = document.getElementById('resultText');

const segments = ['10% Off', '20% Off', '30% Off', '40% Off', '50% Off', 'Try Again'];
const segmentColors = ['#FFD700', '#B8860B', '#FFD700', '#B8860B', '#FFD700', '#B8860B']; // Gold and dark gold colors
const segmentAngle = (2 * Math.PI) / segments.length;
let startAngle = 0;
let isSpinning = false;
let spinTimeout;

// Promo codes for each discount
const promoCodes = {
    '10% Off': ['10OFF123', '10OFF456', '10OFF789'],
    '20% Off': ['20OFF123', '20OFF456', '20OFF789'],
    '30% Off': ['30OFF123', '30OFF456', '30OFF789'],
    '40% Off': ['40OFF123', '40OFF456', '40OFF789'],
    '50% Off': ['50OFF123', '50OFF456', '50OFF789'],
    'Try Again': ['TRYAGAIN123', 'TRYAGAIN456', 'TRYAGAIN789']
};

function drawWheel() {
    for (let i = 0; i < segments.length; i++) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, startAngle + i * segmentAngle, startAngle + (i + 1) * segmentAngle);
        ctx.fillStyle = segmentColors[i];
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(startAngle + i * segmentAngle + segmentAngle / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#000';
        ctx.fillText(segments[i], canvas.width / 4, 0);
        ctx.restore();
    }
}

function easeOutQuad(t) {
    return t * (2 - t);
}

function spinWheel() {
    if (isSpinning) return;

    isSpinning = true;
    const totalSpinTime = Math.random() * 10 + 12; // Random spin time between 12 and 22 seconds
    const maxSpinSpeed = Math.random() * 5 + 5; // Random spin speed
    let spinTime = 0;

    function animateSpin() {
        spinTime += 0.05;
        const timeFraction = spinTime / totalSpinTime;
        const easedFraction = easeOutQuad(timeFraction);

        if (timeFraction < 1) {
            spinAngle = maxSpinSpeed * (1 - easedFraction);
            startAngle += spinAngle * Math.PI / 180;
            drawWheel();
            spinTimeout = requestAnimationFrame(animateSpin);
        } else {
            cancelAnimationFrame(spinTimeout);
            isSpinning = false;
            showResult();
        }
    }

    animateSpin();
}

function showResult() {
    const endAngle = startAngle % (2 * Math.PI);
    const topSegmentIndex = Math.floor((((2 * Math.PI - endAngle + Math.PI / 2) % (2 * Math.PI) / segmentAngle) + Math.PI) % (2 * Math.PI));
    const selectedSegment = segments[topSegmentIndex];
    const codes = promoCodes[selectedSegment];
    const randomCode = codes[Math.floor(Math.random() * codes.length)];
    resultText.textContent = `You won: ${selectedSegment}! Your promo code is: ${randomCode}`;
    popup.style.display = 'block';
}

closePopup.onclick = function() {
    popup.style.display = 'none';
};

window.onclick = function(event) {
    if (event.target == popup) {
        popup.style.display = 'none';
    }
};

drawWheel();
spinButton.addEventListener('click', spinWheel);
