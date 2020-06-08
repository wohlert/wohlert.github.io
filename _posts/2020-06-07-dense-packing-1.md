---
layout: article
title: "Dense packing 1: Noisy channels"
date: 2020-06-07 00:00:00 +0200
categories: [information-theory]
description: Lorem ipsum dolor sit amet, consectetur adipisicing elit,
  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
  quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
image: /assets/images/pack1.jpg
---
_This is the first post in a series of posts on information theory in the context of unsupervised machine learning._
_The premise of this first post is to introduce basic concepts from information theory with the help of contrived examples and sketched proofs._

---

Let us say that you live in the 19??s and you're interested in phoning your aunt in Australia, but sending information over the phone lines is really expensive. In fact, you can only send *2 bits of information per second*, hardly enough to send even a squeek. Faced with these limitations, you therefore want to devise a clever plan to encode the message, but how could you go about this? With only 2 bits you can send the following symbols.

$$\{ 00, 01, 10, 11 \} = \{ A, B, C, s \}$$

In principle, this tiny alphabet will allow you encode any message. Truly, we could redefine the alphabet as `0 = A, 1 = B, s = 11` and have a whole letter left. This would give us the possibility of encoding the bitstring `01000101001` as `ABAAABABAABs` with `s` inidicating end of string. While this scheme allows us to transmit messages with zero **distortion** i.e. perfectly, it is still limited by the same bandwidth constraints. With the previous message taking 12 seconds to send, our effective **information rate** is only 12. 

Intuitively, we must think that we are able to do a tradeoff between the amount of error we incur in intepreting the original message (distortion) and the amount of information we must send per second (rate). In fact there is, and we have plotted the relationship in the case where sequence $X_1, \dots, X_n$ are i.i.d. Gaussians, $X_1 \sim \mathcal{N}(0, \sigma)$ and message reconstruction is measured in terms of mean-squared error.

![Rate distortion curve](assets/images/rate.svg)

To interpret the graph, let us fix our eyes on the case where $\sigma = 1$. In order to send the messages with virtually no loss of information, we would need at least 5 bits of information per symbol. If we can accept an error of 25%, meaning on average, every 4th symbol is wrong, we can get away with 1 bit. Since the level curves of this graph are defined by the variance of the Gaussian, we notice that the hardness of the problem is ultimately governed by the **entropy** of the source data[^shannon]. More random data being harder to compress.

## A contrived example

To get a better sense of this problem, let us allow ourselves to become more formal.

Define a coded alphabet as $\Sigma = \\{ A, B, C \\}$, with size $K = |\Sigma|$ along with our source random variable $X \sim \text{Beta}(2, 4)$. The choice of alphabet and distribution are arbitrary and serve only as example. We might segment this data based on three different criterions,
1. uniformly over the input space.
2. uniformly over input space, but transformed through the inverse density[^transform]. Which we call a probability-weighted segmentation of the input space.
3. closest centroid attained from $K$-means trained on samples from the distribution. 

These three options have been shown below, with an arrow indication their centers.

![Segmentations](assets/images/segment.svg)

We can define the encoder as a function that picks out the nearest centroid of the corresponding segmentation technique, $f_K(x) = {\arg \min_{i}} [\lVert c_i - x \rVert ]$. Along with a simple decoder, which picks the actual value of the center at this index $g(i) = c_i$. For convenience, each letter in the alphabet is just its alphabetical index, $A = 1, B = 2, ...$. This problem in itself is not very interesting, as what we have is just a deterministic approximation of the source variable, which has some quantisation error that is proportional to $1/K$.

