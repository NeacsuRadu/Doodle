window.onload = function(){
	var localStorageP = false;
	
	if (typeof(Storage) !== "undefined") 
	{
		localStorageP = true;
	} 

	if( localStorageP == false )
	{
		document.getElementById("highscore").innerHTML = "Cannot display highscore because your browser is fucking stupid. Do something about that!!";
	}
	else 
	{
		if (localStorage.getItem("highscore") === null) 
		{
			localStorage.setItem("highscore", 0);
		}
		
		document.getElementById("highscore").innerHTML = "Highscore  " + localStorage.getItem("highscore"); 
	}
	
	var canvas = document.getElementById("canv");
	canvas.width = 600;
	canvas.height = 700;
	
	var canvasContext = canvas.getContext("2d");
	canvasContext.font = "20px Georgia";
	
	canvasContext.fillText( "Press SPACEBAR to start.", 180, 380 )
	
	var stop = true; 
	document.body.onkeyup = restartFunction;
	
	function restartFunction(e)
	{
		if( stop == true && e.keyCode == 32 )
		{
			var patratel = getPatratel({
				context: canvasContext,
				width: 40,
				height: 50,
				bottom: canvas.height - 45,
				left: canvas.width/2 - 20
			});
			
			stop = false;
			var squeeze = false;
			var push = false;
			var mouse = canvas.width / 2;
			var numberOfPaddles;
			var arrayOfPaddles = new Array();
			var screenSplit = 7;
			var score = 0;
			var localScore = 0;
			var reversing = 1;
			var dispari = false;
			var bump = 0;
			var dificultyLevel = 1;
			var reverseNumber = 1;
			var blackColor = false;
			var changedColor = false;
			var backgroundColorString = "white";
			
			generatePaddles();
			
			var sari = 0;	

			document.addEventListener("mousemove", mouseMoveHandler, false);
			patratel.jump();
			gameLoop();
			
			
			// pentru mouse 
			function mouseMoveHandler(e){
				if( e.clientX + patratel.width/2 <= canvas.width && e.clientX - patratel.width/2 >= 0 )
					mouse = e.clientX - patratel.width / 2;
			};
			
			/* functie pentru generarea primelor paddle */ 
			function generatePaddles()
			{
				numberOfPaddles = 8;
				var bottom = Math.floor( (Math.random() * 100 ) + 10);
				var left = Math.floor( (Math.random() * 1000 ) );
				if( left > canvas.width - 80 ) left -= 400;
				if( bottom > 90 ) bottom -= 20;
				var paddle = getPaddle({ context: canvasContext, 
													left: left, 
													bottom: -bottom });
				arrayOfPaddles.push(paddle);
				
				arrayOfPaddles.push( getPaddle({  context: canvasContext, left: canvas.width/2 - 40, bottom: canvas.height - 10}));
				
				for( var i = 1; i < numberOfPaddles - 1; ++ i )
				{
					bottom = Math.floor( (Math.random() * 100 ) + 10);
					left = Math.floor( (Math.random() * 1000 ) );
					if( bottom > 90 ) bottom -= 20;
					if( left > canvas.width - 80 ) left -= 480;
					paddle = getPaddle({ context: canvasContext, 
														left: left, 
														bottom: i*100 + bottom });
					arrayOfPaddles.push(paddle);
				}
				
				for( var i = 0; i < numberOfPaddles; ++ i )
				{
					for( var j = i+1; j < numberOfPaddles; ++ j )
					{
						if( arrayOfPaddles[i].bottom > arrayOfPaddles[j].bottom)
						{
							var aux = arrayOfPaddles[i];
							arrayOfPaddles[i] = arrayOfPaddles[j];
							arrayOfPaddles[j] = aux;
						}
					}
				}
			};
			
			function gameLoop () {
				if( stop == true )
				{
					canvasContext.beginPath();
					canvasContext.clearRect(0,0, canvas.width, canvas.height);
					canvasContext.rect(0, 0, canvas.width, canvas.height);
					canvasContext.fillStyle = backgroundColorString;
					canvasContext.fill();
					if( blackColor == true )
					{
						canvasContext.fillStyle = "white";
					}
					else 
					{
						canvasContext.fillStyle = "black";
					}
					canvasContext.fillText( "Ai murit, BLEGULE!!", 200 , 320)
					canvasContext.fillText( "Score " + score, 250, 350);
					canvasContext.fillText( "Press SPACEBAR to restart.", 180, 380 );
					if( localStorageP == true )
					{
						if( score > Number(localStorage.getItem("highscore")))
						{
							localStorage.setItem("highscore", score );
							document.getElementById("highscore").innerHTML = "Highscore  " + localStorage.getItem("highscore");
						}
					}
					return 0;
				}
				
				window.requestAnimationFrame(gameLoop);
				canvasContext.clearRect(0,0, canvas.width, canvas.height);
			
				canvasContext.beginPath();
				canvasContext.rect(0, 0, canvas.width, canvas.height);
				canvasContext.fillStyle = backgroundColorString;
				canvasContext.fill();
			
				if( blackColor == true )
				{
					canvasContext.fillStyle = "white";
				}
				else 
				{
					canvasContext.fillStyle = "black";
				}
				canvasContext.fillText( "Score " + score, 5, 20);
			
				localScore -= patratel.acceleration;
				if( localScore > score )
					score = localScore;
			
				if( score > dificultyLevel * 1000 && bump < 300 )
				{
					++dificultyLevel;
					bump += 5;
				}
			
				if( score > reverseNumber * 2000 && changedColor == false )
				{
					++reverseNumber;
					changedColor = true;
					if( blackColor == false )
					{
						blackColor = true;
						backgroundColorString = "black";
						patratel.fillColor = "white";
					}
					else 
					{
						blackColor = false;
						backgroundColorString = "white";
						patratel.fillColor = "black";
					}
				}
				
				// aici facem paddle-urile care se misca pe orizontala 
				for( var i = 0; i < numberOfPaddles; ++ i )
				{
					if( arrayOfPaddles[i].moving == true )
						arrayOfPaddles[i].update();
				}
			
				if( arrayOfPaddles[sari].moving == true )
				{
					patratel.left += arrayOfPaddles[sari].sideways;
				}
				// aici verificam daca a iesit din cadru => ai pierdut, blegule, trebuie tinut cont de reversing !! 
				if( reversing == 1 && patratel.bottom + patratel.acceleration + patratel.height/2 >= canvas.height )
				{
					stop = true;
				}
				if( reversing == -1 && patratel.bottom - patratel.height/2 - patratel.acceleration <= 0 )
				{
					stop = true;
				}
			
				// aici mutam patratelul dupa mouse stanga dreapta :D 
				if( patratel.left != mouse && ( squeeze == false && push == false ) )
				{
					if( mouse < patratel.left )
					{
						if( patratel.left - 10 <= mouse )
						{
							patratel.left = mouse;
						}
						else 
						{
							patratel.left -= 10;
						}
					}
					else 
					{
						if( patratel.left + 10 >= mouse )
						{
							patratel.left = mouse;
						}
						else 
						{
							patratel.left += 10;
						}
					}
				}
				
				// aici vedem care patratica e sub noi :)   pputin cam dubios 
				if( reversing == 1 && squeeze == false && push == false)
				{
					sari = 0;
					for( sari = 0; sari < numberOfPaddles - 1; ++sari )
					{
						if( arrayOfPaddles[sari].bottom - arrayOfPaddles[sari].height/2 >= patratel.bottom + patratel.height/2 )
							break;
					}
				}
				else if( reversing == -1 && squeeze == false && push == false)
				{
					for( sari = 0; sari < numberOfPaddles - 1; ++sari )
					{
						if( arrayOfPaddles[sari].bottom + arrayOfPaddles[sari].height/2 > patratel.bottom - patratel.height/2 )
							break;
					}
					if( sari > 0 )
						sari --;
				}
			
				// aici verificam daca urmeaza ca sarim pe o patratica 
				var merge = false;
				if( reversing == 1 )
				{
					if( patratel.bottom + patratel.height/2 <= arrayOfPaddles[sari].bottom - arrayOfPaddles[sari].height/2 && patratel.bottom + patratel.height/2 + patratel.acceleration >= arrayOfPaddles[sari].bottom - arrayOfPaddles[sari].height/2 && patratel.falling == true && patratel.left + patratel.width/2 >= arrayOfPaddles[sari].left && patratel.left + patratel.width/2 <= arrayOfPaddles[sari].left + arrayOfPaddles[sari].width)
					{
						merge = true;
					}
					
				}
				else 
				{
					if( patratel.bottom - patratel.height/2 >= arrayOfPaddles[sari].bottom + arrayOfPaddles[sari].height/2 && patratel.bottom - patratel.height/2 - patratel.acceleration <= arrayOfPaddles[sari].bottom + arrayOfPaddles[sari].height/2 && patratel.falling == true && patratel.left + patratel.width/2 >= arrayOfPaddles[sari].left && patratel.left + patratel.width/2 <= arrayOfPaddles[sari].left + arrayOfPaddles[sari].width)
					{
						merge = true;
					}
				}
			
				// hahaha facem ceva dubios 
				if( squeeze == false && push == false && merge == true  )
				{
					if( reversing == 1 )
					{
						patratel.bottom = arrayOfPaddles[sari].bottom - arrayOfPaddles[sari].height/2 - patratel.height/2;
					}
					else 
					{
						patratel.bottom = arrayOfPaddles[sari].bottom + arrayOfPaddles[sari].height/2 + patratel.height/2;
					}
					squeeze = true;
					if( arrayOfPaddles[sari].magic == true )
					{
						dispari = true;
					}
				}
				else // incepem sa sarim 
				{
					if( squeeze == true )
					{
						if( patratel.height > 36 )
						{
							patratel.height -= 2;
							if(reversing == 1) patratel.bottom ++; // aici trebuie tinut cont de directia in care sarim 
							else patratel.bottom --;
						}
						else if( patratel.height == 36 )
						{
							squeeze = false;
							push = true;
						}
					}
					else if( push == true )
					{
						if( patratel.height < 50 )
						{
							patratel.height += 2;
							if( reversing == 1 )patratel.bottom --; // same here 
							else patratel.bottom ++;
						}
						else if( patratel.height == 50 ) // pe aici trebuie sa facem ceva dubios in cazul in care vrem sa inversam 
						{
							push = false;
							patratel.falling = false;
							/*if( score > reverseNumber * 2000 )
							{
								reverseNumber++;
								changedColor = false;
								patratel.falling = true;
								patratel.acceleration = 7;
								reversing = (-1)*reversing;
							}
							else
							{
								if( arrayOfPaddles[sari].powerJump == true )
								{
									patratel.powerJump = true;
								}
								patratel.jump();
							}*/
							if( arrayOfPaddles[sari].powerJump == true )
							{
									patratel.powerJump = true;
							}
							patratel.jump();
							if( dispari == true )
							{
								dispari = false;
								arrayOfPaddles[sari].hideThatBitch();
							}
						}
					}
					else 
					{
						if( changedColor == true && patratel.acceleration >= 0 )
						{
							changedColor = false;
							reversing = (-1)*reversing;
							patratel.falling = true;
							//patratel.acceleration = 7;
						}
						if( reversing == 1 )
						{
							if( (patratel.bottom - patratel.height) + patratel.acceleration < canvas.height / 2 && patratel.acceleration < 0 )
							{
								for( var i = 0; i < numberOfPaddles; ++ i )
								{
									arrayOfPaddles[i].bottom -= patratel.acceleration;
								}
							}
							else 
							{
								patratel.bottom += patratel.acceleration;
							}
						}
						else 
						{
							if( patratel.bottom - patratel.height - patratel.acceleration > canvas.height/2 && patratel.acceleration < 0 )
							{
								for( var i = 0; i < numberOfPaddles; ++ i )
								{
									arrayOfPaddles[i].bottom += patratel.acceleration;
								}
							}
							else 
							{
								patratel.bottom -= patratel.acceleration;
							}
						}
					}
				}
		 
				for( var i = 0; i < numberOfPaddles; ++ i )
				{
					arrayOfPaddles[i].render();
				}
		 
				if( reversing == 1 )
				{
					if( arrayOfPaddles[numberOfPaddles - 2] .bottom - arrayOfPaddles[numberOfPaddles - 2].height/2 >= canvas.height )
					{
						arrayOfPaddles.pop();
						numberOfPaddles --;
					}
				}
				else 
				{
					if( arrayOfPaddles[1].bottom + arrayOfPaddles[1].height/2 <= 0 )
					{
						arrayOfPaddles.shift();
						numberOfPaddles --;
					}
				}
				
				if( reversing == 1 )
				{
					if( arrayOfPaddles[0].bottom > bump )
					{
						var bottom = Math.floor( (Math.random() * 100 ) + 10);
						var left = Math.floor( (Math.random() * 1000 ) );
						if( left > canvas.width - 80 ) left -= 480;
						if( bottom > 90 ) bottom -= 10;
						var pad = getPaddle({ context: canvasContext, left: left, bottom: -bottom });
						var rand = Math.floor( (Math.random() * 100) + 1 );
						if( rand % 9 == 0 )
						{
							pad.powerJump = true;
						}
						if( score > 1500 )
						{
							if( rand%5 == 0 )
							{
								pad.moving = true;
							}
							if( score > 3000 && rand%9 == 0 )
							{
								pad.magic = true;
							}
						}
						arrayOfPaddles.unshift( pad );
						sari ++;
						numberOfPaddles ++;
					}
				}
				else 
				{
					if( arrayOfPaddles[numberOfPaddles - 1].bottom < canvas.height - bump )
					{
						var bottom = Math.floor( (Math.random() * 100 ) + 10);
						var left = Math.floor( (Math.random() * 1000 ) );
						if( left > canvas.width - 80 ) left -= 480;
						if( bottom > 90 ) bottom -= 10;
						var pad = getPaddle({ context: canvasContext, left: left, bottom: canvas.height + bottom });
						var rand = Math.floor( (Math.random() * 100) + 1 );
						if( rand % 8 == 0 )
						{
							pad.powerJump = true;
						}
						if( score > 1500 )
						{
							if( rand%5 == 0 )
							{
								pad.moving = true;
							}
							if( score > 3000 && rand%7 == 0 )
							{
								pad.magic = true;
							}
						}
						arrayOfPaddles.push( pad );
						sari ++;
						numberOfPaddles ++;
					}
				}
		 
				patratel.render();
			};
		}
	};
}

