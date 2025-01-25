fetch('http://localhost:3000/proxy?term=burger&limit=10')
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error('Error:', error));