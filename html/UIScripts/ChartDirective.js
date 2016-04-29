app.directive( 'crD3Bars', [
  function () {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      link: function (scope, element) {
    	  
        var margin = {top: 20, right: 20, bottom: 30, left: 60},
          width = 960 - margin.left - margin.right,
          height = 360 - margin.top - margin.bottom;
        
        var svg = d3.select(element[0])
          .append("svg")
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .style("display","block")
          .style("margin","auto")
          .attr('height', height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scale.ordinal().rangeRoundBands([0, width],.4);
        var y = d3.scale.linear().range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(5);
        //Render graph based on 'data'
        scope.render = function(data) {
          //Set our scale's domains
          x.domain(data.map(function(d) { return d.ProjectNo; }));
          var min = d3.min(data, function(d) { return d.Rating; });
          var max = d3.max(data, function(d) { return d.Rating; });
          y.domain([parseFloat(min) -0.09 ,parseFloat(max) + 0.09]);
          
          //Redraw the axes
          svg.selectAll('g.axis').remove();
          //X axis
          svg.append("g")
              .attr("class", "barChartXAxis axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);
              
          //Y axis
          svg.append("g")
              .attr("class", "barChartYAxis axis")
              .call(yAxis)
            .append("text")
              .attr("transform","translate(-45," + height / 3 + ") rotate(-90)")
              .style("text-anchor", "end")
              .text("Global Rating");
              
          var colors = ["#004445", "#6fb98f","#2c7873"];
//          colors = ['#F2D1CA'];
          var color = d3.scale.ordinal().range(colors);
          
          var bars = svg.selectAll(".bar").data(data);
          
          bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.ProjectNo); })
            .attr("width",x.rangeBand())
            .style("fill", function(d, i) { return color(i%colors.length); });

          /*bars.append("text")
          .attr("x", 500 / 2)
          .attr("y", function(d) { return y(d.Rating) + 3; })
          .attr("dy", ".75em")
          .text(function(d) { return d.ProjectNo; });*/
          
          //Animate bars
          bars
              .transition()
              .duration(3000)
              .attr('height', function(d) { return height - y(d.Rating); })
              .attr("y", function(d) { return y(d.Rating); })
              
              
        };

          scope.$watch('data', function(){
               scope.render(scope.data);
          }, true);  
         }
    };
  }
]);