function getPatratel( options ){
	var that = {};
	
	that.context = options.context;
	that.width = options.width;
	that.height = options.height;
	that.bottom = options.bottom;
	that.left = options.left;
	that.acceleration = 0;
	that.falling = false;
	that.powerJump = false;
	that.fillColor = "black";
	that.render = function(){
		that.context.beginPath();
		that.context.strokeStyle = that.fillColor;
		that.context.rect( that.left, that.bottom - that.height/2, that.width, that.height );
		that.context.stroke();
	}
		
	that.jump = function(){
		if( that.powerJump == false )
		{
			that.acceleration = -8;
			setTimeout( function(){ that.acceleration = -3;}, 400 );
			setTimeout( function(){ that.acceleration = 0;}, 700 );
			setTimeout( function(){ that.acceleration = 2; that.falling = true;}, 800 );
			setTimeout( function(){ that.acceleration = 5;}, 1000 );
		}
		else 
		{
			that.acceleration = -15;
			setTimeout( function(){ that.acceleration = -7;}, 800 );
			setTimeout( function(){ that.acceleration = -3;}, 1400 ); 
			setTimeout( function(){ that.acceleration = 0;}, 1800 );
			setTimeout( function(){ that.acceleration = 2; that.falling = true;}, 1900 );
			setTimeout( function(){ that.acceleration = 5;}, 2100 );
			that.powerJump = false;
		}
	};

	return that;
}

