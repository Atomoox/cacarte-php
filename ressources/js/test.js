const x = new XMLHttpRequest();
x.open('https://api.ipfy.org');
x.send();
console.log(x.responseText);
