<?php
define('BASE_DIRECTORY', realpath(__DIR__.'/..'));
require_once (BASE_DIRECTORY."/engcalcs/lib/base.inc.php");
$html_title = $ec_lang['mtc_main_title'];
$html_head='
    <meta name="Description" content="'. $html_title .'" />
    <meta name="Keywords" content="wier vetedero calculac&iacute;on calcular calculacion calculation" />
';
echoHeader("EngCalcs", $html_title, $html_head);

?>
<h2><?=$ec_lang['mtc_main_desc']?></h2>
<?php echoHelpWanted(); ?>

<?php
echoCalculatorForm(
    //Inputs
    Array(
        Array('name' => 'b', 'type' => 'number', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mtc_bottom_width']),
        Array('name' => 'z1', 'type' => 'number', 'units' => NULL, 'label' => $ec_lang['mtc_side_slope_1']),
        Array('name' => 'z2', 'type' => 'number', 'units' => NULL, 'label' => $ec_lang['mtc_side_slope_2']),
        Array('name' => 'n', 'type' => 'number', 'units' => NULL, 'label' => $ec_lang['mpf_manningRoughness'].' <a target="_blank" href="http://www.engineeringtoolbox.com/mannings-roughness-d_799.html">?</a>'),
        Array('name' => 's0', 'type' => 'number', 'units' => Array('grade', 'gradePercent'), 'label' => $ec_lang['mtc_channel_slope']),
        Array('name' => 'y', 'type' => 'number', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mtc_flow_depth']),
        Array('name' => 'beta', 'type' => 'number', 'units' => NULL, 'label' => $ec_lang['mtc_bend_angle']),
        Array('name' => 'sgrock', 'type' => 'number', 'units' => NULL, 'label' => $ec_lang['mtc_sgrock'])
    ),
    //Results
    Array(
        Array('name' => 'a', 'units' => Array('m2', 'mm2', 'ft2', 'in2'), 'label' => $ec_lang['mpf_flow_area']),
        Array('name' => 'pw', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mpf_wetted_perimeter']),
        Array('name' => 'rh', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mpf_hydraulic_radius']),
        Array('name' => 'v', 'units' => Array('mps', 'ftps', 'mph'), 'label' => $ec_lang['mpf_velocity']),
        Array('name' => 'q', 'units' => Array('m3ps', 'lps', 'mld', 'ft3ps', 'gpm', 'mgd'), 'label' => $ec_lang['mpf_flow']),
        Array('name' => 'hv', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mpf_velocity_head']),
        Array('name' => 't', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mpf_top_width']),
        Array('name' => 'f', 'units' => NULL, 'label' => $ec_lang['mpf_froude_number']),
        Array('name' => 'tau', 'units' => Array('npm2', 'psf'), 'label' => $ec_lang['mpf_shear_stress']),
        Array('name' => 'd50_strickler', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mtc_d50_strickler']),
        Array('name' => 'd50_bottom', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mtc_d50_bottom']),
        Array('name' => 'd50_z1', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mtc_d50_z1']),
        Array('name' => 'd50_z2', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mtc_d50_z2']),
        Array('name' => 'd50_mra', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mtc_d50_mra']),
        Array('name' => 'd50_searcy', 'units' => Array('m', 'mm', 'ft', 'in'), 'label' => $ec_lang['mtc_d50_searcy']),
    )
);
?>

<div id="sketch"></div>

<?php echoFeedback(); ?>
<script type="text/javascript">
EngCalcs.pageCalculator = function(objForm) {
    var
    c = 1.0,
    g = 9.806,
    gammawater = 9806,
    b = objForm['b'].value / objForm['bu'].value,
    y = objForm['y'].value / objForm['yu'].value,
    // Use unary + to convert form values to numbers
    // so when we add z1 and z2 they don't get concatenated.
    z1 = +objForm['z1'].value,
    z2 = +objForm['z2'].value,
    s0 = objForm['s0'].value / objForm['s0u'].value,
    n = objForm['n'].value,
    beta = objForm['beta'].value,
    sgrock = objForm['sgrock'].value,
    a,
    pw,
    rh,
    t,
    v,
    hv,
    q,
    froude,
    tau,
    c_isbash,
    d50_bottom,
    d50_z1,
    d50_z2;
    a = y * (b + (z1 + z2) * y / 2);
    pw = b + y * (Math.sqrt(1 + z1 * z1) + Math.sqrt(1 + z2 * z2));
    rh = a / pw;
    t = b + y * (z1 + z2);
    v = c/n*Math.pow(rh,2/3)*Math.pow(s0,0.5);
    hv=v * v / (2 * g)
    q = v*a;
    froude = v * Math.sqrt(t/(g * a * Math.cos(Math.atan(s0))));
    tau = gammawater * rh * s0;
    c_isbash = (beta <= 30) ? 1.2 : 0.86;
    d50_strickler = Math.pow(n * 21.1, 6); // n = 1/21.1 D ^ (1/6)
    d50_mra = 0.031 * Math.pow(v, 2.5) / (Math.pow(sgrock - 1, 0.25) * Math.pow(y, 0.25) * ((beta <= 30) ? 1 : 1.5));
    d50_searcy = 0.022 * v * v;
    d50_bottom = mc_riprap_size(y, a, v, g, 1000, s0, c_isbash, sgrock);
    d50_z1 = mc_riprap_size(y, a, v, g, z1, s0, c_isbash, sgrock);
    d50_z2 = mc_riprap_size(y, a, v, g, z2, s0, c_isbash, sgrock);

    // Sketch
    gymax = 100; // Max graphic flow depth
    garmax = 6; // Max graphic aspect ratio
    gar = t/y; // Flow aspect ratio
    gt = Math.min(garmax, gar) * gymax; // Graphic flow width
    gs = gt/t; // Graphic scale
    gy = gs * y;
    gh = gy + gymax/2; // SVG height
    gyb = gy + gymax/4 // Bottom of flow
    gyt = gymax/4 // Top of flow
    gw = gt; // SVG width
    gxb1 = z1 * y * gs;
    gxb2 = gxb1 + b * gs;
    gxm = gw/2;
    gtx1 = gxm - gymax/16;
    gtx2 = gxm + gymax/16;
    gty = gyt - gymax/8;

    document.getElementById('q').innerHTML = (q * objForm['qu'].value).toFixed(2);
    document.getElementById('v').innerHTML = (v * objForm['vu'].value).toFixed(2);
    document.getElementById('hv').innerHTML = (hv * objForm['hvu'].value).toFixed(2);
    document.getElementById('a').innerHTML = (a * objForm['au'].value).toFixed(2);
    document.getElementById('pw').innerHTML = (pw * objForm['pwu'].value).toFixed(2);
    document.getElementById('rh').innerHTML = (rh * objForm['rhu'].value).toFixed(2);
    document.getElementById('t').innerHTML = (t * objForm['tu'].value).toFixed(2);
    document.getElementById('f').innerHTML = froude.toFixed(2);
    document.getElementById('tau').innerHTML = (tau * objForm['tauu'].value).toFixed(2);
    document.getElementById('d50_strickler').innerHTML = (d50_strickler * objForm['d50_strickleru'].value).toFixed(2);
    document.getElementById('d50_bottom').innerHTML = (d50_bottom * objForm['d50_bottomu'].value).toFixed(2);
    document.getElementById('d50_z1').innerHTML = (d50_z1 * objForm['d50_z1u'].value).toFixed(2);
    document.getElementById('d50_z2').innerHTML = (d50_z2 * objForm['d50_z2u'].value).toFixed(2);
    document.getElementById('d50_mra').innerHTML = (d50_mra * objForm['d50_mrau'].value).toFixed(2);
    document.getElementById('d50_searcy').innerHTML = (d50_searcy * objForm['d50_searcyu'].value).toFixed(2);
    document.getElementById('sketch').innerHTML =
        '<svg height="' + gh + '" width="' + gw + '">' +
            '<polyline points="' +
            '0,' + gyt  + ' ' +
            gxb1 + ',' + gyb + ' ' +
            gxb2 + ',' + gyb + ' ' +
            gt + ',' + gyt + '" ' +
            'style="fill:none;stroke:black;stroke-width:' + gymax/25 + '" />' +
            '<line x1="0" y1="' + gyt  + '" x2="' + gt + '" y2="' + gyt  + '" style="stroke:rgb(0,0,255);stroke-width:' + gymax/25 + '" />' +
            '<polygon points="' +
            gxm + ',' + gyt + ' ' +
            gtx1 + ',' + gty + ' ' +
            gtx2 + ',' + gty + '" ' +
            'style="fill:white;stroke:black;stroke-width:' + gymax/50 + '" />' +
            'Sorry, your browser does not support inline SVG.' +
        '</svg>';
};
var mc_riprap_size = function(y, a, v, g, z, s0, c, sgrock) {
    var
    d50,
    hvmax = v * v * 1.33 * 1.33 / (2 * g) ;
    if (s0 < 0.02) {
        // Isbash
        d50 = hvmax / (c * c * Math.cos(Math.atan(1 / z)) * (sgrock - 1));
    } else if (s0 < 0.1) {
        // Robinson unit q = v * y corrected 2015-10-17
        d50 = 1.413 * Math.pow(v * y, 0.529) * Math.pow(s0, 0.794);
    } else if (s0 < 0.4) {
        // Robinson
        d50 = 0.4623 * Math.pow(v * y, 0.529) * Math.pow(s0, 0.307);
    } else {
        d50 = '-';
    }
    return d50;
};
<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("main");
?>
