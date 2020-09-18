---
layout: article
title: "The inverse kinematics trick"
date: 2020-08-07 00:00:00 +0200
description: We explore the inverse Jacobian method known from kinematics in the context of inverting learned models and present it as another "trick" in the ML toolbox.
keywords: machine-learning, inverse-kinematics, robotics, jacobian
image: /assets/images/kinematics.jpg
---

The animation below shows a simulated trajectory of the gripper of a robot arm with 6 degrees of freedom. Like a human arm, a robotic arm has a number of joints that can move in certain prescribed ways in order to grasp objects within reach. Just like how you can't lick your own elbow, there are certain positions a robot arm cannot come into, simply because of limitations in its joints. However, the motions that it can take depend solely on the _joint configuration_.

![Robot arm trajectory](assets/images/kinematics-anim.gif)

You may think of a single configuration as a point in a configuration space which is a product of $$n$$ joint spaces $$Q = \Pi_{i=1}^{n} Q_i$$, with some continuous function mapping the configuration space to 3d-space, $$f: Q \to \mathbb{R}^3$$, where the hand is. $$f$$ tells you if you have have a valid configuration of the joints $$q$$, then the arm is in some position in 3D space $$x = f(q)$$. This is also known as the forward kinematics model of the particular system[^alternate]. The main problem in (robot) kinematics is the _inverse_ kinematics $$q = f^{-1}(x)$$, in which we try to infer the sequence of joint configurations that will lead us to a particular position in space given that we are at some base position.

The problem seems straight forward, and it in fact it is as many robots have closed-form inverse kinematic models. But for some problems the function $$f$$ can act in a non-linear fashion that makes it difficult to invert exactly for all points in 3d space. Therefore, let us ask a different question. If we want to perturb the arm slightly from its current position to a neighbouring position $$x + \Delta x$$, how should we then go about changing the joints $$q = f^{-1}(x)$$ that correspond to the origin position? We can consider the differential (in one dimension),

$$d x = f'(q) dq$$

Which describes a best linearisation of $$f$$ around $$q$$, which you can consider to be a first-order Taylor expansion only being valid close to $$q$$. Since this equation is now linear, it and its multivariate counterpart are (pseudo-)invertible and we can write out the change in joints $$q$$ wrt. a small change in $$x$$ in the multivariable case as follows:

$$(q + \Delta q) = J_{f}(x)^{\dagger} (x + \Delta x)$$

Here $$( \cdot )^{\dagger}$$ represents the pseudo-inverse as $$J_{f}$$ is not necessarily square. But what we have essentially done here is _model inversion_ using 1700s techniques. With modern techniques such as singular value decomposition, the pseudo-inverse can be computed very easily. 

$$J_{f}(q)^{\dagger} = (U \Sigma V)^{\dagger} = V \Sigma^{-1} U$$

This decomposition tells us almost everything there is to know about the system at this specific point. For example $$\min(\sigma)/\max(\sigma)$$ will give you the sensitivity in 3-space wrt. the direction of change in joints. Similarly, the vector corresponding to the smallest singular value will give you the direction of least movement {% cite murray1994mathematical %}. Below is an example of an SVD of the Jacobian matrix of the system shown in the previous animation, this system happens to be trivially invertible and its inverse is exactly its transpose $$J_{f}(q)^{\dagger} = J_{f}(q)^T$$.

![SVD of the Jacobian matrix](assets/images/svd.svg)

Curiously, though not all systems provide an orthogonal Jacobian, we can still use the transpose as a heuristic as a faster, but more imprecise inversion method. If this approximation is close enough, we can determine a trajectory to a target point $$x^{\ast}$$ by using gradient descent on the relation.

$$q_{t+1} := q_t - \eta J_{f}^{T}(q_t)(x^{\ast} - f(q_t))$$

Which for small step size $$\eta$$ leads to a trajectory $$\{ q_0, \dots, q_T \}$$ such that $$x^{\ast} = f(q_T)$$. This sounds very nice and easy, but remember that we are attempting to find a solution to an inverse problem, so there might be no solutions or many similar solutions. Additionally, we are likely to have numerical blowups if we use such a naive technique[^notes].

---

## Use in machine learning literature

In the Gradient Origin Network paper {% cite bondtaylor2020gradient %}, the authors are working with differentiable function approximators (neural networks) and want to implicitly learn the latent space induced by a forward model. In the paper, this is contrasted with the use of a (variational) autoencoder, which amortises the assignment of points in the latent space using another neural network. The authors forego this by using the inverse Jacobian technique.

Analogous to the configuration space, we start out with a point in the latent space $$z_0$$, which is then run through the forward model in order to compute the gradient of the distance to the target $$(x - f(z_0))^2$$ wrt. $$z_0$$.

$$\tilde{\nabla} = \nabla_{z_0} (x - f(z_0))^2 = -2 J_{f}(z_0)^{T} (x - f(z_0)) \approx (z - z_0)$$

Then the negative gradient is run through the network again such that it is possible to directly perform joint optimisation of $$z_0$$ and the parameters of the network $$(\theta)$$. This is exactly the transpose Jacobian method with a single step of size $$\eta = 2$$.

The question is then, is there a best choice for $$z_0$$? As we insert the negative gradient back into the function $$f(-\tilde{\nabla})$$, there is a certain value that we want it to take, which is zero, because that means that we are at a gradient minimum. This follows directly from the reuse of $$f$$. This also hints at the name "gradient origin". At the time of writing, the connection between the inverse Jacobian method is not made in the paper, but the connection seems to be clear.

Despite the instability of this "trick", it could be interesting to explore in the context of other ML domains, such as model-based reinforcement learning, as the forward dynamics model is often given as a neural network that is non-invertible. Cheap (and correct) inversion of these models will tell you more about their learned representations.

## Bibliography

{% bibliography --cited %}

### Footnotes {#footnotes}

[^alternate]: In machine learning this might also be called the dynamics model or just "forward" model.
[^notes]: The notes by [Stefan Schaal](https://homes.cs.washington.edu/~todorov/courses/cseP590/06_JacobianMethods.pdf) provide excellent explanations about the development and improvement of these methods.