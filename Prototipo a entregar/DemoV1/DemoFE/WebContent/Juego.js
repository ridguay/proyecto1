var game = new Phaser.Game(800, 500, Phaser.AUTO, 'phaser', { preload: preload, create: create});
		var myText = null;
		var sprite = null;

		function preload() {
		    game.load.image("barco1", "Barco.png");
		    game.load.image("barco2", "Barco2.png");
		}

		function create() {
		    this.client = new Client();
		    this.client.openConnection();
		    this.client2 = new Client();
		    this.client2.openConnection();
		    myText = game.add.text(0, 0, "started (not yet connected)", { font: "14px Arial", fill: "#ff0044"});
		    sprite = game.add.sprite(100, 100, "barco1");
		    sprite2 = game.add.sprite(100, 200, "barco2");
		    sprite.inputEnabled = true;
		    sprite2.inputEnabled = true;
		    sprite.input.enableDrag(false, true);
		   sprite2.input.enableDrag(false, true);
		    sprite.events.onDragStop.add(barco1Dragged, this);
		   sprite2.events.onDragStop.add(barco2Dragged, this);
		    game.stage.disableVisibilityChange = true;
		}

		function barco1Dragged() {
		    if (this.client.connected) {
		        this.client.ws.send(JSON.stringify({b: 'b1', x: sprite.x, y: sprite.y}));
		    }
		}

		function barco2Dragged() {
		    if (this.client2.connected) {
		        this.client2.ws.send(JSON.stringify({b: 'b2', x: sprite2.x, y: sprite2.y}));
		    }
		}

		function Client() {
			
		}

		Client.prototype.openConnection = function() {
		    this.ws = new WebSocket("ws://localhost:8080/DemoBackEnd/demo");
		    this.connected = false;
		    this.ws.onmessage = this.onMessage.bind(this);
		    this.ws.onerror = this.displayError.bind(this);
		    this.ws.onopen = this.connectionOpen.bind(this);
		    //messageTA.value += "Me conecte!!!..."+"\n";
		};

		Client.prototype.connectionOpen = function() {
		    this.connected = true;
		    myText.text = 'Me conecte\n';
		};

		Client.prototype.onMessage = function(message) {
		    //myText.text = myText.text + message.data;
		    var msg = JSON.parse(message.data);
		    if(msg.b == "b1")
		    {	
			    sprite.x = msg.cx;
			    sprite.y = msg.cy;
		    }
		    else
		    {
			    sprite2.x = msg.cx;
			    sprite2.y = msg.cy;
			}
		};

		Client.prototype.displayError = function(err) {
		    console.log('Websocketerror: ' + err);
		};