function getPaddle( options )
{
	var that = {};
	that.context = options.context;
	that.width = 80;
	that.height = 20;
	that.left = options.left;
	that.bottom = options.bottom;
	that.moving = false;
	that.magic = false;
	that.show = true;
	that.powerJump = false;
	that.sideways = 3;
	that.render = function(){
		if( that.show == true )
		{
			that.context.beginPath();
			if( that.powerJump == true )
			{
				that.context.strokeStyle = "#FFFF00"
			}
			else if( that.moving == false && that.magic == false )
			{
				that.context.strokeStyle = "#FF0000";
			}
			else 	if( that.moving == true && that.magic == true )
			{
				that.context.strokeStyle = "#00FF00";
			}
			else if( that.moving == true )
			{
				that.context.strokeStyle = "#0000FF";
			}
			else if( that.magic == true )
			{
				that.context.strokeStyle = "#236000";
			}
			that.context.rect( that.left, that.bottom - that.height/2, that.width, that.height );
			that.context.stroke();
		}
	}
	that.update = function(){
		if( that.left + that.sideways >= 520 )
		{
			that.left = 520;
			that.sideways = -3;
		}
		else if( that.left + that.sideways <= 0 )
		{
			that.left = 0;
			that.sideways = 3;
		}
		else 
		{
			that.left += that.sideways;
		}
	}
	that.hideThatBitch = function(){
		that.show = false;
		setTimeout( function(){ that.show = true; }, 2000 );
	}
	return that;
}