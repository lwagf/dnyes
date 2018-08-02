DNYes
=====
DNYes is my example at a DNS proxy server which will block domains provided via `conf.json`.
Alternatively you may just find the "blocked" array in `conf.example.json` useful, as it is a enormous curated list of hosts considered "bad".

Running
=====
```
cp conf.example.json conf.json
node server.js
```

(Error: bind EACCES? Sudo it!)

Credits
=====
* native-dns
* [/StevenBlack](https://github.com/StevenBlack) for his hosts file consolidation, which I have taken and parsed into an array.
