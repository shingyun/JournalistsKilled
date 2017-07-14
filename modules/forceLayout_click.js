function ForceLayout(){

       var  W = document.getElementById('container').clientWidth,
            H = document.getElementById('container').clientHeight*0.63,
            canvas,
            ctx,
            canvasMouse, canvasMouseTick,
            ctxM,
            force,
            simulation,
            _x,
            _y,
            _r = 4,
            _strength,
            _collision = 6,
            tooltip,
            prevNode = {};

       function exports(selection){

            var datum = selection.datum() || [];
 
            canvas = selection.select('.canvas-main').size()===0?selection.append('canvas').attr('class','canvas-main'):selection.select('.canvas-main');
            
            canvas.attr('width',W).attr('height',H);

            ctx = canvas.node().getContext('2d');

            canvasMouse = selection.select('.canvasMouse').size()===0?selection.append('canvas').attr('class','canvasMouse'):selection.select('.canvasMouse');
              
            canvasMouse.attr('width',W).attr('height',H);

            ctxM = canvasMouse.node().getContext('2d');

            canvasMouseTick = CanvasTick(canvasMouse.node(), ctxM);
            
            canvasMouseTick.start();

            var charge = d3.forceManyBody().strength(_strength);

            var forceX = d3.forceX()
                .x(_x);

            var forceY = d3.forceY()
                .y(_y); 

            var collide = d3.forceCollide()
                .radius(_collision);

            if (!simulation) {
              simulation = d3.forceSimulation(datum);
            }

            force = simulation
                .force('charge',charge)
                .force('x',forceX)
                .force('y',forceY)
                .force('collide',collide)
                .restart()
                .alpha(1)
                .on('tick',_tick)
                .on('end',function(){
                      console.log('simulation end');
                });

            canvasMouse
                .on('mousemove',function(){
                      var xy = d3.mouse(this);
                      
                      if(_findNearestNode(xy)){
                            var nearest = _findNearestNode(xy);
                            _highlight(nearest);

                            if(prevNode.name !== nearest.name){
                              //tooltip
                              prevNode = nearest;
                              _tooltip(selection,nearest);
                              // tooltip = selection.select
                            }
                      } else {
                          canvasMouseTick.removeDrawing("highlight:one");
                             }
                });//canvasMouse.on('mousemove')

            canvasMouse
                .on('click',function(){

                    var xy = d3.mouse(this);
                    var nearest, selectedTerm;
                    
                    force.nodes().forEach(function(d){
                      d.clicked = false;
                      d.selected = false;
                    })

                    canvasMouseTick.removeDrawing('highlight:one');

                         if(_findNearestNode(xy)){

                              nearest = _findNearestNode(xy);

                              if (prevNode.name !== nearest.name){
                                  prevNode = nearest;
            
                              }
                          }//find

                          if (selectedGroupBtn == "When"){
                             
                             force.nodes().forEach(function(d) {

                                  if(nearest.year == d.year){

                                           d.clicked = true;
                                        } else{
                                           d.clicked = false;
                                        }

                             });

                            selectedTerm = nearest.year

                          }//if btn == when

                          else if (selectedGroupBtn == 'Where'){
                             force.nodes().forEach(function(d) {
                                 if(nearest.countryKilled == d.countryKilled){
                                      d.clicked = true;
                                  } else{
                                      d.clicked = false;
                                  }
                               });

                             selectedTerm = nearest.countryKilled
                          }// if btn == Where

                         else if (selectedGroupBtn == 'How'){

                             force.nodes().forEach(function(d) {
                                 if(nearest.deathType == d.deathType){
                                   // console.log(d.year);
                                      d.clicked = true;
                                  } else {
                                      d.clicked = false;
                                  }
                               });

                             selectedTerm = nearest.deathType
                          }// if btn == How(selectedGroupBtn == 'How')

                          else{
                            return;
                          }
                  
                  _drawCanvas(force.nodes());
                  
                  d3.selectAll('.hint').html('You just selected ');
                  d3.selectAll('.selectedTerm').html(selectedTerm);

            });//canvasMouse.on('click')
            
            canvasMouse
                .on('mouseleave', function(){
                  selection.select('.custom-tooltip').style('opacity',0);
                })

              
        }//exports

        // setting config values
	      // "Getter" and "setter" functions
        exports.x = function(_){
            	if(!arguments.length) return _x;
            	_x = _;
            	return this;
        }
 
        exports.y = function(_){
            	if(!arguments.length) return _y;
            	_y = _;
            	return this;
        }
            
        exports.strength = function(_){
            	if(!arguments.length) return _strength;
            	_strength = _;
            	return this;
        }

        exports.collide = function(_){
            if(!arguments.length) return _collision;
            _collision = _;
            return this;
        }

        exports.r = function(_){
            if(!arguments.length) return _r;
            _r = _;
            return this;
        }

        exports.selectEventNodes = function(event) {

          force.nodes()
               .forEach(function(d) {
                  d.clicked = false;
                  if (d.event == event) {
                    d.selected = true;
                  } else {
                    d.selected = false;
                  }
          });  

            _drawCanvas(force.nodes());      
        };

        exports.deselectEventNodes = function(){

           force.nodes()
               .forEach(function(d) {
                    d.selected = false;                  
           });  

            _drawCanvas(force.nodes());
        }

        function _tick(){
              var nodes = this.nodes();
              _drawCanvas(nodes);
        }

        function _drawCanvas(nodes){
              
              ctx.strokeStyle = 'rgba(146,20,12,0.8)';
              ctx.lineWidth = 0.5;
              ctx.clearRect(0,0,W,H);

              nodes.forEach(function(n){
                ctx.save();
                ctx.beginPath();
                if (n.clicked) {
                  ctx.fillStyle = 'rgba(77,130,134,.6)';
                  ctx.strokeStyle = 'rgba(77,130,134,.8)';
                } else if(n.selected){
                  ctx.fillStyle = 'rgba(255,165,0,.6)';
                  ctx.strokeStyle = 'rgba(255,165,0,1)';
                }
                else {
                  ctx.fillStyle = 'rgba(146,20,12,.6)'; 
                }

                  ctx.moveTo(n.x+_r,n.y);
                  ctx.arc(n.x,n.y,_r,0,Math.PI*2);     
                  ctx.fill();
                  ctx.stroke();
                  ctx.restore();
              });
        }//_drawCanvas

        function _findNearestNode(xy){
              return force.find(xy[0],xy[1],_r*5);
        }//_findNearestNode

        function _highlight(node){

              ctxM.clearRect(0,0,W,H);
              ctxM.save();
              canvasMouseTick.addDrawing("highlight:one", function(ctxM) {
                  ctxM.beginPath();
                  ctxM.arc(node.x,node.y,_r+3,0,Math.PI*2)
                  ctxM.strokeStyle = 'rgb(146,20,12)';
                  ctxM.lineWidth = 2;
                  ctxM.stroke();
              });  

              ctxM.restore();             

        }//_highlight

        
        function _tooltip(selection,node){
  
              var tooltip = selection.select('.custom-tooltip');
              
              tooltip.style('opacity',1);

              tooltip.select('.title').html(node.name);

              tooltip.select('.nationality').html('Nationality: '+node.nationality);

              tooltip.select('.des').html(node.name + ' worked at ' + node.org +', was killed in ' + node.countryKilled + ' in ' + node.year + ' because of '+ node.deathType + '.')

        }
        
        return exports;

}//forceLayoutNoBind

