# Pixel cartography

Terrain and bathymetry: Mapzen Terrain Tiles hosted by AWS Open Data, derived from SRTM, GMTED and ETOPO1. https://registry.opendata.aws/terrain-tiles/
Terrarium decoding: https://github.com/tilezen/joerd/blob/master/docs/formats.md
The half-degree grid is an artistic overview, not navigational data. Heights are quantized to 50m; polar regions beyond Web Mercator coverage are not resolved. Source tile images are temporary; only numeric samples ship.

Relief uses actual slope with a northwest light direction. Restricted palette transitions use local staggered Bayer dithering. Ocean depth thresholds are 200, 1000, 2500, 4000, 5500 and 7500m. Avoid tiled mountain icons and applying uniform noise over every surface.
Style reference: supplied IMG_2314.JPG. Technical references: https://www.naturalearthdata.com/downloads/10m-raster-data/10m-cross-blend-hypso/ and https://lospec.com/pixel-art-tutorials/dithering
