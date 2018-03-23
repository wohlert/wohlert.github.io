---
layout: article
title: "Grid cells in neural networks"
date: 2018-03-20 13:00:00 +0100
description: Grid cells as introduced by Moser & Moser can help
    explain many concepts in how animals navigate. We show that
    these neurons arrive naturally in RNNs.
---

The Auxiliary Deep Generative Network (ADGM) [[Maaløe 2016]](https://arxiv.org/abs/1602.05473) describes a generative model based on a variational autoencoder, which is enabled for semi-supervised learning [^1].

## Model performance

Notice how well the model performs in these charts.

<p><div id="chart"></div></p>

> In thermodynamics, the Helmholtz free energy is a thermodynamic potential that measures the "useful" work obtainable from a closed thermodynamic system at a constant temperature and volume. The negative of the difference in the Helmholtz energy is equal to the maximum amount of work that the system can perform in a thermodynamic process in which volume is held constant. If the volume is not held constant, part of this work will be performed as boundary work. The Helmholtz energy is commonly used for systems held at constant volume. Since in this case no work is performed on the environment, the drop in the Helmholtz energy is equal to the maximum amount of useful work that can be extracted from the system. For a system at constant temperature and volume, the Helmholtz energy is minimized at equilibrium.

The model attempts to capture both the labels and the underlying distribution at the same time and improves over [Kingma 2014] by introducing an auxiliary variable $a$. The Lower bound looks like this.

$$-\mathcal{L}(x, y) = \mathbb{E}_{q_{\phi}(z|x, y)} [ \log p_{\theta}(x|y, z) + \log p_{\theta}(y) + \log \frac{p(z)}{q_{\phi}(z|x, y)} ]$$

As a graphical model, it looks as follows^[There seem to be many different interpretations of $f(z)$, here we use $f(z) = 1/(1+ e^z)$.]. Notice how we have added the <mark>auxiliary variable</mark> $a$ into the model.

If the volume is not held constant, part of this work will be performed as boundary work. The Helmholtz energy is commonly used for systems held at constant volume. Since in this case no work is performed on the environment, the drop in the Helmholtz energy is equal to the maximum amount of useful work that can be extracted from the system. For a system at constant temperature and volume, the Helmholtz energy is minimized at equilibrium.

We can implement the training loop below.

{% highlight python %}
class DGMTrainer():
    def __init__(self, model, objective, optimizer, cuda=False):
        self.model = model
        self.objective = objective
        self.optimizer = optimizer
        self.cuda = cuda

    def calculate_loss(self, x, y=None):
        is_unlabelled = True if y is None else False

        x = Variable(x)
        logits = self.model(x)

        # If the data is unlabelled, sum over all classes
        if is_unlabelled:
            [batch_size, *_] = x.size()
            x = x.repeat(n, 1)
            y = torch.cat([generate_label(batch_size, i, n) for i in range(n)])

        y = Variable(y.type(torch.FloatTensor))

        if self.cuda:
            x = x.cuda()
            y = y.cuda()
{% endhighlight %}

------

### References {#references} 

[Kropff, E., Carmichael, J. E., Moser, M. B., & Moser, E. I. (2015). Speed cells in the medial entorhinal cortex. *Nature, 523*(7561), 419.](https://www.nature.com/articles/nature14622)

### Footnotes {#footnotes} 

[^1]: The gradient is actually given by $\nabla w = \frac{\partial f(w)}{\partial w}$.

<script src="https://unpkg.com/frappe-charts@0.0.8/dist/frappe-charts.min.iife.js"></script>
<script>
let sunspots = [132.9, 150.0, 149.4, 148.0,  94.4,  97.6,  54.1,  49.2,  22.5, 18.4,
      39.3, 131.0, 220.1, 218.9, 198.9, 162.4,  91.0,  60.5,  20.6,  14.8,
      33.9, 123.0, 211.1, 191.8, 203.3, 133.0,  76.1,  44.9,  25.1,  11.6,
      28.9,  88.3, 136.3, 173.9, 170.4, 163.6,  99.3,  65.3,  45.8,  24.7,
      12.6,   4.2,   4.8,  24.9,  80.8,  84.5,  94.0, 113.3,  69.8,  39.8];

let data = {
labels: [1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976,
  1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986,
  1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996,
  1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006,
  2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016] ,
datasets: [
  {
    "title": "Sunspots 1",
    "values": sunspots.map(x => 1.5*x)
  },
  {
    "title": "Sunspots 2",
    "values": sunspots.map(x => 0.8*x)
  },
  {
    "title": "Sunspots 3",
    "values": sunspots.map(x => 0.4*x)
  },
  ]
};

let chart = new Chart({
  parent: "#chart", // or a DOM element
  title: "Number of sunspots observed over time",
  data: data,
  type: 'line', // or 'line', 'scatter', 'pie', 'percentage'
  height: 250,
  is_series: true,
  show_dots: false,
  heatline: true,
  //region_fill: true,
  x_axis_mode: 'tick',
  y_axis_mode: 'span',

  colors: ["#A7FF83", "#17b978", "#086972"],

  format_tooltip_x: d => (d + '').toUpperCase(),
  format_tooltip_y: d => d.toFixed(2) + ' Observations'
});
</script>