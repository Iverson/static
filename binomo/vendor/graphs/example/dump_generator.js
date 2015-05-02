var time, value;
var data = {'EUR': []};

for (i = 0; i<1800; i++) {
  time = new Date().getTime() + 400*i;
  value = Math.random()/100 + 1.11100;
  data['EUR'].push({ "rate": "" + value, "created_at": "" + time/1000 });
}

JSON.stringify(data);
