function init(){
    var w = 500;
    var h = 100;
    var barpadding = 4;

    d3.csv("Task_2.4_data.csv").then(function(data){
        console.log(data);
        wombatSightings = data;
        barChart(wombatSightings);
    })


    function barChart(){
        svg.selectAll("rect")
        .data(wombatSightings)
        .enter()
        .append("rect")
        .attr("x",function(d,i){ 
            return i*(w/wombatSightings.length);
        })
        .attr("y",function(d){ 
            return h - (d.wombats*4); 
        }) 
        .attr("width",(w/wombatSightings.length)-barpadding)
        .attr("height", function(d){
            return d.wombats*4;
        })
        .style("fill", function(d){
            if(d.wombats >19){
                return d3.color("yellow");
            }else{
                return "rgb(19,83,212)";
            }
        });

    }
    var svg = d3.select("p") 
                .append("svg")
                .attr ("width", w) 
                .attr ("height", h);
}
window.onload = init;