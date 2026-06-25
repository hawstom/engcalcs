Quick start:
Engcalcs has no MVC model. Each calculator joins (bootstraps) the application by including lib/base.inc.php.

New developer setup instructions 
1. Add your server name to lib/config.inc.php or use an existing server name
  a) so that URLs work in the refs and menus and 
  b) to turn on DEBUG_MODE for development
2. Put engcalcs files one level below your web server so that any given calculator is http://server/folder/CalcX.php 
unless you want to add a special $basedirectory setting to your section in config.inc.php.


TO DO:
-Make calculators into a modular project. DONE.
-Save named calculations. No.
-Sketch on irregular weir.
-Move sketch object to library from irregular manning.