To make the problem more interesting, let us introduce a stochastic additive variable to the encoding process, so now we have $f_K^{p}(x) = {\arg \min_{i}} [\lVert c_i - x \rVert ] + \xi \mod K$. Here, we denote $\xi \sim \text{Ber}(p)$ independent of $X$. So this encoder might randomly shift the code one bit, akin to a [Caesar cipher](https://en.wikipedia.org/wiki/Caesar_cipher). We might take this encoder to its natural limit $g(f^p_{\infty}(X))$ and inspect it. It is clearly surjective, but only injective for $p \in \\{ 0, 1 \\}$, and when these two conditions are met, it is homeomorphic to the unit sphere $S^1$ shown below. This means that we can write $g(f^{0 \vee 1}_{\infty}(X)) = e^{2 \pi i X}$.

<ul style="display: flex; flex-direction: column; flex-flow: row wrap; list-style: none; align-content: space-evenly; justify-content: center;">
  <li><img src="assets/images/3d-0.svg" /></li>
  <li><img src="assets/images/3d-1.svg" /></li>
  <li><img src="assets/images/3d-2.svg" /></li>
</ul>

A natural question is to ask if $g(f^{p}_K(X)) \xrightarrow{w} X$, and under which conditions for the noise process $\xi$ and centers $c_i$? Is there a covering set $c_i$ that has a better suited topology for the given problem than another? For the first question, we can show that for any $p \in [0, 1]$, this convergence holds when $K \to \infty$.

Notice that the addition of noise enables convergence in distribution, or weak convergence. But if we try to look at pointwise convergence, we go the other direction. If the sequence $X_n$ converges to $X$ weakly, we have that.

$\psi(Y) \sim  (1 - p)Y + pT_{1\|K}[Y]$, where $T_{1\|K}$ 

## When can noise actually help?

It would seem that the addition of noise hurts our performance, but actually, it can do the opposite.

If we consider instead a clean encoder, $f_K$ as described previously and a noisy decoder $g^{\sigma}(i) = c_i + \epsilon$, where $\epsilon \sim \mathcal{N}(0, \sigma^2)$ independent of $X$.

![Gain](assets/images/gain.svg)

Consider the random variable $X$ as described previously and a function $f(X) = Y \sim \text{Cat}(A, B, C)$ which fixes $X$ to its nearest neighbour in the code space. Now introduce the additive noise term $Z \sim \mathcal{N}(0, \sigma^2)$, $Z \perp Y$. We can then show that the random variable $\psi = f(X) + Z$ is distributed according the a Gaussian mixture distribution with density $f_{\psi}(x) = \sum_{k=1}^3 p_k f_{Z_k}(x)$, where each $Z_k \sim \mathcal{N}(k, \sigma^2)$. Here each of the mixture components share the same variance.

Getting the optimal gain we recover a Gaussian mixture model


## When can we perfectly capture the inputs?

We have seen that convergence in distribution is more easily attainable than pointwise convergence. In fact, noise injection appears to help us for convergence in distribution, as it provide topological covering in the absence of sufficient rate (if our channel is well calibrated). Still, the question remains to what degree we could reconstruct the inputs exactly, in the presence of noise or not.

The trivial results were already proven in the 1950s by Claude Shannon and they will tell you that data can be compressed losslessly down to the entropy of the signal and it can be transmitted with error bounded by the information rate. But Shannon (and lossless compression) is not all there is to be said about compression and error-free transmission. The assumuptions that Shannon and his peers built upon were very general channels and the data passed through are assumed to have certain structure, e.g. i.i.d. samples. Signal regularity has widely been used to write adaptive and domain specific channels, such as for [video coding](https://en.wikipedia.org/wiki/Video_coding_format) and [speech coding](https://en.wikipedia.org/wiki/Speech_coding), and machine learning is the current avenue for adaptive data-based compression.

As we will see in coming posts, posing learning as a noisy communication channel problem has far-reaching consequences for machine learning. It provides a trivial way to write down a likelihood function, which is given by reconstruction error. Additionally, due to its information theoretic properties, it is amenable to a Bayesian interpretation, for which is becomes simple to pose the problem of posterior inference - though this problem is not always easily solvable.

---

## Bibliography

<button type="button" class="collapser">Show proofs</button>

{::options parse_block_html="true" /}
<div class="collapse">

### Bernoulli noise is equivalent to mixture of two distributions

Let $X \sim \text{Cat} \left( \\{ p_k \\}_{k=1}^K \right )$ and let $Y \sim \text{Ber}(p)$, then define the sum $Z = X + Y$, the probability of $Z$ is given by.

$$
\begin{aligned}
\mathbb{P}(Z = z) &= \mathbb{P}(X + Y = z) = \mathbb{P}(X = z - Y) = \sum_{i = 1}^K \mathbb{P}(X = z - k) \mathbb{P}(Y = k)\\
&= \mathbb{P}(X = z - 1) p + \mathbb{P}(X = z) (1 - p)
\end{aligned}
$$

Now consider the same problem, but $Z$ is instead wrapped to the image of $X$, such that $Z' = X + Y \mod K$.

$$
\begin{aligned}
\mathbb{P}(Z' = z) &= \sum_{k=1}^K [z = k](p_kp + p_{(k+1 \mod  K)}(1 - p))
\end{aligned}
$$

This is equivalent to $Z' = (1 - p) \text{Cat}( p_k ) + p\text{Cat}(p_{(k+1 \mod K)})$, a mixture of $X$ with probability $1 - p$ and a shifted $X$ with probability $p$.

### Weak convergence of encoder-decoder

Let $h$ be a function which acts pointwise on $X$, then the expected reconstruction under $h$ is given by.

$$
\begin{aligned}
\lim_{N \to \infty} \mathbb{E}[h(g(f(X)))] &= \lim_{N \to \infty} \int_{-\infty}^{\infty} p_X(x) h(c_{\arg \min_{n} ||x - c_n||}) \ dx = \lim_{N \to \infty} \sum_{n=1}^N \int_{I_n} p_X(x) h(c_n) \ dx
\end{aligned}
$$

Where $I_n = \left [ c_{n-1} + \frac{c_{n} - c_{n-1}}{2}, c_{n} + \frac{c_{n+1} - c_{n}}{2} \right ]$ are segmentations of the real line based on the midpoint of subsequent cluster centers. By seeing that as $N \to \infty$, $\|I_n\| \to 0$ the statement above converges to a Riemannian integral.

$$
\begin{aligned}
\lim_{N \to \infty} \sum_{n=1}^N \int_{I_n} p_X(x) h(c_n) \ dx = \int p_X(x) h(x) \ dx = \mathbb{E}[h(X)]
\end{aligned}
$$

Which shows that $g(f(X)) \xrightarrow{w} X$ as $N \to \infty$. By the argument that $\| I_n \| \to 0$ with the noise process $\psi$ defined earlier, $g(\psi(f(X))) \xrightarrow{w} X$ similarly. Note that this proof only holds due to the facts that $\mathbb{R}$ has a total order and $h$ is Riemann integrable.

### Non pointwise convergence under random process

We define pointwise convergence of random variables similar as that for functions. Let $\omega \in \Omega$ be a point in the sample space, then the random variable $X_n$ converges pointwise to $X$ iff.

$$
\lim_{N \to \infty} |X_N(\omega) - X(\omega)| = 0, \forall \omega \in \Omega
$$

Consider the stochastic mapping induced by addition.

$$
\theta_N(\omega) = \frac{\omega}{N} + Y
$$

If we disregard $Y$, the function $\theta_N \to 0$, as $N \to \infty$ for any $\omega \in \mathbb{R}$. But if we for example consider $Y$ to be a stochastic mapping over another sample space $\Omega_Y = \\{0, 1 \\}$, such that $Y(\omega) = \\{ 1 \text{ if }\omega = 0, -1 \text{ if }\omega = 1 \\}$, then we never achieve pointwise convergence because of the offset. In fact, this will converge in distribution to $Y$ rather than $0$.

</div>

### Footnotes {#footnotes}

[^transform]: Consider the CDF of a distribution as $p = F(x; \theta)$ with inverse $x = F^{-1}(p; \theta)$ its quantile function. An index set $I \subset [0, 1]$ can then be pushed through the distribution $[0, 1] \supset I_F = F^{-1}(I; \theta)$

[^shannon]: Shannon's source coding theorem tells us that a sequence of $N$ i.i.d. random variables with entropy $H(X)$ cannot be perfectly compressed to less than $NH(X)$ bits. 