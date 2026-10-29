# Shapes (Task 779): branch notes

Tom, 2026-10-11: *"the main presenting use case I see for this is to import shapes from GIS or CAD
to guide precise placement or map supplementation in EPP."* So a Shape's coordinates are the
user's numbers: the Shapes table hands a pasted coordinate back character for character (each point
keeps its pasted text in `tok`, the channel an `.inp` coordinate uses, believed only while it still
reads as the stored number).

## The Shapes table

Columns ID (plain: a Shape has no rename), Description, Closed, Points, then Is active (last, so a four-column paste still lands). Points is the pipe Vertices
cell's format, `a/b|a/b|...` in the project's axis order (Lat/Lon, N/E, or X/Y) under the same
heading, so one reader serves both. Pasting over rows updates them in place, as every table does;
Paste as new rows (Ctrl+Shift+V) creates; one undo step either way. A Shape's one scenario value is Is
active (Task 831; `dev/shapes-and-scenarios.md`); its points are Base's, the same in every scenario.

## Shapefile and DXF import (built)

Two readers in `js/lpn-gisread.js` (pure; `lpnDxfShapes`, `lpnShapefileRead`) and a placing half in
`js/looped-network.js` (`landDxfShapes`, `landShapefileShapes`, `gisPlaceShapes`), behind File >
Import > Import DXF shapes... and Import shapefile shapes.... The same ID rule, kept names and one
undo step as the GeoJSON import. No library: the shapefile, dBASE and ZIP layouts are read by hand
and a deflated zip entry is inflated by the browser's DecompressionStream.

- DXF (ASCII only): POINT, LINE, LWPOLYLINE, POLYLINE (group 70 bit 1 = closed). Layer name goes to
  the Shape's `props.layer`. Every other entity is counted by type in the notice, entities inside
  BLOCKS as one count, arc segments (bulge) are read as chords and counted. A DXF states no
  coordinate system, so it is read as the project's own X and Y (units from `$INSUNITS` compared and
  a difference said); a latitude-and-longitude project refuses it.
- Shapefile: .zip, or the .shp with .dbf/.prj/.cpg picked together. Point, MultiPoint, PolyLine,
  Polygon and the Z/M forms (Z and M ignored); a multipart record is one Shape per part; a
  polygon's clockwise rings are Shapes and its counterclockwise rings (holes) are counted and not
  imported. The .dbf columns become `props`; a NAME or ID column is the ID where it can be one,
  else kept as the description; DESCRIPTION or DESC is the description.
- Coordinates, converted only where said: a projected .prj that differs from the project is converted through longitude and latitude by the suite's CRS definitions and the notice says from what to what; refused only when the file's system cannot be identified (grid projects keep reading it as X and Y). F starts the Shape tool.
  lat/lon project, the map's transform into a projected one, refused into a grid project); a
  projected .prj is read unchanged only when its EPSG code is the project's, and refused into a
  lat/lon project or a project with another code; into a grid project it is read as X and Y and the
  .prj is named; with no .prj the numbers are the project's own (a lat/lon project requires them to
  be in range). Every case says which in the notice.
- Fixtures: `node dev/lpn-spike/fixtures/make-shape-fixtures.js`; harness `shape-import-harness.js`.
