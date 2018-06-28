$.widget('burymm.canvasClock', {	
		options : {
			radius : 100,
			padding : 10
		},
		_create : function () {			
			var timer,
				widgetCanvas,
				self = this;
				
			//create canvas
			widgetCanvas = $('<canvas width="' + (self.options.radius + self.options.padding) * 2 + 'px" height="'+ (self.options.radius + self.options.padding) * 2 + 'px" id="canvas-clock">Update you browser to see clock</canvas>');			
			this.element.html(widgetCanvas);			
			date = new Date();						
			
			canvas = document.getElementById('canvas-clock');
			context = canvas.getContext("2d");
			
			// paint base object
			context.beginPath();
			context.translate(self.options.radius + self.options.padding, self.options.radius + self.options.padding);
			context.arc(0, 0, self.options.radius, 0, Math.PI*2, true); 
			context.strokeStyle = "#0000ff";
			context.lineWidth = 5;
			context.stroke();
			
			this._DrawMinutusIndicators();
			window.setInterval(function() {				
				self._drawArrows()
				
				}, 1000);
			context.closePath();			
		},
		_render: function() {
			
		},
		_drawArrows : function() {
			var self = this;
			date = new Date();
			context.save();
			
			context.beginPath();
			/* draw circle to delete current arrow*/		
			context.arc(0, 0, self.options.radius * .8, 0, Math.PI*2, true); 
			context.fillStyle = "#ffffff";			
			context.fill();
			
			/* draw hour arrow*/
			context.save();
			context.beginPath();		
			context.strokeStyle = '#00ff00';
			context.lineWidth = 5;			
			angle =  2*Math.PI * date.getHours() / 12;
			context.rotate(angle);
			context.moveTo(0, 0);
			context.lineTo(0, -1 * (self.options.radius) * .7);
			context.stroke();		
			context.restore();
			
			/* draw minutes arrow */
			context.save();
			context.beginPath();
			context.strokeStyle = '#00ff00';
			context.lineWidth = 3;			
			angle =  2*Math.PI * date.getMinutes() / 60;
			context.rotate(angle);
			context.moveTo(0, 0);
			context.lineTo(0, -1 * self.options.radius * .75);
			context.stroke();		
			context.restore();
			
			/* draw seconds arrow */
			context.save();
			context.beginPath();
			context.strokeStyle = '#0000ff';
			context.lineWidth = 1;			
			angle =  2*Math.PI * date.getSeconds() / 60;
			context.rotate(angle);
			context.moveTo(0, 0);
			context.lineTo(0, -1 * self.options.radius * .8);
			context.stroke();		
			context.restore();		
		},
		_DrawMinutusIndicators : function() {
			var minutes = 60;
				context.strokeStyle = '#000',
				self = this;
		
			for (var i = 0; i < minutes; i += 1)
			{
				context.beginPath();
				context.moveTo(self.options.radius * .8, 0);
				if (i % 5 == 0) {				
					context.lineTo(self.options.radius * .9, 0);
					context.lineWidth = 2;
				} else {
					context.lineTo(self.options.radius * .85, 0);
					context.lineWidth = 1;
				}
				context.stroke();
				context.rotate(2 * Math.PI / minutes);			
			}
		},
		canvas : {},
		context : {},
		secStart : {},
		date : {}
	});