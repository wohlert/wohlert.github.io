rnorm = function() {
  const u1 = 1 - Math.random(),
        u2 = 1 - Math.random();

  return Math.sqrt(-2.*Math.log(u1)) * Math.cos(2.*Math.PI*u2);
}

brownianMotion = function(n) {
  let x = new Array(n).fill(0);
  let y = new Array(n).fill(0);

  for (var i = 1; i < y.length; i++) {
    x[i] = i;
    y[i] = y[i-1] + rnorm();
  }

  return {x: x, y: y};
}

class LineGraph {
  constructor(element) {
    this.svg = d3.select(element);

    this.margin = {top: 20, right: 20, bottom: 30, left: 50};
    this.width  = this.svg.attr("width") - this.margin.left - this.margin.right;
    this.height = this.svg.attr("height") - this.margin.top - this.margin.bottom;

    this.g = this.svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.axisX = d3.scaleLinear().rangeRound([0, this.width]);
    this.axisY = d3.scaleLinear().rangeRound([this.height, 0]);
  }

  drawAxes() {
    this.g.append("g")
     .attr("transform", "translate(0," + this.height + ")")
     .call(d3.axisBottom(this.axisX))
     .append("text")
     .attr("fill", "#000")
     .attr("transform", "translate(" + (this.width-this.margin.right) + ", -10)")
     .text("Iteration");

    this.g.append("g")
     .call(d3.axisLeft(this.axisY))
     .append("text")
     .attr("fill", "#000")
     .attr("transform", "rotate(-90)")
     .attr("y", 6)
     .attr("dy", "0.71em")
     .attr("text-anchor", "end")
     .text("Objective value");
  }

  drawLine(line) {
    this.g.append("path")
     .datum(this.data)
     .attr("fill", "none")
     .attr("stroke", "#3bb873")
     .attr("stroke-linejoin", "round")
     .attr("stroke-linecap", "round")
     .attr("stroke-width", 1.5)
     .attr("d", line);
  }

  plot(data) {
    this.data = data;

    // Setup axes
    this.axisX.domain([0, 100]);
    this.axisY.domain([-10, 10]);

    // Setup line
    var line = d3.line()
        .x(function(d, i) { return axisX(i); })
        .y(function(d)    { return axisY(d); });

    this.drawAxes();
    this.drawLine(line);
  }
}

const data = brownianMotion(100);

line = new LineGraph("svg");
line.plot(data)
