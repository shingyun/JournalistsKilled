function Button(){

    var _map,
        _menu;

    var noteShow;

    function exports(selection){

        var datum = selection.datum() || [];

		//Draw axis Year
	    nestByYear = d3.nest().key(function(d){return d.year})
	        .entries(datum);

	    year = nestByYear.map(function(d){return d.key}).reverse();

	    year = year.filter(function(d){return d.length>3})

	    var scaleX = d3.scaleBand()
	        .domain(year)
	        .range([50,W-100]);

	    var axisX = d3.axisTop()
	        .scale(scaleX)
	        .tickSize(H/2);

	    plot.append('g')
	        .attr('class','yearAxis')
	        .attr('transform','translate(0,'+H/1.5+')')
	        .style('stroke-dasharray', ('6, 3'))
	        .call(axisX);

	    //Draw map
	    projection.fitExtent([[0,0],[W,H]],_map)
	              .scale(190);

	    plot.append('g')
	        .attr('class','mapData')
	        .attr('transform','translate(0,0)')
	            .selectAll('.countries')
	            .data(_map.features)
	            .enter()
	            .append('path')
	            .attr('class','countries')
	            .attr('d',path)
	            .style('fill','#E6E6E9')
	            .style('stroke-width','1px')
	            .style('stroke','#969696')
	            .style('opacity',0.8);

	    //Death type axis
	    var nestByDeath = d3.nest().key(function(d){return d.deathType}).entries(datum);

	    death = nestByDeath.map(function(d){return d.key});

	    var scaleDeath = d3.scaleBand()
	        .domain(death)
	        .range([50,W-100]);

	    var axisDeath = d3.axisTop()
	        .scale(scaleDeath)
	        .tickSize(null);

	    plot.append('g')
	        .attr('class','deathAxis')
	        .attr('transform','translate(30,'+H/1.85+')')
	        .call(axisDeath);


	    //Simulation Setting
	    //force for death
	    var deathPosition = function(d){
	           if(!d.deathType){return -100;
	           }else{
	               return scaleDeath(d.deathType)+150}
	        };

	    //scale and force for year
	    var yearPosition = function(d){ 
	            if(!d.year){return -500; 
	            }else{
	              return scaleX(d.year)}
	         }

	    //force for map
	    map = d3.map(_map.features,function(d){return d.properties.name});

	    var xMap = function(d){

	        if (map.get(d.countryKilled)) {
	            return path.centroid(map.get(d.countryKilled).geometry)[0]-20;
	           }
	            return -100;
	           }


	    var yMap = function(d){
	            if (map.get(d.countryKilled)) {
	                return path.centroid(map.get(d.countryKilled).geometry)[1]+35;
	            } else {
	                return 600  ;
	            }
	        }

     //First Simulation
		// forceLayout = ForceLayout()
		//       .x(W/2-35)
		//       .y(H/2.5)
		//       .strength(-4);

		forceLayout = ForceLayout()
		      .x(xMap)
		      .y(yMap)
		      .r(r-1)
	          .collide(r-1.5)
	          .strength(0);

	     selectedGroupBtn = 'Where';

		 d3.select('#container').datum(datum).call(forceLayout);
		 d3.selectAll('.mapData').style('opacity',1);
		 d3.select('.button2').classed('clickedBtn',true);
		 d3.select('.hint').style('visibility','visible');

		 // var note = d3.select('.note'),
		 //     noteShow = 'no';
         
   //       console.log(noteShow);




	//Year, When
	    d3.select('.button1')
	      .on('click.year',function(d){

         //     if(noteShow == 'no'){
         //     	note.style('display','block');
         //     }else {
         //     	note.style('display','none');
         //     }

	      	 // d3.select('.closeNote')
	      	 //   .on('click',function(){
	      	 //   	  noteShow = 'yes';
	      	 //   	  note.style('display','none');

         //                   console.log(noteShow);
	      	 //   })
         // console.log(noteShow);

	         d3.select('.button2').classed('clickedBtn',false); 
	         d3.select('.button3').classed('clickedBtn',false); 
	         d3.select(this).classed('clickedBtn',true);

	         selectedGroupBtn = 'When';

	         //button
	         d3.selectAll('.yearAxis').style('opacity',1)
	         d3.selectAll('.mapData').style('opacity',0);
	         d3.selectAll('.deathAxis').style('opacity',0);
	         d3.selectAll('.sc_menu').style('opacity',1).style('visibility','visible');
	         d3.select('.hint').style('visibility','visible');

	         forceByYear = forceLayout
	              .x(yearPosition)
	              .y(function(d){ return d.year%2 === 0 ? (H*1.3)/4 : (H*1.8)/4; })
	              .r(r-1)
	              .collide(r-1)
	              .strength(0);

	         d3.select('#container').datum(datum).call(forceByYear);


	         //Scroll event
			    d3.select('#menu')
			      .selectAll('li')
			      .data(_menu)
			      .enter()
			      .append('li')
			      .html(function(d){return d.event})
			      .on('mouseenter',function(d){

			        selectedMenu = d.abb;
			        forceLayout.selectEventNodes(selectedMenu);
			        d3.select('.event').style('opacity',1);
			        d3.select('.eventName').html(d.event);
			        d3.select('.eventDes').html(d.death + ' journlaists were killed in '+ d.country +' during the period of '+ d.event + ' ' + d.period+'.');

			      })
			      .on('mouseleave',function(d){
			        d3.select('.event').style('opacity',0);
			        forceLayout.deselectEventNodes();

			      });

			    $(function(){
			      var div = $('div.sc_menu'),
			          ul = $('ul.sc_menu'),
			          ulPadding = 15;

			      var divWidth = div.width();
			      div.css({ overflow: 'hidden'});
			      var lastLi = ul.find('li:last-child');
			      div.mousemove(function(e){
			          var ulWidth = lastLi[0].offsetLeft + lastLi.outerWidth()+ulPadding;
			          var left = (e.pageX - div.offset().left)*(ulWidth-divWidth)/divWidth;
			          div.scrollLeft(left);
			      });
			    });
	          
	        });//When


	//Country, Where
	         d3.select('.button2')
	           .on('click.map',function(){

	              d3.select('.button1').classed('clickedBtn',false); 
	              d3.select('.button3').classed('clickedBtn',false); 
	              d3.select(this).classed('clickedBtn',true);

	              selectedGroupBtn = 'Where';


         //     if(noteShow == 'no'){
         //     	note.style('display','block');
         //     }else {
         //     	note.style('display','none');
         //     }

	      	 // d3.select('.closeNote')
	      	 //   .on('click',function(){
	      	 //   	  note.style('display','none');
         //          noteShow = 'yes';
	      	 //   })
         console.log(noteShow);

	              d3.selectAll('.mapData').style('opacity',1);
	              d3.selectAll('.yearAxis').style('opacity',0);
	              d3.selectAll('.deathAxis').style('opacity',0);
	              d3.selectAll('.sc_menu').style('opacity',1).style('visibility','hidden');
	              d3.select('.hint').style('visibility','visible');

	              forceByCountry = forceLayout
	                   .x(xMap)
	                   .y(yMap)
	                   .r(r-1)
	                   .collide(r-1.5)
	                   .strength(0);
	             
	              d3.select('#container').datum(datum).call(forceByCountry);

	           });//Where

	//Death, How

	         d3.select('.button3')
	           .on('click.death',function(){

	              d3.select('.button1').classed('clickedBtn',false); 
	              d3.select('.button2').classed('clickedBtn',false); 
	              d3.select(this).classed('clickedBtn',true);

	              selectedGroupBtn = 'How';


         //     if(noteShow == 'no'){
         //     	note.style('display','block');
         //     } else {
         //     	note.style('display','none');
         //     }

	      	 // d3.select('.closeNote')
	      	 //   .on('click',function(){
	      	 //   	  note.style('display','none');
         //          noteShow = 'yes';
	      	 //   })
         console.log(noteShow);

	              d3.selectAll('.mapData').style('opacity',0);
	              d3.selectAll('.yearAxis').style('opacity',0);
	              d3.selectAll('.deathAxis').style('opacity',1);
	              d3.selectAll('.sc_menu').style('opacity',1).style('visibility','hidden');
	              d3.select('.hint').style('visibility','visible');

	              forceByDeath = forceLayout
	                   .x(deathPosition)
	                   .y(H/3.5)
	                   .r(r-1)
	                   .collide(r+0.5)
	                   .strength(-1);

	              d3.select('#container').datum(datum).call(forceByDeath);

	           });//How

     
     //About
             var about = d3.select('.about');

             d3.select('.button4')
               .on('click',function(){     
                  about.style('display','block');
               });

             d3.select('.close')
               .on('click',function(){
               	   about.style('display','none');
               });

    }
    
    exports.map = function(_){
        if(!arguments.length) return _map;
        _map = _;
        return this;
    }

    exports.menu = function(_){
    	if(!arguments.length) return _menu;
        _menu = _;
        return this;
    }


    return exports;
}


