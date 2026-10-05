# Exporting the background picture with the EPANET file

Why File > Export EPANET file also saves a `.bmp` and a `.bpw`, and what each one holds. Harness:
`dev/lpn-spike/backdrop-export-roundtrip-browser-harness.js`.

## What Elm Street Center's backdrop is

A **user background picture**, not map tiles. `examples/Elm-Street-Center.lwn` holds a PNG site plan
in `backdrop.href` (1590 x 1599 pixels), and the project is a **grid (XY) project**, with no
`project.coords: 'geo'` and no basemap. Its numbers are state-plane feet (nodes near x 579 000,
y 1 304 000). So the export writes the picture the user added, in the grid frame. No tile
compositing is needed for it, and none was built. A tile basemap is `project.basemap`, never
`doc.backdrop`, and the writer still writes no `[BACKDROP]` FILE for one.

## Which pictures EPANET 2.2 can open as a backdrop

**BMP, EMF and WMF only. Not PNG and not JPEG.** Source: github.com/USEPA/EPANET2.2,
`Delphi_GUI/epanet2w`:

- `Fmain.dfm`, `OpenPictureDialog.Filter`:
  `All (*.bmp;*.emf;*.wmf)|*.bmp;*.emf;*.wmf|Bitmaps (*.bmp)|*.bmp|Enhanced Metafiles (*.emf)|*.emf|Metafiles (*.wmf)|*.wmf`.
- `Umap.pas`, `TMap.GetBackdrop`: `Picture.LoadFromFile(FullName)` on a Delphi `TPicture`, and
  on an exception the backdrop is dropped (`Fmap.pas OpenMapBackdrop`: "could not read backdrop").
  A `TPicture` reads PNG only when `Vcl.Imaging.pngimage` (or `PngImage`) is linked, and JPEG only
  with `Jpeg`/`Vcl.Imaging.jpeg`. None of the 52 units, the `.dpr` in `Delphi_GUI/epanet2w`, or the 7 units in `Delphi_GUI/components` mentions PNG or JPEG at all
  (checked by grep on 2026-10-05), so a PNG named in FILE fails to load, even if typed by hand.

**So the export saves a 24-bit BMP, not the PNG Tom named.** It is the one picture format that
EPANET desktop, this page and a GIS can all read. A PNG would have opened here and in a GIS, but
EPANET would report it could not read the backdrop. The cost is size: Elm Street's picture is
about 7.6 MB as a BMP.

How EPANET finds the file: `Fmain.pas` opens an `.inp` with `SetCurrentDir(ExtractFileDir(Fname))`
before reading it, so a **bare file name** in FILE finds the picture in the same folder.
`Uimport.pas ReadBackdropData` keeps only FILE's first token, so the name must have no spaces;
`safeFileName()` already turns spaces into dashes. If the file is missing, EPANET asks the user to
look for it (`Fmain.pas FindBackdropFile`).

How EPANET places it: `Umap.pas TMap.GetBackdropBounds`. The picture starts at
(LLx + OffsetX, URy − OffsetY) and fills the DIMENSIONS width when wider than 1:1, or else its
height, keeping its own shape. So **DIMENSIONS equal to the picture's own corners and OFFSET 0 0**
puts it back exactly, and that is what the export writes. The import (this branch) follows the same
rule, including a non-zero OFFSET.

## The world file

Six lines: A (pixel width in map units), D and B (rotation, 0 here), E (pixel height, negative),
C and F (the map position of the **centre** of the upper-left pixel, not its corner). Sources:
GDAL, "WLD -- ESRI World File" (gdal.org/en/stable/drivers/raster/wld.html); Esri, "World files for
raster datasets" (pro.arcgis.com/en/pro-app/latest/help/data/imagery/world-files-for-raster-datasets.htm).
A BMP's world file is `.bpw` by Esri's convention (first and last letter of the extension, plus
`w`); GDAL's BMP driver reads `.bpw`, `.bmpw` or `.wld` (gdal.org/en/stable/drivers/raster/bmp.html).

EPANET does not read a world file; it uses DIMENSIONS. The `.bpw` is for a GIS, and for this page's
own Background image > Add when the BMP and `.bpw` are picked together.

- **Grid project:** E is exactly −A, the one uniform scale this page draws a picture at, so
  Background image's own reader takes it back.
- **Geographic project:** DIMENSIONS are longitude and latitude (master's export). The world file
  is degrees per pixel on each axis, which a GIS reading longitude/latitude expects. The picture is
  drawn in Web Mercator, so that is a straight-line approximation of its latitudes, and EPANET
  desktop, which draws degrees unprojected, cannot show it registered either. This page's own
  re-import goes through DIMENSIONS and lands within a pixel. Background image > Add with that
  `.bpw` refuses it, because the two pixel sizes differ.

## What the user sees

Three downloads named after the project: `Name.inp`, `Name.bmp`, `Name.bpw`, a third of a second
apart. Chrome asks once, "This site is trying to download multiple files", Allow or Block. Firefox
saves them, or asks for each, depending on its own download setting. The status line says
"Exported Name.inp, the background picture Name.bmp and its world file Name.bpw. Keep the three in
one folder." The picture goes out at its own stored pixels, full strength, with nothing drawn in.

A browser that renames a repeated download (`Name (1).inp`) leaves that `.inp` naming `Name.bmp`.
This page's import offers the picker anyway and says when the chosen name differs. The File System
Access folder picker would avoid the renaming but needs Chrome or Edge and a second path; it was
not built.
