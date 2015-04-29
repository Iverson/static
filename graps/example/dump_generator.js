var time, value;
var data = [];

for (i = 0; i<500; i++) {
  time = new Date().getTime() + 1000*i;
  value = (Math.random() - 0.5)/4 + 0.8;
  data.push([time, value]);
}
