---
layout: article
title: "Signals into the void 1: Noisy channels"
date: 2020-06-25 00:00:00 +0200
description: This is the first post of two on information theory in the context of unsupervised machine learning.
  The premise of this first post is to introduce some basic concepts and simple examples to get the thinking started.
image: /assets/images/pack2.jpg
keywords: machine-learning, information-theory, noisy-channels
---
_This is the first post of two on information theory in the context of unsupervised machine learning._
_The premise of this first post is to introduce some basic concepts and simple examples to get the thinking started._

---

Pretend that you are trapped in the now Russian wilderness near Vyborg in the year 1939. You're hiding in the snow and all you hear around you are faint screams. Naturally, as a last wish, you want to covertly send a message to your comrades, perhaps the instructions of your favourite recipe for poundcake, but your only means of communication is a flashlight. This allows you to send a whole *2 bits of information per second*. Faced with these limitations, you therefore want to devise a clever plan to encode the message, but how could you go about this? With only 2 bits (on and off) you can send the following symbols.

$$\{ 00, 01, 10, 11 \} = \{ A, B, C, s \}$$

In principle, this tiny alphabet will allow you encode any message. Truly, we could redefine the whole alphabet by repetition as `0000 = D, 0001 = E` and so forth to make every letter possible, but as our alphabet grows bigger, so does the time send a message. While this scheme allows us to transmit messages with zero **distortion** i.e. perfectly, it is still limited by the same bandwidth constraints, and the Russians are coming quick. So what if you added some randomness? For example set `0000 = A = H`, where the same bitstring can represent two different letters. This can give some errors in interpretation, but if the receiver knows the language well enough, they will probably be able to disambiguate it and you can now 'type' faster.

Intuitively, we must think that we are able to do a tradeoff between the amount of error we incur in interpreting the original message (distortion) and the amount of information we can send per second (rate). In fact there is, and we have plotted the relationship in the case where sequence $$X_1, \dots, X_n$$ are i.i.d. Gaussians, $$X_1 \sim \mathcal{N}(0, 1)$$ and message reconstruction is measured in terms of mean-squared error. This is otherwise known as the rate-distortion curve for a channel[^rate].

![Rate-distortion curve for Gaussian channel with fixed variance](assets/images/rate-sigma.svg)

Reading the graph, in order to send the messages with virtually no loss of information, we would need at least 5 bits of information per symbol. If we can accept an error of 25%, meaning on average, every 4th symbol is wrong, we can get away with 1 bit. Note that this curve is specific for the case where the source variable is Gaussian and the channel has the property of being memoryless. We can draw many curves like this for different variances of the Gaussian and what we will find is that the hardness of the problem is ultimately governed by the **entropy** of the source data[^shannon] - more random data being harder to compress.

## The setup

To get a better sense of this tradeoff, let us allow ourselves to become more formal.

Define a code alphabet as $$\Sigma = \{ A, B, C \}$$, with size $$K = |\Sigma|$$ along with our source random variable $$X \sim \text{Beta}(2, 4)$$, which is the "data" that we are interested in. The choice of alphabet and distribution are arbitrary and serve only as example. Given the limited capacity of the alphabet, we have many possible configurations to choose from to segment the data. Limiting ourselves to a metric space viewpoint, we consider three of such configurations,
1. uniformly over the range of $$X$$.
2. uniformly over the range of $$X$$, but transformed through the inverse density[^transform]. Which we call a probability-weighted segmentation of the input space.
3. closest centroid attained from $$K$$-means trained on samples from the distribution. 

These three options have been shown below, with an arrow indication their midpoints.

![Segmentations](assets/images/segment-beta.svg)

We can define the encoder as a function that picks out the nearest midpoint/centroid of the corresponding segmentation technique, $$f_K(x) = {\arg \min_{i}} [\lVert c_i - x \rVert ]$$. Along with a simple decoder, which picks the actual value of the centroid at this index $$g(i) = c_i$$. For convenience, each letter in the alphabet is just its alphabetical index, $$A = 1, B = 2, ...$$. This problem in itself is not very interesting, as what we have is just a deterministic approximation of the source variable, which has some quantisation error that is proportional to $$1/K$$. The deterministic problem is well studied for both of static  and adaptive approached, for which the latter is known as vector quantisation {% cite friedman2001elements %}.

