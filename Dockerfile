# Build only reviewed public content; private source folders are excluded.
FROM nginx:1.30.6-alpine@sha256:0e52bd054126cdc040b1276c0af347aeb02a41b9cfe305d6094767ac30e97949
COPY nginx-main.conf /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --chown=101:101 html/ /usr/share/nginx/html/
# A public symlink could otherwise reach files provided by a runtime volume.
RUN set -eu; links="$(find /usr/share/nginx/html -type l -print -quit)"; \
    if [ -n "$links" ]; then echo "Public symlinks require explicit review" >&2; exit 1; fi
USER 101:101
ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
