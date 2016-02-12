var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);
	//io.set('log level', 1);
var mover=new Array(),monitor=new Array();
server.listen(process.env.PORT || 5000);
app.use(express.static('files'));

app.get('/', function(req, res){
	res.sendfile(__dirname + '/index.html');
});

//io.on and io.sockets.on are same
	io.on('connection', function(client){
					console.log('User Connected');
					client.on('submit',function(data){
						var obj;
						obj={'name':data.name,'socket':client};
						if(data.mode==='Move')
						{
							mover.push(obj);
							console.log('new user added');
							client.broadcast.emit('new marker',data.marker_id);
						}
						else
						{
							monitor.push(obj);
						}
					});

					 client.on('new position',function(data){
					 	client.broadcast.emit('show move',data);
					 });


					 client.on('disconnect', function(){
						 remove_marker(client,mover,monitor);
	 				});
});
function remove_marker(client,mover,monitor){
	console.log('disconnect event fired');
		 var obj;
		 for(i=0;i<mover.length;i++)
		 {
			 if(mover[i].socket===client)
			 {
				 console.log('mover removed');
				 obj=mover[i];
				 mover.splice(i,1);
				 break;
			 }
		 }
		 for(i=0;i<monitor.length;i++)
		 {
			 if(monitor[i].socket===client)
			 {
				 console.log('monitor removed');
				 obj=monitor[i];
				 monitor.splice(i,1);
				 break;
			 }
		 }

		 io.emit('remove',obj.name);
		 console.log(obj.name);		 
}
