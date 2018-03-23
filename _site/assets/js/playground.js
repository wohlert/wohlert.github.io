function DrawingField(callback, element, height, width) {
  /**
   * 2d Cartesian plane of possible choices
   * for the latent variable. The pointer in the center
   * represents the current choice.
   *
   * callback: function to be called when dragging of
   *  pointer ends.
   * element: HTML element to attach to.
   * heigh, width: dimensions of svg.
   */
  let value = d3.select(element).append("h4")
    .text("Latent variable: ")
    .append("span")
      .attr("id", `${element.substring(1, element.length)}-value`)
      .text("(0, 0)");
  
  let svg = d3.select(element)
    .append("svg")
    .attr("class", "latent")
    .attr("width", width)
    .attr("height", height)
    .on("click", click);
  
  let circle = svg.append("circle")
      .attr("transform", (d) => `translate(${width/2}, ${height/2})`)
      .attr("r", 5);
  
  function click() {
    const points = 50;
  
    let dx = d3.event.offsetX,
        dy = d3.event.offsetY;
  
    let location = `(${(dx - width/2)/points}, ${(dy - height/2)/points})`
    circle.attr("transform", `translate(${dx}, ${dy})`); 
    d3.select(`${element}-value`).text(location)
    callback(d3.select(this).attr("transform"));
  }
}

function MultinomialField(callback, element, width, choices) {
  /**
   * Selection bar representing choice of discrete label.
   *
   * callback: function to call when changing label.
   * element: HTML element to attach to
   * width: dimension of svg element.
   * choices: number of labels.
   */
    let value = d3.select(element).append("h4")
    .text("Label: ")
    .append("span")
      .attr("id", `${element.substring(1, element.length)}-value`)
      .text("0");

  let svg = d3.select(element)
      .append("svg")
      .attr("width", width)
      .attr("height", 8);

  let rectangles = svg.selectAll("rect")
    .data(d3.range(choices))
    .enter().append("rect")
      .attr("x", (d) => d*(width/choices))
      .attr("y", 0)
      .attr("height", (width/choices))
      .attr("width", 50)
      .attr("fill", "#DDDDDD")
      .attr("stroke", "#FFF")
      .attr("stroke-width", 1)
      .attr("id", (d) => d)
      .on("click", choose)

  // Select first element
  d3.select(rectangles._groups[0][0]).attr("fill", "#591FCE");

  function choose(d) {
    d3.selectAll("rect").attr("fill", "#DDDDDD");
    d3.select(this).attr("fill", "#591FCE");
    d3.select(`${element}-value`).text(d3.select(this).attr("id"));
    callback(d3.select(this).attr("id"));
  }
}

function ImageField(element, height, width) {
  /**
   * Field to draw images onto.
   * Currently loads these directly from disk, but
   * should instead calculate them directly.
   *
   * element: HTML element to attach to.
   * height, width: dimensions of the svg.
   *
   * return: update function that is to be called
   * on change.
   */
  let svg = d3.select(element)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

  let number = Math.round(Math.random() * 29);
  let img = svg.append("image")
      .attr("xlink:href", `http://blog.otoro.net/assets/20160401/png/mnist_input_${number}.png`)
      .attr("width", width)
      .attr("height", height);

  function update(id) {
    number = Math.round(Math.random() * 29);
    const link = `http://blog.otoro.net/assets/20160401/png/mnist_input_${number}.png`;

    img.attr("xlink:href", link);
  }

  return update
}

/*function toUniform(coordinates) {
let strings = coordinates.replace(/[^0-9\-.,]/g, '').split(',')
return strings.map((d) => parseInt(d)/50 - 2.5)
}*/
const dim = 150;

let updateFunction = ImageField("#image-field", dim, dim)
let l = MultinomialField(updateFunction, "#l-field", 370, 10);
let z = DrawingField(updateFunction, "#z-field", dim, dim);
