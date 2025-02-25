const background = document.getElementById('background');

// Mouse movement Handler
document.addEventListener('mousemove', (e) => {
  const { clientX, clientY } = e;

  // Normalize the coordinates
  const xPercent = (clientX / window.innerWidth - 0.5) * 2;
  const yPercent = (clientY / window.innerHeight - 0.5) * 2;

  // Applying the parallax effect
  const moveX = xPercent * 50; // Change to enhance the effect
  const moveY = yPercent * 50;

  background.style.transform = `translate(${moveX}px, ${moveY}px)`;
});
