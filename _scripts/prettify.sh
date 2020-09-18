#!/usr/bin/env bash
set -e

for html_file_path in $(find ./_site -name '*.html' | sort); do
    echo -n "${html_file_path} ..."
    node _scripts/prettify_html.js "${html_file_path}"
    echo " Done"
done
