# My Website

This repository contains the bilingual personal website at
[gustavotzen.de](https://gustavotzen.de). It includes:

1. A personal and professional profile
2. A software portfolio
3. Public German and English resumes
4. Contact options
5. Links to the technical blog and self-hosted tools

The site publishes canonical URLs, reciprocal language alternates, structured
data, and a sitemap for search engines and retrieval services.


## Credits
This website was built on a template from [HTML5UP](https://html5up.net/).

Further credits belong to:
- [Font Awesome](https://fontawesome.com/) for the icons
- [jQuery](https://jquery.com/)
- [Scrollex](https://github.com/ajlkn/jquery.scrollex)
- [Responsive Tools](https://github.com/ajlkn/responsive-tools)

## Container deployment

The website is self-contained: `docker-compose.yaml`, `Dockerfile`,
`nginx-main.conf`, `nginx.conf`, `.dockerignore`, and the public `html/` folder.
The shared reverse proxy must already provide the external
`homelab-static-web` Docker network. The service has no published host ports.

From this repository directory:

```sh
docker compose config --quiet
docker compose up -d --build --wait
docker compose ps
```

Use the Docker context configured for the target machine. Rebuild after content
changes because public files are copied into the image; they are not bind-mounted.
The public hostname, HTTPS certificates and shared ingress are managed separately.
