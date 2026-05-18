const dns = require('dns');
dns.lookup('ep-red-paper-am0l9460-pooler.c-5.us-east-1.aws.neon.tech', (err, address, family) => {
  if (err) console.error(err);
  else console.log('IP:', address);
});
