---
layout: article
title: "Variational Inference in Deep Generative Networks Explained"
date: 2018-08-01 12:00:00 +0100
description:
---

# Introduction and variational Bayes

$$p(x) = \int p(x, z) \ dz = \int p(x|z)p(z) \ dz$$

We are interested in the true posterior $p(z|x)$, but by Bayes' theorem this is intractable.
Introduce a variational distribution $q(z|x)$
 instead for which we hope that $q(z|x) \approx p(z|x)$.

$$p(x) = \int q(z|x) p(x|z) \frac{p(z)}{q(z|x)} \ dz$$

Parametrise by neural networks with parameters $(\theta, \phi)$.

$$p(x) = \int q_{\phi}(z|x) p_{\theta}(x|z) \frac{p(z)}{q_{\phi}(z|x)} \ dz$$

We want to maximise the log likelihood of the evidence.

$$\begin{aligned}
\log p(x) &= \log \bigg [ \int q_{\phi}(z|x) p_{\theta}(x|z) \frac{p(z)}{q_{\phi}(z|x)} \ dz \bigg ]\\
&\geq \int q_{\phi}(z|x) \log \bigg [ p_{\theta}(x|z) \frac{p(z)}{q_{\phi}(z|x)} \bigg ] \ dz\\
&= \int q_{\phi}(z|x) \log [ p_{\theta}(x|z) ] \ dz + \int q_{\phi}(z|x) \log \bigg [ \frac{p(z)}{q_{\phi}(z|x)} \bigg ] \ dz\\
&= \mathbb{E}_{q_{\phi}(z|x)}[\log p_{\theta}(x|z)] - D_{KL}(q_{\phi}(z|x) || p(z))
\end{aligned}$$

We sum over all datapoints, get the Evidence Lower Bound (ELBO).

$$\mathcal{L}(x; \theta, \phi) = \sum_{i=1}^{n} \mathbb{E}_{q_{\phi}(z|x^{(i)})}[\log p_{\theta}(x^{(i)}|z)] - D_{KL}(q_{\phi}(z|x^{(i)}) || p(z))$$

Concretely, how do we do this? The KL-divergence can usually be computed analytically, no problem. We can estimate any expectation using Monte-Carlo sampling from the variational posterior. What is $p(z)$? Prior distribution over latent variable.

$$\mathbb{E}_{q_{\phi}(z|x^{(i)})}[\log p_{\theta}(x^{(i)}|z)] \approx \frac{1}{L}\sum_{l=1}^{L} \log p_{\theta}(x^{(i)}|z^{(i, l)})$$

We take gradient of the ELBO and update the parameters of the network. In order to backpropagate through the sampling distribution, we will need to use the reparametrisation trick. If $q(z|x) \sim \mathcal{N}(z| \mu, \sigma)$, then $z^{(i, l)} = \mu^{(i)} + \sigma^{(i)} \odot \epsilon^{(l)}$, $\epsilon^{(l)} \sim \mathcal{N}(0, I)$.

No MCMC, large dataset. *amortized variational inference* refers to the fact that we perform MC samples of the gradient of the log likelihood and have an inference model.

## The density problem

The approximate posterior distribution $q(z|x)$ in variational inference is at the core of the problem of expressability. $q(z|x)$ needs to be a proper distribution such that we at the least can sample from it and find the log probability of some input. Additionally, we would also prefer to have something akin to the reparametrisation trick to compute gradients. For this reason, we have been limited to the normal distribution.

## Normalizing flows

Normalizing flows is perhaps the conceptually simple construction to consider. We start out with a random variable $z$ with a known density $p(z)$. For any smooth invertible mapping $f: \mathbb{R}^d \to \mathbb{R}^d$ we can completely characterise the random variable under the transformation $y = f(z)$ by the change of variables.

$$p(y) = p(f(z)) = p(z) \left | \det \frac{\partial f^{-1}}{\partial y} \right | = p(z) \left | \det \frac{\partial f}{\partial y} \right |^{-1}$$

One can imagine sending the random variable through a sequence of transforms $f_1 \circ f_2 \circ \dots \circ f_K$. The main contribution of the paper is to introduce a set of parameterised invertible transformations $\{f_k^{(u,v)}\}$ for which the log determinant can be computed in $\mathcal{O}(D)$ time.

## Gumbel softmax

So far we have only seen continuous latent distributions mainly due to the fact that it is convenient and the reparametrisation trick. It turns out that we can sample approximate categorical variables using a continuous distribution.

We can sample from the categorical distribution using softmax function $\sigma$ by
$y = \sigma \left ( \frac{x - \log (-\log \epsilon)}{\tau} \right )$, where $\epsilon \sim \mathcal{U}(0, 1)$

## Conditional prior

One can make a similar argument for the prior distribution $p(z)$, If we choose a prior that is similar to our approximate posterior, the KL-term will vanish $D_{KL}(q(z|x)||p(z)) \approxeq 0$.
Conditional priors

# Semi-supervised learning

Start with the same premise, assume that labels come from a categorical distribution, $p(y) \sim \text{Cat}(\pi)$.

$$\begin{aligned}
\log p(x, y) &= \log \bigg [\int q(y,z|x) p(x|y,z) \frac{p(y)p(z)}{q(y,z|x)} \ dz\bigg ]\\
&\geq \int q(z|y,x) \bigg [ \log p(x|y,z) + \log p(y) + \log \frac{p(z)}{q(z|y,x)} \ dz\bigg ]\\
&= \mathbb{E}_{q(z|y,x)}[ \log p(x|y,z)] + \log p(y) - D_{KL}(q(z|x,y)||p(z)) = -\mathcal{L}(x, y)
\end{aligned}$$

We don't have any labels, unlabelled case.

$$p(x) = \sum_y \int p(x, y, z) \ dz = \sum_y \int p(x|y,z)p(y)p(z) \ dz$$

Introduce variational distribution.

$$p(x) = \sum_y \int q(y,z|x) p(x|y,z) \frac{p(y)p(z)}{q(y,z|x)} \ dz$$

Compute ELBO. Assume that we know the value of $y$.


$$\begin{aligned}
\log p(x) &= \log \bigg [ \sum_y \int q(y|x)q(z|x) p(x|y,z) \frac{p(y)p(z)}{q(y|x)q(z|x)} \ dz \bigg ]\\
&\geq \sum_y q(y|x) \int q(z|x) \log \bigg [ p(x|y,z) \frac{p(y)p(z)}{q(y|x)q(z|x)} \bigg ] \ dz \\
&= \sum_y q(y|x) \bigg [ \int q(z|x) \bigg [  \log p(x|y,z) + \log \frac{p(z)}{q(z|x)}  \bigg ] \ dz + \log p(y) -  \log {q(y|x)} \bigg ] \\
&= \sum_y q(y|x) (-\mathcal{L}(x, y)) + \mathcal{H}(q(y|x)) = -\mathcal{U}(x)
\end{aligned}$$

Where $\mathcal{H}(p(x))$ denotes the entropy of the random variable $x$.

# Extensions

## Ladder

## DRAW and AIR

## Generative Query Network

This architecture builds on top of the convolutional DRAW model.
