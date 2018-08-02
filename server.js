//Consts
const dns = require('native-dns');
const app_dns = dns.createServer();
const google_dns = '8.8.8.8';
const port_dns = 53;
const dns_blocked = require('./conf.json');

//Logs triggered by various server events
app_dns.on('listening', function(){
    console.log('server listening on', app_dns.address());
});
app_dns.on('close',  function(){
    console.log('server closed', app_dns.address());
});
app_dns.on('error', function(err, buff, req, res) {
    console.error(err.stack);
});
app_dns.on('socketError', function(err, socket) {
    console.error(err);
});

//Now for the fun part!
app_dns.on('request', function(request, response){
    var question = request.question[0];
    if (dns_blocked.blocked.indexOf(question.name) != -1){
        // lets end processing here and send an empty answer response,
        // since this host is in our block list
        response.answer = [];
        return response.send();
    }

    // ok, the requested host isn't blocked so lets retrieve a result
    var forward = dns.Request({
        question: question,
        server: {
            address: google_dns,
            type: 'udp',
            port: port_dns
        },
        cache: false
    });

    // when we get answers back, add them to the response
    forward.on('message', function(err, msg) {
        msg.answer.forEach(function(a){
            response.answer.push(a);
        });
    });
    // when the forwarded request finishes, send off our actual response
    forward.on('end', function(){
        response.send();
    });
    // begin the forward
    forward.send();
});
app_dns.serve(port_dns);
