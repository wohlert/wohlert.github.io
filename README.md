# Uncorrelated

## Usage

1. Set a CNAME pointing to your web address, e.g. "uncorrelated.ml"
2. Update _config.yml

    make -f _Makefile server

This will compile the resources and put them into _site which is static
and will copy everything that does not start with underscore into it.

The stylesheets in _sass follow the SMACSS architecture. You should therefore
attempt to adhere to it. To simplify you can leave the code untouched and
add any site-specific code to the theme.scss file.

Posts need to be added to the _posts folder as markdown files with the format
yyyy-mm-dd-name.md.

Each post should have a header such as the following

    ---
    layout: article
    title: "Disentanglement and the nature of scientific discovery with machine learning"
    date: 2019-08-25 00:00:00 +0200
    categories: ["disentanglement", "concepts"]
    description: Lorem ipsum dolor sit amet, consectetur adipisicing elit,
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    --- 

Citations can be added to files by including the tag

    {% cite <tag> %}

where <tag> corresponds to a bibtex tag found in _bibliography/references.bib. At the end of the file
include

    {% bibliography --cited %}
    
to import all cited references.

Figures should be included as

    {% include figure.html url="assets/images/diagram-dis.svg" description="An image ‘x’ is explained is explained by a set of generative factors. These factors can be described by set of lower-level factors (dashed)." %}

Footnotes can be added using

    This is some text[^name]

and described as

    [^name]: That resolves to this footnote

All assets should be put into the assets/ folder

## Tested with

    ruby 2.4.1p111 (2017-03-22 revision 58053)
    node v12.8.0
    npm 6.10.3

## How do we keep a blog alive for 10+ years?

* Invest in technologies that last - css, html
* Manage dependencies meticously to avoid missing version. Freeze environments

