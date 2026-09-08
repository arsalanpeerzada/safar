const extractVideoId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([^"&?\/\s]{11})/);
  return match ? match[1] : null;
};
console.log(extractVideoId('http://www.youtube.com/watch?v=19E65tOn3tI'));
console.log(extractVideoId('https://www.youtube.com/watch?v=fSf2V-z-YTA'));