To make the problem more interesting, let us introduce a stochastic variable that is added to the encoding process, so now we have $$f_K^{p}(x) = {\arg \min_{i}} [\lVert c_i - x \rVert ] + \xi \mod K$$. Here, $$\xi \sim \text{Ber}(p)$$ is independent of $$X$$ and can be considered noise in the channel - so this encoder might randomly shift the code one bit to the right, akin to a [Caesar cipher](https://en.wikipedia.org/wiki/Caesar_cipher). This distribution is actually very simply expressed as a [mixture of two distributions ([proof](#bernoulli-noise-is-equivalent-to-mixture-of-two-distributions)). *We will analyse this simple construction in depth to understand how noisy channels behave.*

First, we can get the trivial behaviours out the way. If we take this encoder to its natural limit of segmentations by looking at $$\hat{X} = g(f^p_{\infty}(X))$$, we end up with a surjection wrt. the source signal. The quantisation error vanishes and $$\hat{X}$$ converges in distribution to $$X$$. However, due to the stochasticity induced by the noise process, we do not have a bijection and we will not have almost-sure convergence. If we instead set $$p \in \{ 0, 1 \}$$, we can guarantee almost-sure convergence. This also has the nice side-effect that we can interpret the signal as being on the unit sphere $$S^1$$, $$g(f^{0 \vee 1}_{\infty}(X)) = e^{2 \pi i X}$$, shown below.

![Wrapped beta distribution](assets/images/wrapped-beta.svg)

As mentioned, these cases are trivial and generally not practically feasible to consider. Therefore, to investigate further, we pose the following question three questions.

* Under which conditions does $$g(f^{p}_K(X)) \xrightarrow{w} X$$ (convergence in distribution)?
* Under which conditions (if any) does $$g(f^{p}_K(X)) \xrightarrow{P} X$$ (convergence in probability)?
* Which effect does the topology of the centroids have on these types of convergence?

## An experiment

We can create a small experiment based on samples drawn from the distribution. We again have the three segmentation strategies highlighted earlier, but we vary the number of segmentations of the code space. We then measure two quantities of the reconstructed data. First, the CDF error, which is a measure of how similar the empirical CDF differs from the ground truth one on average for the whole data. Secondly, the packet error ratio, measuring the proportion of input signals that are perfectly reconstructed up to some error $$\epsilon$$.

Mathematically, we can define the reconstructed signal as $$\hat{X} = g(f^{p}_K(X_i))$$ and fix $$p = 1/4$$. We call $$\hat{F}_n$$ the $$n$$ sample estimated empirical CDF of $$\hat{X}$$. Then we define the distribution error $$E_d$$ and the packet error ratio as $$E_p$$.

$$
E_{\text{d}} = \sup_t \| \hat{F}_n(t) - F(t) \|, \qquad E_{\text{p}}=\frac{1}{n}\sum_{i=1}^n\left(\|\hat{X}_i-X_i\|>\epsilon\right)
$$

You will notice that the first error measures the convergence in distribution $$\hat{X} \xrightarrow{w} X$$ as a function of $$K$$ and the second is a measure of convergence in probability $$\hat{X} \xrightarrow{p} X$$. Intuitively, we expect higher information content (fidelty/rate) when we have more segmentations.

![Distribution error and packet error](assets/images/transmission_errors.svg)

From the figure on the left, we can see that the error asymptotically approaches $$0$$ as we increase the number of segmentations. Also notice that the curves presented in both plots bear a similarity to the rate distortion curves discussed earlier, only here they are more complex because our source is different. We can show that for any $$p \in [0, 1]$$, the convergence in distribution holds exactly when $$K \to \infty$$ ([proof](#weak-convergence-of-encoder-decoder)). The speed of convergence towards this asymptote varies with the choice of topology. Especially when the number of segmentations are few we see a large gap in performance between the uniform approach compared to the two others. This tells us that the topology is critical in the low fidelity regime.

The packet error (computed with $$\epsilon = 10^{-4}$$)[^epsilon] similarly shows that the choice of topology is important. But the capacity of the channel, which is here denoted by the number of segmentations, must increase much more before we can reliable send and receive the messages. Even with $$4096$$ segmentations, or $$12$$ bits, we still receive the wrong message 20% of the time!

How could we improve on this estimate? Well, we can try integrate out the noise by performing clever sampling from the channel. As we know that the source of noise is inherit to the channel, we can probe the noise process by sending multiple instances through the channel. This will hold as long as we know what the ground truth signal is, and only when the noise process is stationary. We can devise an algorithm based on Monte-Carlo sampling below.

```python
def encode(value):
  # Noisy channel encode
  ...


def mean_statistic(samples):
  acc = 0
  for code in samples:
    acc += samples

  acc /= len(samples)
  return acc


def monte_carlo(num_samples, sample_statistic=mean_statistic):
  samples = [encode(message) for _ in range(num_samples)]
  return sample_statistic(responses)
```

![Monte Carlo error estimates for packet error ratio](assets/images/monte-carlo-error.svg)

In the above example, the sample statistic is based on a median and floor filter over a window of 5 observations or random draws. By picking the right type of filter, which in this case we know to be a flooring operation, we can retain a consistent lower bound error rate up to when $$p=3/4$$, which is a significant improvement over the raw interpretation from the channel.

The intuition here is that convergence in probability is quite a bit more difficult than convergence in distribution. We require orders of magnitude more channel capacity to effectively transmit the message contentwise correctly rather than just distributionally correctly. When the channel is noisy this is further complicated as certain packets are transmitted wrongly. Noise has little effect on the overall distribution, but make pointwise reconstruction difficult. However, we see that we can perform tricks to improve message interpretation if we know something about the noise.

## Side note: When can noise actually help?

While we have vilified noise showing that it makes interpreting signals more difficult, it can actually be helpful in some instances. It is especially useful in the cases where we are more interested in the shape or distribution of the data rather than the bitwise reconstruction.

If we go back to the previous definitions of encoder/decoder and consider instead a clean encoder, $$f_K$$ with a noisy decoder $$g^{\sigma}(i) = c_i + \epsilon$$, where $$\epsilon \sim \mathcal{N}(0, \sigma^2)$$ independent of $$X$$. We then fix the number of segmentations by setting $$K = 3$$ and vary the standard deviation of the additive noise and then measure $$E_{d}$$ as before. What we find is that there is a certain sweet spot of 

![Gain](assets/images/gain-reconstruction.svg)

We obtain an optimal (global) noise value at around $$\sigma = 0.1$$ and notice that the $$K$$-means approach works best. Somehow, the addition of noise at the correct magnitude performs better than no noise at all. Why does this seem to work?

Because we are measuring the discrepancy in distribution terms, rather than in a pointwise manner, the noise helps to fill the "holes" that are left behind by not having a high enough fidelity ($$K$$). What we are actually doing here is modelling the source variable as a Gaussian mixture model with three components and shared variance, but rather than using the common EM-approach of finding centers, we have chosen them more arbitrarily. What we do see is that the choice of topology is again important to get a correct coverage of the code-space. These centers must be distributed non-overlappingly according to some *maximum likelihood* law, rather than an a-priori maximally covering law.

> If our topology is a minimally covering set and the noise process is locally applied to clusters it allows us to build bridges.

The UMAP {% cite mcinnes2018umap %} method is a beautiful application of this principle, in which simplical complexes are used to construct this covering set.

![Gaussian noise on surface points](assets/images/noisy-surface.svg)

## When can we perfectly capture the inputs?

We have seen that convergence in distribution is more easily attainable than pointwise convergence. In fact, noise injection appears to help us for convergence in distribution, as it provide topological covering in the absence of sufficient rate (if our channel is well calibrated). Still, the question remains to what degree we could reconstruct the inputs exactly, in the presence of noise or not.

The trivial results were already proven in the 1950s by Claude Shannon {% cite mackay2003information %} and they will tell you that data can be compressed losslessly down to the entropy of the signal and it can be transmitted with error bounded by the information rate. But Shannon (and lossless compression) is not all there is to be said about compression and error-free transmission. The assumuptions that Shannon and his peers built upon were very general channels and the data passed through are assumed to have certain structure, e.g. i.i.d. samples. Signal regularity has widely been used to write adaptive and domain specific channels, such as for [video coding](https://en.wikipedia.org/wiki/Video_coding_format) and [speech coding](https://en.wikipedia.org/wiki/Speech_coding), and machine learning is the current avenue for adaptive data-based compression.

As we will see in next post, posing learning as a noisy communication channel problem gives us the ability do well-posed[^well-posed] maximum (approximate) likelihood estimation in an unsupervised way. It provides a trivial way to write down a likelihood function, which is given by reconstruction error. Additionally, due to its information theoretic properties, it is amenable to a Bayesian interpretation, for which is becomes simple to pose the problem of posterior inference - though this problem is not always easily solvable.

---

## Bibliography

{% bibliography --cited %}

<button type="button" class="collapser">Show proofs</button>

{::options parse_block_html="true" /}
<div class="collapse">

### Bernoulli noise is equivalent to mixture of two distributions

Let $$X \sim \text{Cat} \left( \{ p_k \}_{k=1}^K \right )$$ be a distribution of a set of $$K$$ categories with probability of class $$k$$ being $$p_k \geq 0$$, and let $$Y \sim \text{Ber}(p)$$. Define their sum as $$Z = X + Y$$. The probability of $$Z$$ is given by.

$$
\begin{aligned}
\mathbb{P}(Z = z) &= \mathbb{P}(X + Y = z) = \mathbb{P}(X = z - Y) = \sum_{i = 1}^K \mathbb{P}(X = z - k) \mathbb{P}(Y = k)\\
&= \mathbb{P}(X = z - 1) p + \mathbb{P}(X = z) (1 - p)
\end{aligned}
$$

Now consider the same problem, but $$Z$$ is instead wrapped to the image of $$X$$, such that $$Z' = X + Y \mod K$$.

$$
\begin{aligned}
\mathbb{P}(Z' = z) &= \sum_{k=1}^K [z = k](p_kp + p_{(k+1 \mod  K)}(1 - p))
\end{aligned}
$$

This is equivalent to $$Z' = p\text{Cat}( \{ p_{k+1 \mod K} \} ) + (1 - p) \text{Cat}( \{ p_k \} )$$, a mixture of $$X$$ with probability $$1 - p$$ and a shifted version of $$X$$ with probability $$p$$. So adding Bernoulli noise to a categorical variable leads to a convex mixture of categorical distributions.

### Weak convergence of encoder-decoder

Let $$h$$ be a function which acts pointwise on $$X$$, then the expected reconstruction under $$h$$ is given by.

$$
\begin{aligned}
\lim_{N \to \infty} \mathbb{E}[h(g(f(X)))] &= \lim_{N \to \infty} \int_{-\infty}^{\infty} p_X(x) h(c_{\arg \min_{n} ||x - c_n||}) \ dx = \lim_{N \to \infty} \sum_{n=1}^N \int_{I_n} p_X(x) h(c_n) \ dx
\end{aligned}
$$

Where $$I_n = \left [ c_{n-1} + \frac{c_{n} - c_{n-1}}{2}, c_{n} + \frac{c_{n+1} - c_{n}}{2} \right ]$$ are segmentations of the real line based on the midpoint of subsequent cluster centers. By seeing that as $$N \to \infty$$, $$\|I_n\| \to 0$$ the statement above converges to a Riemannian integral.

$$
\begin{aligned}
\lim_{N \to \infty} \sum_{n=1}^N \int_{I_n} p_X(x) h(c_n) \ dx = \int p_X(x) h(x) \ dx = \mathbb{E}[h(X)]
\end{aligned}
$$

Which shows that $$g(f(X)) \xrightarrow{w} X$$ as $$N \to \infty$$. By the argument that $$\| I_n \| \to 0$$ with the noise process $$\psi$$ defined earlier, $$g(\psi(f(X))) \xrightarrow{w} X$$ similarly. Note that this proof only holds due to the facts that $$\mathbb{R}$$ has a total order and $$h$$ is Riemann integrable.

</div>

### Footnotes {#footnotes}

[^transform]: Consider the CDF of a distribution as $$p = F(x; \theta)$$ with inverse $$x = F^{-1}(p; \theta)$$ its quantile function. An index set $$I \subset [0, 1]$$ can then be pushed through the distribution $$[0, 1] \supset I_F = F^{-1}(I; \theta)$$

[^shannon]: Shannon's source coding theorem tells us that a sequence of $$N$$ i.i.d. random variables with entropy $$H(X)$$ cannot be perfectly compressed to less than $$NH(X)$$ bits. 

[^epsilon]: This plot is actual better conveyed as three-dimensional, where the choice of epsilon varies over this new direction. Here we have picked an arbitrary threshold to simplify the plots.

[^well-posed]: Actually, the degree to which this is actually all that well-posed is one of the points of contention in the following post.

[^rate]: For an introduction to this concept, the [wikipedia article](https://en.wikipedia.org/wiki/Rate%E2%80%93distortion_theory#Memoryless_(independent)_Gaussian_source_with_squared-error_distortion) is quite good.