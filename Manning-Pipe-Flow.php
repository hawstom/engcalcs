<?php
require_once('../lib/edc.lib.php');
//phpinfo();
$html_title = $ec_lang['mpf_main_title'];
$html_head='
    <meta name="Description" content="'. $html_title .'" />
    <meta name="Keywords" content="mannings sizing pipie pipes rate chezy-manning tubo tobus tubos calculac&iacute;on calcular calculacion calculation" />
';
echoHeader("EngCalcs", $html_title, $html_head);

?>
<h2><?=$ec_lang['mpf_main_desc']?></h2>
<?php echoHelpWanted(); ?>

<?php
echoCalculatorForm(
    //Inputs
    Array(
        Array('name' => 'd0', 'type' => 'number', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mpf_pipe_diameter']),
        Array('name' => 'n', 'type' => 'number', 'units' => NULL, 'label' => $ec_lang['mpf_manningRoughness'].' <a target="_blank" href="http://www.engineeringtoolbox.com/mannings-roughness-d_799.html">?</a>'),
        Array('name' => 's0', 'type' => 'number', 'units' => Array('grade','gradePercent'), 'label' => $ec_lang['mpf_friction_slope']),
        Array('name' => 'dd0', 'type' => 'number', 'units' => Array('depthFrac','depthPercent'), 'label' => $ec_lang['mpf_depth_ratio']),
    ),
    //Results
    Array(
        Array('name' => 'q', 'units' => Array('m3ps','lps','mld','ft3ps','gpm','mgd'), 'label' => $ec_lang['mpf_flow']),
        Array('name' => 'v', 'units' => Array('mps','ftps','mph'), 'label' => $ec_lang['mpf_velocity']),
        Array('name' => 'hv', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mpf_velocity_head']),
        Array('name' => 'a', 'units' => Array('m2','mm2','ft2','in2'), 'label' => $ec_lang['mpf_flow_area']),
        Array('name' => 'pw', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mpf_wetted_perimeter']),
        Array('name' => 'rh', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mpf_hydraulic_radius']),
        Array('name' => 't', 'units' => Array('m','mm','ft','in'), 'label' => $ec_lang['mpf_top_width']),
        Array('name' => 'f', 'units' => NULL, 'label' => $ec_lang['mpf_froude_number']),
        Array('name' => 'tau', 'units' => Array('npm2','psf'), 'label' => $ec_lang['mpf_shear_stress']),
    )
);
?>

<div id="sketch"></div>

<?php echoFeedback(); ?>

<script type="text/javascript">
EngCalcs.pageCalculator = function(f) {
    var
    c = 1.0,
    g = 9.806,
    gammawater = 9806,
    d0 = f['d0'].value / f['d0u'].value,
    s0 = f['s0'].value / f['s0u'].value,
    n = f['n'].value,
    dd0 = f['dd0'].value / f['dd0u'].value,
    y = dd0 * d0,
    theta,
    a,
    pw,
    rh,
    t,
    v,
    hv,
    q,
    froude,
    tau;
    theta = Math.acos(1 - 2 * dd0);
    a = (theta - Math.sin(theta) * Math.cos(theta)) * Math.pow(d0, 2) / 4;
    pw = theta * d0;
    rh = d0 / (4 * theta) * (theta - Math.sin(theta) * Math.cos(theta));
    t = d0 * Math.sin(theta);

    v = c/n*Math.pow(rh,2/3)*Math.pow(s0,0.5);
    hv = v * v / (2 * g);
    q = v*a;
    froude = v * Math.sqrt(t/(g * a * Math.cos(Math.atan(s0))));
    tau = gammawater * rh * s0;

    // Sketch
    gcr = 50; // Pipe circle radius
    gh = 3 * gcr; // SVG height
    gw = 3 * gcr; // SVG width
    gcx = 1.5 * gcr; // Pipe center x
    gcy = 1.5 * gcr; // Pipe center y
    gcb = gcy + gcr; // Pipe bottom
    glx1 = gcx - t/d0 * gcr;
    glx2 = gcx + t/d0 * gcr;
    gly = gcy + (1/2 - dd0) * 2 * gcr;
    gty = gly - gcr/4;
    gtx1 = gcx - gcr/8;
    gtx2 = gcx + gcr/8

    document.getElementById('q').innerHTML = (q * f['qu'].value).toFixed(4);
    document.getElementById('v').innerHTML = (v * f['vu'].value).toFixed(4);
    document.getElementById('hv').innerHTML = (hv * f['hvu'].value).toFixed(4);
    document.getElementById('a').innerHTML = (a * f['au'].value).toFixed(4);
    document.getElementById('pw').innerHTML = (pw * f['pwu'].value).toFixed(4);
    document.getElementById('rh').innerHTML = (rh * f['rhu'].value).toFixed(4);
    document.getElementById('t').innerHTML = (t * f['tu'].value).toFixed(4);
    document.getElementById('f').innerHTML = froude.toFixed(2);
    document.getElementById('tau').innerHTML = (tau * f['tauu'].value).toFixed(4);
    document.getElementById('sketch').innerHTML =
        '<svg height="' + gh + '" width="' + gw + '">' +
            '<circle cx="' + gcx + '" cy="' + gcy + '" r="' + gcr + '" stroke="black" stroke-width="' + gcr/25 + '" fill="white" />' +
            '<line x1="' + glx1 + '" y1="' + gly + '" x2="' + glx2 + '" y2="' + gly + '" style="stroke:rgb(0,0,255);stroke-width:' + gcr/25 + '" />' +
            '<line x1="' + gcx + '" y1="' + gcb + '" x2="' + gcx + '" y2="' + gly + '" style="stroke:rgb(0,0,255);stroke-width:' + gcr/3 + '" />' +
            '<polygon points="' +
            gcx + ',' + gly + ' ' +
            gtx1 + ',' + gty + ' ' +
            gtx2 + ',' + gty + '" ' +
            'style="fill:white;stroke:black;stroke-width:' + gcr/50 + '" />' +
            'Sorry, your browser does not support inline SVG.' +
        '</svg>';
}

<?php echoCookieScript(); ?>
</script>
<?php
echoFooter("main");
?>
