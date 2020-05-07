Quick start:
Engcalcs has no MVC model. Each calculator joins (bootstraps) the application by including lib/base.inc.php.

Developers 
1. Need to add their server name to lib/config.inc.php so that URLs work in the refs and menus and to turn on DEBUG_MODE.
2. Need to put engcalcs files one level below their web server so that any given calculator is http://server/folder/calculator.php unless they want to add a special $basedirectory setting to their section in config.inc.php.


TO DO:
-Make calculators into a modular project. DONE.
-Save named calculations. No.
-Sketch on irregular weir.
-Move sketch object to library from irregular manning.