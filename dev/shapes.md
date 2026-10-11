# Shapes (Task 779): branch notes

Tom, 2026-10-11: *"the main presenting use case I see for this is to import shapes from GIS or CAD
to guide precise placement or map supplementation in EPP."* So a Shape's coordinates are the
user's numbers: the Shapes table hands a pasted coordinate back character for character (each point
keeps its pasted text in `tok`, the channel an `.inp` coordinate uses, believed only while it still
reads as the stored number).

## The Shapes table

Columns ID (plain: a Shape has no rename), Description, Closed, Points. Points is the pipe Vertices
cell's format, `a/b|a/b|...` in the project's axis order (Lat/Lon, N/E, or X/Y) under the same
heading, so one reader serves both. Pasting over rows updates them in place, as every table does;
Paste as new rows (Ctrl+Shift+V) creates; one undo step either way. No scenario view: a Shape is in
no scenario.

## How shapefile and DXF import would land

Neither needs a new write path: each is a reader that turns a file into the rows the Shapes table
already accepts, `{id, desc, closed, pts}` with each coordinate's file text kept as `tok`, then
hands them to the same create path a pasted row takes (panePlanCreates() judges every row before
anything is written, a bad row refuses the lot with a named reason, and the whole import is one
undo step), exactly as the GeoJSON import (js/lpn-geojson.js) already does through its own copy of
that path. A shapefile (.shp/.shx/.dbf, plus .prj) is binary; the reader would map Point, PolyLine
and Polygon records to Shapes (one per part, as GeoJSON multipart features are), take the ID and
description from named .dbf columns, and refuse or reproject against the project's coordinate
system using .prj the way GeoJSON import does with EPSG:4326. A DXF reader would take POINT,
LWPOLYLINE (group 70 bit 1 = closed) and LINE from chosen layers, which is the mirror of what the
DXF export writes on `C-WATR-MODL-SHAP-<alt>`; its coordinates are already in project units. Until
either exists, the route is a GIS or CAD program's own attribute or coordinate export into a
spreadsheet, then a paste.
