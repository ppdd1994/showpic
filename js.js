;(function($){
	function Carousel(poster){
		var self=this;
		this.flag=true;
		this.poster=poster;
		this.box=$(".pic-box");
		this.span=$(".slide-btn");
		this.leftbtn=poster.find(".btn-prev");
		this.rightbtn=poster.find(".btn-next");
		this.items=poster.find("li.pic-item");
		this.itemf=this.items.first();
		this.iteml=this.items.last();
        this.settings={
	      	"width":800,
	      	"height":270,
	      	"posterHeight":270,
	      	"posterWidth":540,
	      	"scale":0.8,
	      	"speed":500,
	      	"verticalAlign":"middle",
	      	"autoplay":true,
	      	"delay":3000
        };
        $.extend(this.settings,this.getSetting());
    	this.setValue();
    	this.setPositon();
    	this.leftbtn.click(function(){
	    	if(self.flag){
	    	self.flag=false;
    		self.special("left");

    	}
    	});
    	this.rightbtn.click(function(){
    		if(self.flag){
    			self.flag=false;
    			self.special("right");
    	 }
    	});
    	if(this.settings.autoplay){
    		this.autoplay();
    		this.poster.hover(function(){
    			window.clearInterval(self.timer);
    		},function(){
    			self.autoplay();
    		});
    	};

	};

	Carousel.prototype={
		autoplay:function(){
			var self=this;
			this.timer=window.setInterval(function(){
				self.rightbtn.click();
			},self.settings.delay);
		},
		special:function(dir){
			var self=this,
				zindexArr=[];
			if(dir==="left"){

			this.items.each(function(){
				var _this = $(this);
				var thisPre=_this.next().get(0)?_this.next():self.itemf,
					width=thisPre.css("width"),
					height=thisPre.css("height"),
					zindex=thisPre.css("z-index"),
					opacity=thisPre.css("opacity"),
					top=thisPre.css("top"),
					left=thisPre.css("left");
				zindexArr.push(zindex);
				_this.animate({
					width:width,
					height:height,
					opacity:opacity,
					top:top,
					left:left
				},function(){
					self.flag=true;
				});
			});	
			this.items.each(function(i){
				$(this).css('z-index',zindexArr[i])
			});
		}else if(dir==="right"){
			this.items.each(function(){
				var _this = $(this);
				var thisNext=_this.prev().get(0)?_this.prev():self.iteml,
					width=thisNext.css("width"),
					height=thisNext.css("height"),
					zindex=thisNext.css("z-index"),
					opacity=thisNext.css("opacity"),
					top=thisNext.css("top"),
					left=thisNext.css("left");
					zindexArr.push(zindex);
				_this.animate({
					width:width,
					height:height,
					opacity:opacity,
					top:top,
					left:left
				},function(){
					self.flag=true;
				});
			});	
			this.items.each(function(i){
				$(this).css('z-index',zindexArr[i])
			});
		}
			
		},
		setPositon:function(){
			var slice = this.items.slice(1),
				halfslice = slice.length/2,
				rightslice=slice.slice(0,halfslice),
				self=this,
				leftslice = slice.slice(halfslice);
			var scale=this.settings.scale,
				spanwid=(this.settings.width-this.settings.posterWidth)/2,
				gap=spanwid/halfslice,
			    rw=this.settings.posterWidth,
			    rh=this.settings.posterHeight,
			    rz=Math.floor (this.items.length/2),
			    hi=this.settings.height,
			    wi=this.settings.posterWidth;

			rightslice.each(function(i,ele){
				rw=rw*scale;
				rh=rh*scale;
				$(this).css({
					width:rw,
					height:rh,
					'z-index':i,
					opacity:1/(++i),
					top:self.setvertical(rh),
					left:gap*(i)+spanwid+wi-rw
				})
			});
			var lw=rightslice.last().width(),
				lh=rightslice.last().height(),
				lz=rightslice.last().css('z-index'),
				ln=slice.length/2;
			leftslice.each(function(i,ele){
				$(this).css({
					width:lw,
					height:lh,
					opacity:1/ln,
					'z-index':i,
					top:self.setvertical(lh),
					left:gap*i
				})
			lw=lw/scale;
			lh=lh/scale;
			ln--;
			});

		},
		setvertical:function(h){
			var verticalAlign=this.settings.verticalAlign,
			    top=0;
			if(verticalAlign==="middle"){
				top=(this.settings.height-h)/2;
			}else if (verticalAlign==="top") {
				top=0;
			}else if(verticalAlign==="bottom"){
				top=this.settings.height-h;
			};
			return top;
		},
    	getSetting:function(){
    		var sets=this.poster.attr("data-setting");
    		if (sets&&sets!=''){
    			return $.parseJSON(sets);
    		}else{
    			return {};
    		};
    	},
    	setValue:function(){
    		var w=this.settings.width-this.settings.posterWidth;
    		var z=Math.ceil(this.items.length/2);
    		this.poster.css({width:this.settings.width,
    			height:this.settings.height
    		});
    		this.box.css({width:this.settings.posterWidth,
    			height:this.settings.posterHeight});
    		this.span.css({width:w/2,
    			height:this.settings.height,
    			'z-index':z
    		});
    		this.itemf.css({left:w/2,
    			width:this.settings.posterWidth,
    			'z-index':Math.floor (this.items.length/2)
    		});

    	}
	};

	Carousel.init=function(posters){
		var _this_ = this;
		posters.each(function(){
			new _this_($(this));
		});
	}

	window["Carousel"]=Carousel;
})(jQuery);