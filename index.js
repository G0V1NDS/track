var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);
	//io.set('log level', 1);

server.listen(process.env.PORT || 5000);
app.use(express.static('files'));

app.get('/', function(req, res){
	res.sendfile(__dirname + '/index.html');
});

var usr=new Array();
var position=new Array();
var id=new Array();
//io.on and io.sockets.on are same
	io.on('connection', function(client){
					client.on('submit',function(data){
						var obj={'name':data.name,'socket':client,'coords':data.coords};
						console.log('New user online');
						usr.push(obj);
						position.push(obj.coords);
						id.push(obj.name);
						io.emit('give info',{'position':position,'id':id});
					});

					client.on('new position',function(data){
						for(i=0;i<id.length;i++)
						{
							if(id[i]===data.id)
							{
								position[i]=data.coords;
								break;
							}
						}
					 	io.emit('show move',data);
					});


					client.on('disconnect', function(){
						 remove_position(client,usr);
	 				});
});
function remove_position(client,usr){
		 var obj;
		 for(i=0;i<usr.length;i++)
		 {
			 if(usr[i].socket===client)
			 {
				 console.log('User is going offline');
				 obj=usr[i];
				 position.splice(i,1);
				 id.splice(i,1);
				 usr.splice(i,1);
				 break;
			 }
		 }
		if(obj)
		{
		 io.emit('remove',obj.name);
		 console.log(obj.name);		 
		}
}
