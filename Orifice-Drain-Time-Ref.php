<?php
require_once ('lib/base.inc.php');
$html_title = 'Orifice Drain Time &mdash; Equation Derivation';
$html_head='
	<meta name="Description" content="Derivation of the orifice drain time equation for a conic-section pond." />
	<style>
		math[display="block"] { margin-top: 0.2em; margin-bottom: 1.5em; display: block; }
	</style>
';
echoHeader("EngCalcs", $html_title, $html_head);
?>
<p>&larr; <a href="Orifice-Drain-Time.php">Back to Orifice Drain Time Calculator</a></p>

  <p>
    We want the time required for a truncated cone-shaped tank or pond to drain through a circular orifice at the bottom.
    The tank is described only by the area at the top, the area at the orifice, and the initial height.
    We will use a volume balance together with the orifice flow law, then integrate from the full height down to zero.
  </p>

<h2>Assumptions</h2>
<ul>
  <li>The pond is modeled as a conic section: the square root of the surface area varies linearly with head H.</li>
  <li>H is measured upward from the orifice centroid elevation.</li>
  <li>A&#x2080; is the pond surface area at H&nbsp;=&nbsp;0 (orifice elevation); A&#x2081; is the surface area at H&nbsp;=&nbsp;H&#x2081; (starting water surface).</li>
  <li>Orifice flow follows the standard orifice equation with discharge coefficient C&#x2064;&#x2099;.</li>
</ul>

