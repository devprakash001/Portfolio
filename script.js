// Mobile Navigation Toggle
const navToggle = document.getElementById("nav-toggle")
const navMenu = document.getElementById("nav-menu")
const navLinks = document.querySelectorAll(".nav-link")
const body = document.body

// Toggle mobile menu
navToggle.addEventListener("click", (e) => {
  e.stopPropagation()
  navMenu.classList.toggle("active")
  navToggle.classList.toggle("active")

  // Prevent body scroll when menu is open
  if (navMenu.classList.contains("active")) {
    body.style.overflow = "hidden"
  } else {
    body.style.overflow = "auto"
  }
})

// Close mobile menu when clicking on a link
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active")
    navToggle.classList.remove("active")
    body.style.overflow = "auto"
  })
})

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
    navMenu.classList.remove("active")
    navToggle.classList.remove("active")
    body.style.overflow = "auto"
  }
})

// Background animation
let scene, camera, renderer, particles
const THREE = window.THREE // Declare the THREE variable

function getParticleCount() {
  const width = window.innerWidth
  if (width < 480) return 2000 // Very small screens
  if (width < 768) return 3000 // Mobile
  if (width < 1024) return 5000 // Tablet
  return 8000 // Desktop
}

function getParticleSize() {
  const width = window.innerWidth
  if (width < 480) return 0.8
  if (width < 768) return 1
  return 1.5
}

function initThreeJS() {
  try {
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: window.innerWidth > 768,
      powerPreference: "high-performance",
    })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const backgroundElement = document.getElementById("background")
    if (backgroundElement) {
      backgroundElement.appendChild(renderer.domElement)
    }

    const geometry = new THREE.BufferGeometry()
    const vertices = []
    const particleCount = getParticleCount()

    for (let i = 0; i < particleCount; i++) {
      vertices.push(THREE.MathUtils.randFloatSpread(2000)) // x
      vertices.push(THREE.MathUtils.randFloatSpread(2000)) // y
      vertices.push(THREE.MathUtils.randFloatSpread(2000)) // z
    }

    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3))

    particles = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        color: 0x00ffff,
        size: getParticleSize(),
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      }),
    )

    scene.add(particles)
    camera.position.z = 1000

    animate()
  } catch (error) {
    console.warn("Three.js initialization failed:", error)
  }
}

function animate() {
  requestAnimationFrame(animate)

  if (particles) {
    particles.rotation.x += 0.0003
    particles.rotation.y += 0.0005
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}

// Smooth scrolling
function smoothScrollTo(target) {
  const element = document.querySelector(target)
  if (element) {
    const headerOffset = 80
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    })
  }
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    smoothScrollTo(this.getAttribute("href"))
  })
})

// Section visibility with Intersection Observer
const sections = document.querySelectorAll(".section")
const observerOptions = {
  root: null,
  threshold: 0.1,
  rootMargin: "-50px 0px -50px 0px",
}

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible")
    }
  })
}, observerOptions)

sections.forEach((section) => {
  sectionObserver.observe(section)
})

// Certificate modal
const modal = document.getElementById("certificate-modal")
const modalImg = document.getElementById("certificate-image")
const closeModal = document.querySelector(".close-modal")
const modalOverlay = document.querySelector(".modal-overlay")

function openModal(imageSrc) {
  modal.classList.add("active")
  modal.style.display = "flex"
  modalImg.src = imageSrc
  body.style.overflow = "hidden"

  // Focus management for accessibility
  closeModal.focus()
}

function closeModalFunc() {
  modal.classList.remove("active")
  modal.style.display = "none"
  body.style.overflow = "auto"
}

document.querySelectorAll(".view-certificate").forEach((button) => {
  button.addEventListener("click", function (e) {
    e.preventDefault()
    const certificateImage = this.getAttribute("data-certificate")
    openModal(certificateImage)
  })
})

if (closeModal) {
  closeModal.addEventListener("click", closeModalFunc)
}

if (modalOverlay) {
  modalOverlay.addEventListener("click", closeModalFunc)
}

// Keyboard navigation for modal
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("active")) {
    closeModalFunc()
  }
})

// Handle window resize
function handleResize() {
  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }
}

// Debounce resize events for better performance
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

