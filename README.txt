Quick start:
Engcalcs has no MVC model. Each calculator joins (bootstraps) the application by including lib/base.inc.php.

Engcalcs assumes it is located one folder below the web root. In other words, from engcalcs/lib, define('BASE_DIRECTORY', realpath(__DIR__.'/../..'));

Developers 
1. Need to add their server name to lib/config.inc.php so that URLs work in the refs and menus and to turn on DEBUG_MODE.
2. Need to locate the engcalcs directory in the root directory of their web server so that any given calculator is http://server/folder/calculator.php unless they want to keep a special version of config.inc.php in their git repository.


TO DO:
-Make calculators into a modular project
-Save named calculations.
-Sketch on irregular weir
-Move sketch object to library from irregular manning.