# Exporting the background picture with the EPANET file

Why File > Export EPANET file, on a project with a background picture, saves one `.zip` holding the
`.inp`, a `.bmp` and a `.bpw`, and what each one holds. Harness:
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
about 7.6 MB as a BMP, but it deflates to 89 KB inside the `.zip` (the whole archive is 91 KB).

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

## What the user sees: one .zip, not three downloads

`Name.zip`, holding `Name.inp`, `Name.bmp` and `Name.bpw`, and the status line: "Exported Name.zip,
holding the EPANET file Name.inp, its background picture Name.bmp, and the world file Name.bpw.
Extract all three into one folder, then open the .inp there in EPANET; the picture comes with it." A project with no picture
still downloads its bare `.inp`. A picture the page cannot read back (undecodable, or a canvas the
browser will not let it read) gives the bare `.inp` with no FILE line, and the status line says the
picture could not be saved and to add it in EPANET with View > Backdrop > Load.

**Why not three separate downloads.** The first build sent three, and in Tom's Chrome only the `.inp`
arrived. Chrome allows a site one download per user gesture; a second, even fired synchronously in
the same click handler, is held for its "Download multiple files" permission, and with that setting
at its default (ask) or at Block it never lands. Measured 2026-10-06 in Chrome 154 and in the
harness's Chromium, driven by raw CDP so Chrome's own download path is used, on the branch's
three-download code: default setting, `.inp` only; Block, `.inp` only; Allow, all three. Three
blob downloads fired synchronously in one click handler: one. The original harness had passed with
three files only because Playwright routes downloads through `Browser.setDownloadBehavior`, which
skips that limit (measured: three files even with Block). The harness's last section now drives
Chrome the raw way and checks the downloads folder.

**Rejected:** the File System Access folder picker (writes the three files with no renaming, but
Chrome and Edge only, and a second path for every other browser). The `.zip` works in every browser
with one gesture. Windows opens a `.zip` like a folder, but EPANET started from inside it sees only
the `.inp`, which is why the status line says to extract all three first. If the `.inp` is opened
without the picture beside it, EPANET asks for it (`Fmain.pas FindBackdropFile`).

**The picture's name is plain ASCII.** EPANET 2.2 desktop is a Delphi ANSI program and reads the
FILE line in the system code page, so a name outside it may not be found. The `.bmp` and `.bpw` take
the project name with accents removed and anything else outside A-Z, 0-9, `.`, `_` and `-` turned to a
dash (`Café-Ñandú-水` gives `Cafe-Nandu.bmp`), or `backdrop` when nothing is left. The `.inp` and the
`.zip` keep the project's own name. If the archive cannot be built, the export falls back to the
bare `.inp` with no FILE line and says the picture could not be saved.

The archive is written in the page (PKWARE APPNOTE: local headers, central directory, end record;
deflate through `CompressionStream('deflate-raw')`, stored when the browser lacks it; names flagged
UTF-8). The harness reads it back with node's zlib and checks every CRC; Info-ZIP `unzip -t` and
Python's `zipfile` accept it.

This page's own import does not open the `.zip`: re-importing means extracting it, importing the
`.inp`, and attaching the `.bmp` when the report offers it.