const debouncedResize = debounce(handleResize, 250)
window.addEventListener("resize", debouncedResize)

// Performance optimization for mobile devices
function isMobileDevice() {
  return (
    window.innerWidth <= 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  )
}

function isLowEndDevice() {
  return navigator.hardwareConcurrency <= 2 || navigator.deviceMemory <= 2 || window.innerWidth <= 480
}

// Performance optimizations based on device capabilities
function optimizeForDevice() {
  if (isLowEndDevice()) {
    // Reduce animation complexity for low-end devices
    document.documentElement.style.setProperty("--animation-duration", "0.2s")

    // Disable some visual effects
    const cards = document.querySelectorAll(".card")
    cards.forEach((card) => {
      card.style.backdropFilter = "none"
    })
  }
}

// Loading Screen Management
const loadingScreen = document.getElementById("loading-screen")

function hideLoadingScreen() {
  if (loadingScreen) {
    loadingScreen.classList.add("hidden")
    setTimeout(() => {
      loadingScreen.style.display = "none"
    }, 500)
  }
}

// Initialize everything when page loads
window.addEventListener("load", () => {
  // Initialize Three.js if available
  if (typeof THREE !== "undefined") {
    initThreeJS()
  }

  // Apply device optimizations
  optimizeForDevice()

  // Hide loading screen
  setTimeout(hideLoadingScreen, 1000)

  // Add loaded class to body
  body.classList.add("loaded")
})

// Lazy loading for images
function lazyLoadImages() {
  const images = document.querySelectorAll("img[data-src]")
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.removeAttribute("data-src")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))
}

// Initialize lazy loading
lazyLoadImages()

// Enhanced touch support for mobile devices
if (isMobileDevice()) {
  // Add touch-friendly classes
  document.body.classList.add("touch-device")

  // Prevent zoom on double tap for buttons
  const buttons = document.querySelectorAll("button, .cta-button, .nav-link")
  buttons.forEach((button) => {
    button.addEventListener("touchend", (e) => {
      e.preventDefault()
      button.click()
    })
  })
}

// Orientation change handler
window.addEventListener("orientationchange", () => {
  setTimeout(() => {
    handleResize()
    // Recalculate viewport height for mobile browsers
    document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`)
  }, 100)
})

// Set initial viewport height
document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`)

// Error handling for Three.js
window.addEventListener("error", (e) => {
  if (e.message.includes("WebGL") || e.message.includes("Three")) {
    console.warn("WebGL/Three.js error detected, falling back to CSS animations")
    document.body.classList.add("no-webgl")
  }
})

// Preload critical resources
function preloadResources() {
  const criticalImages = ["/placeholder.svg?height=300&width=300"]

  criticalImages.forEach((src) => {
    const img = new Image()
    img.src = src
  })
}

preloadResources()

// Analytics and performance monitoring (placeholder)
function trackPerformance() {
  if ("performance" in window) {
    window.addEventListener("load", () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType("navigation")[0]
        console.log("Page load time:", perfData.loadEventEnd - perfData.loadEventStart, "ms")
      }, 0)
    })
  }
}

trackPerformance()

// Service Worker registration (for PWA capabilities)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Uncomment when you have a service worker file
    // navigator.serviceWorker.register("/sw.js")
    //   .then(registration => console.log("SW registered"))
    //   .catch(error => console.log("SW registration failed"))
  })
}

// Accessibility enhancements
function enhanceAccessibility() {
  // Add skip link
  const skipLink = document.createElement("a")
  skipLink.href = "#main"
  skipLink.textContent = "Skip to main content"
  skipLink.className = "skip-link"
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 6px;
    background: var(--primary-color);
    color: var(--bg-color);
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 1000;
    transition: top 0.3s;
  `

  skipLink.addEventListener("focus", () => {
    skipLink.style.top = "6px"
  })

  skipLink.addEventListener("blur", () => {
    skipLink.style.top = "-40px"
  })

  document.body.insertBefore(skipLink, document.body.firstChild)

  // Add main landmark
  const main = document.querySelector("main")
  if (main) {
    main.id = "main"
  }
}

enhanceAccessibility()

console.log("🚀 Portfolio loaded successfully!")
