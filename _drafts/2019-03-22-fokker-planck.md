---
layout: article
title: "Fokker-planck and free energy"
date: 2019-03-22 08:00:00 +0100
description: We explore the relation between the Fokker-planck equation, variational free energy and optimal transport. Along with gradient flows and diffusion divergences.
categories: [variational inference, thermodynamics]
image: https://images.unsplash.com/photo-1566041510394-cf7c8fe21800?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80
---

In statistical mechanics we often consider the free energy functional for some
distribution of states $q$. Our goal is to minimise the free energy, but we
are constrained by the entropy of the distribution with temperature $\beta^{-1}$.

$$\mathcal{F}[q] = \mathbb{E}_{q}[\psi] - \beta^{-1} \mathcal{H}(q)$$

While this formulation does not seem immediately familiar to machine learning
practitioners, if we instead introduce a reference distribution $p$, we
arrive at the constrained optimisation framework known from variational
inference [Gelman, 2013]. Letting $\psi = -\log \hat{p}$ where $\hat{p}$ being the
unnormalised posterior distribution and $p$ a prior. The prior has the
form another [maximum entropy](#) distribution under the given constraint.

<!-- {% include figure.html description="Probability density on the sphere $S^2$" url="assets/images/globe.svg" %} -->

$$
\mathcal{F}[q] = \mathbb{E}_{q}[\psi] - \beta^{-1} D_{KL}(q||p) = \int_{\mathcal{X}} q(x) \left ( \psi(x) + \beta^{-1} \log  \frac{q(x)}{p(x)} \right ) dx
$$

We can find the optimal $q$-distribution by taking the functional derivative of
the free energy with respect to the distribution while upholding the constraint
$\int q(x) \ dx = 1$.

> **Theorem 1.1**: The optimal distribution is given by the product between the prior
and a Gibbs distribution.
>
> $$q^{\ast}(x) = p(x)e^{-\beta( \psi(x) + \lambda(x)) - 1} = \frac{1}{Z} p(x) e^{-\beta \psi(x)}
$$
>
> **Proof**
>
> The variational optimisation problem is given by minimisation of the functional
> $q$ is a proper distribution. First we define
> the modified functional.
>
> $$\mathcal{F}[q] = \int_{\mathcal{X}} F(q(x)) \ dx = \int_{\mathcal{X}} q(x) \left ( \psi(x) + \beta^{-1} \log  \frac{q(x)}{p(x)} \right ) \ dx\\+ \int_{\mathcal{X}} \lambda(x)(q(x) - 1) \ dx$$
>
> We can take the functional derivative with respect to the distribution,
> due to the fact that $\mathcal{F}$ has no dependence on the derivatives
> of $q$, it simplifies to a partial derivative of the function inside the integral[^1].
>
> $$\frac{\delta \mathcal{F}}{\delta q} = \frac{\partial F}{\partial q} = \beta^{-1} \left ( \log \frac{q}{p} + 1 \right ) + \psi + \lambda$$
>
> Setting this equal to zero and solving for $q$ will allow us to recover a fixed
> point, which in this case is the minimising distribution.
>
> $$\log q = \log p - (\beta \psi + \beta \lambda + 1)$$

A good question is now to ask where this variational formulation is even coming from.
If we instead consider the following differential equation, which is a specific case
of the Fokker-Planck equation.

\begin{align}
\frac{\partial q}{\partial t} &= \text{div} (\nabla \psi(x) q) + \beta^{-1} \left ( \Delta q - \Delta p - \nabla \cdot \langle \nabla \log p, q - p \rangle \right )
\end{align}

The formulation of the last term might occur unfamiliar, but this is merely the
formulation of a Bregman divergence

> **Theorem 1.2**: The solution to the modified Fokker-Planck equation is equivalent
to the one found by minimising the free energy function
>
> $$q^{\ast}(x) = \frac{1}{Z} p(x) e^{-\beta \psi(x)}
$$
>
> **Proof**
>
>Let us consider the Fokker-Planck equation with respect to a reference distribution $p$, it's differential form is given by.
>\begin{align}
    \frac{\partial q}{\partial t} &= \frac{\partial}{\partial x} \left ( \psi'(x) q \right ) + \beta^{-1} \frac{\partial}{\partial x} \left ( \frac{\partial q}{\partial x} - \frac{q}{p} \frac{\partial p}{\partial x} \right )
>\end{align}
>Integrating once and rearranging.
>\begin{align}
    - \beta \psi'(x) q &= \frac{\partial q}{\partial x} - \frac{q}{p} \frac{\partial p}{\partial x}
>\end{align}
>Separation of variables.
>\begin{align}
    \int \frac{dq}{q} &= - \beta \int \psi'(x) \ dx + \int \frac{\partial p}{\partial x} \frac{1}{p} \ dx
>\end{align}
>Which means that.
>\begin{align}
    \log q &= - \beta \psi(x) + \log p + C
>\end{align}
>The fundamental solution is given by $q(x) = \frac{1}{Z}p(x)e^{-\beta \psi(x)}$.
>

------

### References {#references}

[[1] Gelman, Andrew, et al. Bayesian data analysis. Chapman and Hall/CRC, 2013.](https://www.taylorfrancis.com/books/9781439898208)

### Footnotes {#footnotes}

[^1]: We can compute the $\lambda$-term in the normalisation, but this is uninteresting.    
