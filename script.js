// Background animation
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('background').appendChild(renderer.domElement);

const geometry = new THREE.BufferGeometry();
const vertices = [];
for (let i = 0; i < 10000; i++) {
    vertices.push(THREE.MathUtils.randFloatSpread(2000)); // x
    vertices.push(THREE.MathUtils.randFloatSpread(2000)); // y
    vertices.push(THREE.MathUtils.randFloatSpread(2000)); // z
}
geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

const particles = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0x00ffff }));
scene.add(particles);

camera.position.z = 1000;

function animate() {
    requestAnimationFrame(animate);
    particles.rotation.x += 0.0005;
    particles.rotation.y += 0.0005;
    renderer.render(scene, camera);
}
animate();

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Section visibility
const sections = document.querySelectorAll('section');
const options = {
    root: null,
    threshold: 0.1,
    rootMargin: "-10px"
};

const observer = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, options);

sections.forEach(section => {
    observer.observe(section);
});

// Certificate modal
const modal = document.getElementById('certificate-modal');
const modalImg = document.getElementById('certificate-image');
const closeModal = document.getElementsByClassName('close-modal')[0];

document.querySelectorAll('.view-certificate').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        modal.style.display = 'block';
        modalImg.src = this.getAttribute('data-certificate');
    });
});

closeModal.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Handle window resize
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

