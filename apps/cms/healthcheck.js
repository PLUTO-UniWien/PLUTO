const http = require('http');

const options = {
  host: 'localhost',
  port: 1337,
  timeout: 2000,
};

const request = http.request(options, (res) => {
  if (res.statusCode === 200) {
    console.log('Healthcheck passed!');
    process.exit(0);
  } else {
    console.log('Healthcheck failed!');
    process.exit(1);
  }
});

request.on('error', function (err) {
  console.log('Healthcheck failed!', err);
  process.exit(1);
});

request.end();
