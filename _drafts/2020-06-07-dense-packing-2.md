---
layout: article
title: "Dense packing 2: Learning problems"
date: 2020-06-07 00:00:00 +0200
categories: [information-theory]
description: Lorem ipsum dolor sit amet, consectetur adipisicing elit,
  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
  quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
image: /assets/images/pack2.jpg
---
_This is the second post in a series of posts on information theory in the context of unsupervised machine learning._
_The premise of this first post is to introduce basic concepts from information theory with the help of contrived examples and sketched proofs._

---

Contents:

* Moving to metric space code spaces
* PPCA
* Autoencoders
* VAE and why they suck

We can formulate the auto-encoding problem as a communication problem. On one end, we have a signal $X$, a random variable we want to transmit,
and on the other end we have $\bar{X}$ its reconstruction. In between this, we have a noisy communication channel, with symbols in the space of $\Sigma$. By noisy, we mean that there
is some process $\psi: \Omega \times \Sigma \to Z$ independent of $X$, which perturbs or corrupts the signal.

$$
X \xrightarrow{f} \Sigma \xrightarrow{\psi} Z \xrightarrow{g} \bar{X}
$$

Here, $f$ and $g$ are deterministic transformations and $\Sigma$ is an alphabet.

In the standard VAE problem, the noisy process is determined as a sample $z \sim \mathcal{N}(\mu(x), \sigma(x)^2)^{\otimes d}$, or equivalently $z = \mu(x) + \epsilon \odot \sigma(x)$. This means that the mapped alphabet code $\mu(x)$ is perturbed by the random vector $\vec{v} = \epsilon \odot \sigma(x)$ additively.


## The Bayesian footgun

There is no reason why we should be posing the problem as a noisy communication channel problem with some prior $p(z)$ other than for us to give us a Bayesian framework for which we can introduce variational approximations. We know that the choice of prior is not good in this case, because it forces unrealistic constraints. If we want to have anchoring we can simply introduce a penalty for divergence.

It is perhaps a remnant of probabilistic PCA? It works out well here because we have linear models operating on normal distributions. Our data is similarly assumed to have a simple topology induced by some mahalanobis distance.

In the above statement, it is clear that direct reconstruction is not possible under some arbitrary noise distribution, as we are only able to reconstruct up to the level of noise in the prior and in the data. Reconstructions are blurry because we are exactly convolving them with a heat kernel. We can give some concentration bounds on the convergence.

Noise injection is a strong thing as it allows us to define geometric bridges between objects. Think of convolution with diracs. Consider the denoising autoencoder with an attractor at the bottleneck layer, this is Taylor approximation [](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.51.3796&rep=rep1&type=pdf)

Is this inherently Bayesian? That is more of a philosophical question.

## Is it not funny?

In the next post we will elaborate from discrete code alphabet (A, B, C) to metric spaces in which we can define packings in terms of spheres and topologies induced by these.