<h2>Derivation</h2>

  <p>
    Define the symbols as follows:
  </p>

  <ul>
    <li><code>A1</code> = initial area at height <code>H1</code>.</li>
    <li><code>A0</code> = area at <code>H = 0</code>.</li>
    <li><code>H1</code> = initial liquid height above the orifice.</li>
    <li><code>H</code> = intermediate liquid height above the orifice at any given time step.</li>
    <li><code>A(H)</code> = cross-sectional area at height <code>H</code>.</li>
    <li><code>aor</code> = orifice area.</li>
    <li><code>Cd</code> = discharge coefficient.</li>
    <li><code>g</code> = gravity.</li>
  </ul>

  <p>
    Because the pond sides are straight, the radius (conic section assumption) changes linearly with height.
    Since area is proportional to radius squared, the square root of the area also changes linearly with height.
    That is the geometric fact that makes the derivation tractable, and it gives the interpolation formula:
  </p>

  <math display="block" id="eq1" xmlns="http://www.w3.org/1998/Math/MathML">
    <mrow>
      <mtext>(1) </mtext>
      <msqrt><mrow><mi>A</mi><mo>(</mo><mi>H</mi><mo>)</mo></mrow></msqrt>
      <mo>=</mo>
      <msqrt><msub><mi>A</mi><mn>0</mn></msub></msqrt>
      <mo>+</mo>
      <mrow>
        <mo>(</mo>
        <msqrt><msub><mi>A</mi><mn>1</mn></msub></msqrt>
        <mo>-</mo>
        <msqrt><msub><mi>A</mi><mn>0</mn></msub></msqrt>
        <mo>)</mo>
        <mo>&#x2062;</mo>
        <mfrac><mi>H</mi><msub><mi>H</mi><mn>1</mn></msub></mfrac>
      </mrow>
    </mrow>
  </math>

  <p>
    Squaring both sides of Eq. (1) gives the area at height <code>H</code>.
    Eq. (3) will expand this into a polynomial form suitable for integration term by term.
  </p>

  <math display="block" id="eq2" xmlns="http://www.w3.org/1998/Math/MathML">
    <mrow>
      <mtext>(2) </mtext>
      <mi>A</mi>
      <mo>(</mo><mi>H</mi><mo>)</mo>
      <mo>=</mo>
      <msup>
        <mrow>
          <mo>[</mo>
          <msqrt><msub><mi>A</mi><mn>0</mn></msub></msqrt>
          <mo>+</mo>
          <mrow>
            <mo>(</mo>
            <msqrt><msub><mi>A</mi><mn>1</mn></msub></msqrt>
            <mo>-</mo>
            <msqrt><msub><mi>A</mi><mn>0</mn></msub></msqrt>
            <mo>)</mo>
            <mo>&#x2062;</mo>
            <mfrac><mi>H</mi><msub><mi>H</mi><mn>1</mn></msub></mfrac>
          </mrow>
          <mo>]</mo>
        </mrow>
        <mn>2</mn>
      </msup>
    </mrow>
  </math>

  <p>
    Expanding the square in Eq. (2) separates A(H) into three terms, each a different power of H.
    This expanded form will simplify the integration later.
  </p>

  <math display="block" id="eq3" xmlns="http://www.w3.org/1998/Math/MathML">
    <mrow>
      <mtext>(3) </mtext>
      <mi>A</mi><mo>(</mo><mi>H</mi><mo>)</mo>
      <mo>=</mo>
      <msub><mi>A</mi><mn>0</mn></msub>
      <mo>+</mo>
      <mrow>
        <mn>2</mn>
        <mo>&#x2062;</mo>
        <msqrt><msub><mi>A</mi><mn>0</mn></msub></msqrt>
        <mo>&#x2062;</mo>
        <mrow>
          <mo>(</mo>
          <msqrt><msub><mi>A</mi><mn>1</mn></msub></msqrt>
          <mo>-</mo>
          <msqrt><msub><mi>A</mi><mn>0</mn></msub></msqrt>
          <mo>)</mo>
        </mrow>
        <mo>&#x2062;</mo>
        <mfrac><mi>H</mi><msub><mi>H</mi><mn>1</mn></msub></mfrac>
      </mrow>
      <mo>+</mo>
      <mrow>
        <msup>
          <mrow>
            <mo>(</mo>
            <msqrt><msub><mi>A</mi><mn>1</mn></msub></msqrt>
            <mo>-</mo>
            <msqrt><msub><mi>A</mi><mn>0</mn></msub></msqrt>
            <mo>)</mo>
          </mrow>
          <mn>2</mn>
        </msup>
        <mo>&#x2062;</mo>
        <mfrac>
          <msup><mi>H</mi><mn>2</mn></msup>
          <msup><msub><mi>H</mi><mn>1</mn></msub><mn>2</mn></msup>
        </mfrac>
      </mrow>
    </mrow>
  </math>

  <p>
    Next we use conservation of volume.
    A thin slice of liquid of thickness <code>dH</code> at height <code>H</code> has volume equal to area times thickness.
    This is the standard slice approximation behind calculus volume formulas.
  </p>

  <math display="block" id="eq4" xmlns="http://www.w3.org/1998/Math/MathML">
    <mrow>
      <mtext>(4) </mtext>
      <mi>dV</mi>
      <mo>=</mo>
      <mi>A</mi>
      <mo>(</mo><mi>H</mi><mo>)</mo>
      <mo>&#x2062;</mo>
      <mi>dH</mi>
    </mrow>
  </math>

  <p>
    The outflow through the orifice is given by the orifice equation.
    Since the head driving the flow is the current height <code>H</code>, the flow rate is
  </p>

  <math display="block" id="eq5" xmlns="http://www.w3.org/1998/Math/MathML">
    <mrow>
      <mtext>(5) </mtext>
      <mi>Q</mi>
      <mo>=</mo>
      <msub><mi>C</mi><mi>d</mi></msub>
      <mo>&#x2062;</mo>
      <mi>a</mi><mi>o</mi><mi>r</mi>
      <mo>&#x2062;</mo>
      <msqrt>
        <mrow>
          <mn>2</mn>
          <mo>&#x2062;</mo>
          <mi>g</mi>
          <mo>&#x2062;</mo>
          <mi>H</mi>
        </mrow>
      </msqrt>
    </mrow>
  </math>

  <p>
    The basic volume balance is that the rate of decrease of tank or pond volume equals the outflow rate.
    In differential form, we write the time element as volume change divided by flow rate.
  </p>

  <math display="block" id="eq6" xmlns="http://www.w3.org/1998/Math/MathML">
    <mrow>
      <mtext>(6) </mtext>
      <mi>dt</mi>
      <mo>=</mo>
      <mfrac><mrow><mi>dV</mi></mrow><mi>Q</mi></mfrac>
    </mrow>
  </math>

  <p>
    Substitute Eq. (4) into Eq. (6). This simply replaces the thin-slice volume with area times thickness.
  </p>

  <math display="block" id="eq7" xmlns="http://www.w3.org/1998/Math/MathML">
    <mrow>
      <mtext>(7) </mtext>
      <mi>dt</mi>
      <mo>=</mo>
      <mfrac>
        <mrow><mi>A</mi><mo>(</mo><mi>H</mi><mo>)</mo><mo>&#x2062;</mo><mi>dH</mi></mrow>
        <mi>Q</mi>
      </mfrac>
    </mrow>
  </math>

  <p>
    Now substitute the orifice law from Eq. (5) into Eq. (7).
    Since <code>Q</code> depends on <code>H</code>, it must be part of the integral rather than being treated as a constant.
  </p>

  <math display="block" id="eq8" xmlns="http://www.w3.org/1998/Math/MathML">
    <mrow>
      <mtext>(8) </mtext>
      <mi>dt</mi>
      <mo>=</mo>
      <mfrac>
        <mrow><mi>A</mi><mo>(</mo><mi>H</mi><mo>)</mo><mo>&#x2062;</mo><mi>dH</mi></mrow>
        <mrow>
          <msub><mi>C</mi><mi>d</mi></msub>
          <mo>&#x2062;</mo>
          <mi>a</mi><mi>o</mi><mi>r</mi>
          <mo>&#x2062;</mo>
          <msqrt>
            <mrow><mn>2</mn><mo>&#x2062;</mo><mi>g</mi><mo>&#x2062;</mo><mi>H</mi></mrow>
          </msqrt>
        </mrow>
      </mfrac>
    </mrow>
  </math>

  <p>
    The total drain time is found by integrating from the empty height <code>H = 0</code> to the initial height <code>H = H1</code>.
    In other words, we accumulate the tiny time pieces from the start of drainage to the end.
  </p>

  <math display="block" id="eq9" xmlns="http://www.w3.org/1998/Math/MathML">
    <mrow>
      <mtext>(9) </mtext>
      <mi>t</mi>
      <mo>=</mo>
      <mstyle displaystyle="true">
        <msubsup>
          <mo>&#x222B;</mo>
          <mn>0</mn>
          <msub><mi>H</mi><mn>1</mn></msub>
        </msubsup>
      </mstyle>
      <mi>dt</mi>
    </mrow>
  </math>

  <p>
    Substituting Eq. (8) into Eq. (9) yields the integral form for the drain time.
  </p>

  <math display="block" id="eq10" xmlns="http://www.w3.org/1998/Math/MathML">
    <mrow>
      <mtext>(10) </mtext>
      <mi>t</mi>
      <mo>=</mo>
      <mfrac>
        <mn>1</mn>
        <mrow>
          <msub><mi>C</mi><mi>d</mi></msub>
          <mo>&#x2062;</mo>
          <mi>a</mi><mi>o</mi><mi>r</mi>
          <mo>&#x2062;</mo>
          <msqrt>
            <mrow><mn>2</mn><mo>&#x2062;</mo><mi>g</mi></mrow>
          </msqrt>
        </mrow>
      </mfrac>
      <mo>&#x2062;</mo>
      <mstyle displaystyle="true">
        <msubsup>
          <mo>&#x222B;</mo>
          <mn>0</mn>
          <msub><mi>H</mi><mn>1</mn></msub>
        </msubsup>
      </mstyle>
      <mfrac>
        <mrow><mi>A</mi><mo>(</mo><mi>H</mi><mo>)</mo></mrow>
        <msqrt><mi>H</mi></msqrt>
      </mfrac>
      <mo>&#x2062;</mo>
      <mi>dH</mi>
    </mrow>
  </math>

  <p>
    Now substitute the area formula from Eq. (3) into Eq. (10).
    This gives an explicit integrand written entirely in terms of the known endpoint areas and the variable height. 
  </p>

  <math display="block" id="eq11" xmlns="http://www.w3.org/1998/Math/MathML">
    <mrow>
      <mtext>(11) </mtext>
      <mi>t</mi>
      <mo>=</mo>
      <mfrac>
        <mn>1</mn>
        <mrow>
          <msub><mi>C</mi><mi>d</mi></msub>
          <mo>&#x2062;</mo>
          <mi>a</mi><mi>o</mi><mi>r</mi>
          <mo>&#x2062;</mo>
          <msqrt>
            <mrow><mn>2</mn><mo>&#x2062;</mo><mi>g</mi></mrow>
          </msqrt>
        </mrow>
      </mfrac>
      <mo>&#x2062;</mo>
      <mstyle displaystyle="true">
        <msubsup>
          <mo>&#x222B;</mo>
          <mn>0</mn>
          <msub><mi>H</mi><mn>1</mn></msub>
        </msubsup>
      </mstyle>
      <mfrac>
        <mrow>
          <msub><mi>A</mi><mn>0</mn></msub>
          <mo>+</mo>
          <mrow>
            <mn>2</mn>
            <mo>&#x2062;</mo>
            <msqrt><msub><mi>A</mi><mn>0</mn></msub></msqrt>
            <mo>&#x2062;</mo>
            <mrow>
              <mo>(</mo>
              <msqrt><msub><mi>A</mi><mn>1</mn></msub></msqrt>
              <mo>-</mo>
              <msqrt><msub><mi>A</mi><mn>0</mn></msub></msqrt>
              <mo>)</mo>
            </mrow>
            <mo>&#x2062;</mo>
            <mfrac>
              <mi>H</mi>
              <msub><mi>H</mi><mn>1</mn></msub>
            </mfrac>
          </mrow>          <mo>+</mo>
          <mrow>
            <msup>
              <mrow>
                <mo>(</mo>
                <msqrt><msub><mi>A</mi><mn>1</mn></msub></msqrt>
                <mo>-</mo>
                <msqrt><msub><mi>A</mi><mn>0</mn></msub></msqrt>
                <mo>)</mo>
              </mrow>
              <mn>2</mn>
            </msup>
            <mo>&#x2062;</mo>
            <mfrac>
              <msup><mi>H</mi><mn>2</mn></msup>
              <msup><msub><mi>H</mi><mn>1</mn></msub><mn>2</mn></msup>
            </mfrac>
          </mrow>
        </mrow>
        <msqrt><mi>H</mi></msqrt>
      </mfrac>
      <mo>&#x2062;</mo>
      <mi>dH</mi>
    </mrow>
  </math>

  <p>
    Dividing each of the three terms in the expanded numerator of Eq. (11) by <code>√H</code> gives three standard power-law integrands: one proportional to <code>H^(-1/2)</code>, one to <code>H^(1/2)</code>, and one to <code>H^(3/2)</code>.
  </p>

  <math display="block" id="eq12" xmlns="http://www.w3.org/1998/Math/MathML">
    <mrow>
      <mtext>(12) </mtext>
      <mi>t</mi>
      <mo>=</mo>
      <mfrac>
        <mn>1</mn>
        <mrow>
          <msub><mi>C</mi><mi>d</mi></msub>
          <mo>&#x2062;</mo>
          <mi>a</mi><mi>o</mi><mi>r</mi>
          <mo>&#x2062;</mo>
          <msqrt>
            <mrow><mn>2</mn><mo>&#x2062;</mo><mi>g</mi></mrow>
          </msqrt>
        </mrow>
      </mfrac>
      <mo>&#x2062;</mo>
      <mstyle displaystyle="true">
        <msubsup>
          <mo>&#x222B;</mo>
          <mn>0</mn>
          <msub><mi>H</mi><mn>1</mn></msub>
        </msubsup>
      </mstyle>
      <mrow>
        <mfrac><msub><mi>A</mi><mn>0</mn></msub><msqrt><mi>H</mi></msqrt></mfrac>
        <mo>+</mo>
        <mfrac>
          <mrow>
            <mn>2</mn><mo>&#x2062;</mo><msqrt><msub><mi>A</mi><mn>0</mn></msub></msqrt>
            <mo>&#x2062;</mo>
            <mo>(</mo><msqrt><msub><mi>A</mi><mn>1</mn></msub></msqrt><mo>-</mo><msqrt><msub><mi>A</mi><mn>0</mn></msub></msqrt><mo>)</mo>
            <mo>&#x2062;</mo><msqrt><mi>H</mi></msqrt>
          </mrow>
          <msub><mi>H</mi><mn>1</mn></msub>
        </mfrac>
        <mo>+</mo>
        <mfrac>
          <mrow>
            <msup>
              <mrow>
                <mo>(</mo><msqrt><msub><mi>A</mi><mn>1</mn></msub></msqrt><mo>-</mo><msqrt><msub><mi>A</mi><mn>0</mn></msub></msqrt><mo>)</mo>
              </mrow>
              <mn>2</mn>
            </msup>
            <mo>&#x2062;</mo>
            <msup><mi>H</mi><mfrac><mn>3</mn><mn>2</mn></mfrac></msup>
          </mrow>
          <msup><msub><mi>H</mi><mn>1</mn></msub><mn>2</mn></msup>
        </mfrac>
      </mrow>
      <mo>&#x2062;</mo>
      <mi>dH</mi>
    </mrow>
  </math>

 <p>
    Integrating term by term uses the standard power rules:
  </p>

  <ul>
    <li><code>INT H^(-1/2) dH = 2 * H^(1/2)</code></li>
    <li><code>INT H^(1/2) dH = (2/3) * H^(3/2)</code></li>
    <li><code>INT H^(3/2) dH = (2/5) * H^(5/2)</code></li>
  </ul>

  <p>
    After performing the integration and evaluating the result at the limits, we obtain
  </p>

  <math display="block" id="eq13" xmlns="http://www.w3.org/1998/Math/MathML">
    <mrow>
      <mtext>(13) </mtext>
      <mi>t</mi>
      <mo>=</mo>
      <mfrac>
        <mn>1</mn>
        <mrow>
          <msub><mi>C</mi><mi>d</mi></msub>
          <mo>&#x2062;</mo>
          <mi>a</mi><mi>o</mi><mi>r</mi>
          <mo>&#x2062;</mo>
          <msqrt>
            <mrow><mn>2</mn><mo>&#x2062;</mo><mi>g</mi></mrow>
          </msqrt>
        </mrow>
      </mfrac>
      <mo>&#x2062;</mo>
      <mrow>
        <mo>(</mo>
        <mrow>
          <mn>2</mn><mo>&#x2062;</mo><msub><mi>A</mi><mn>0</mn></msub><mo>&#x2062;</mo><msqrt><msub><mi>H</mi><mn>1</mn></msub></msqrt>
        </mrow>
        <mo>+</mo>
        <mrow>
          <mfrac><mn>4</mn><mn>3</mn></mfrac>
          <mo>&#x2062;</mo>
          <msqrt><msub><mi>A</mi><mn>0</mn></msub></msqrt>
          <mo>&#x2062;</mo>
          <mo>(</mo><msqrt><msub><mi>A</mi><mn>1</mn></msub></msqrt><mo>-</mo><msqrt><msub><mi>A</mi><mn>0</mn></msub></msqrt><mo>)</mo>
          <mo>&#x2062;</mo>
          <msqrt><msub><mi>H</mi><mn>1</mn></msub></msqrt>
        </mrow>
        <mo>+</mo>
        <mrow>
          <mfrac><mn>2</mn><mn>5</mn></mfrac>
          <mo>&#x2062;</mo>
          <msup>
            <mrow>
              <mo>(</mo><msqrt><msub><mi>A</mi><mn>1</mn></msub></msqrt><mo>-</mo><msqrt><msub><mi>A</mi><mn>0</mn></msub></msqrt><mo>)</mo>
            </mrow>
            <mn>2</mn>
          </msup>
          <mo>&#x2062;</mo>
          <msqrt><msub><mi>H</mi><mn>1</mn></msub></msqrt>
        </mrow>
        <mo>)</mo>
      </mrow>
    </mrow>
  </math>

  <p>
    Factoring out <code>SQRT(H1)</code> gives
  </p>

  <math display="block" id="eq14" xmlns="http://www.w3.org/1998/Math/MathML">
    <mrow>
      <mtext>(14) </mtext>
      <mi>t</mi>
      <mo>=</mo>
      <mfrac>
        <msqrt><msub><mi>H</mi><mn>1</mn></msub></msqrt>
        <mrow>
          <msub><mi>C</mi><mi>d</mi></msub>
          <mo>&#x2062;</mo>
          <mi>a</mi><mi>o</mi><mi>r</mi>
          <mo>&#x2062;</mo>
          <msqrt>
            <mrow><mn>2</mn><mo>&#x2062;</mo><mi>g</mi></mrow>
          </msqrt>
        </mrow>
      </mfrac>
      <mo>&#x2062;</mo>
      <mrow>
        <mo>(</mo>
        <mrow>
          <mn>2</mn><mo>&#x2062;</mo><msub><mi>A</mi><mn>0</mn></msub>
        </mrow>
        <mo>+</mo>
        <mrow>
          <mfrac><mn>4</mn><mn>3</mn></mfrac>
          <mo>&#x2062;</mo>
          <msqrt><msub><mi>A</mi><mn>0</mn></msub></msqrt>
          <mo>&#x2062;</mo>
          <mo>(</mo><msqrt><msub><mi>A</mi><mn>1</mn></msub></msqrt><mo>-</mo><msqrt><msub><mi>A</mi><mn>0</mn></msub></msqrt><mo>)</mo>
        </mrow>
        <mo>+</mo>
        <mrow>
          <mfrac><mn>2</mn><mn>5</mn></mfrac>
          <mo>&#x2062;</mo>
          <msup>
            <mrow>
              <mo>(</mo><msqrt><msub><mi>A</mi><mn>1</mn></msub></msqrt><mo>-</mo><msqrt><msub><mi>A</mi><mn>0</mn></msub></msqrt><mo>)</mo>
            </mrow>
            <mn>2</mn>
          </msup>
        </mrow>
        <mo>)</mo>
      </mrow>
    </mrow>
  </math>

  <p>
    Expanding and simplifying the bracket gives the compact final form.
  </p>

  <math display="block" id="eq15" xmlns="http://www.w3.org/1998/Math/MathML">
    <mrow>
      <mtext>(15) </mtext>
      <mi>t</mi>
      <mo>=</mo>
      <mfrac>
        <msqrt><msub><mi>H</mi><mn>1</mn></msub></msqrt>
        <mrow>
          <msub><mi>C</mi><mi>d</mi></msub>
          <mo>&#x2062;</mo>
          <mi>a</mi><mi>o</mi><mi>r</mi>
          <mo>&#x2062;</mo>
          <msqrt>
            <mrow><mn>2</mn><mo>&#x2062;</mo><mi>g</mi></mrow>
          </msqrt>
        </mrow>
      </mfrac>
      <mo>&#x2062;</mo>
      <mrow>
        <mo>(</mo>
        <mfrac><mn>2</mn><mn>5</mn></mfrac><msub><mi>A</mi><mn>1</mn></msub>
        <mo>+</mo>
        <mfrac><mn>8</mn><mn>15</mn></mfrac>
        <msqrt>
          <mrow><msub><mi>A</mi><mn>0</mn></msub><mo>&#x2062;</mo><msub><mi>A</mi><mn>1</mn></msub></mrow>
        </msqrt>
        <mo>+</mo>
        <mfrac><mn>16</mn><mn>15</mn></mfrac><msub><mi>A</mi><mn>0</mn></msub>
        <mo>)</mo>
      </mrow>
    </mrow>
  </math>

  <p>
    Therefore the final spreadsheet formula is
  </p>

  <pre>=SQRT(H1)/(Cd*aor*SQRT(2*g))*((2/5)*A1 + (8/15)*SQRT(A0*A1) + (16/15)*A0)</pre>

  <p>
    In prose, the derivation works by combining three ideas:
    Eq. (1) gives the geometry of the truncated cone,
    Eq. (4) gives the small volume slice,
    and Eq. (5) gives the discharge through the orifice.
    Those are substituted into the volume balance, assembled into the integral in Eq. (9), and evaluated in Eq. (10) through Eq. (13).
    The result is the closed-form expression in Eq. (15).
  </p>

<?php echoFeedback(); ?>
<?php
echoFooter("EngCalcs");
