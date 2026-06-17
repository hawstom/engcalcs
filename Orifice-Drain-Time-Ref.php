<?php
require_once ('lib/base.inc.php');
$html_title = 'Orifice Drain Time &mdash; Equation Derivation';
$html_head='
	<meta name="Description" content="Derivation of the orifice drain time equation for a conic-section pond." />
';
echoHeader("EngCalcs", $html_title, $html_head);
?>
<h2>Orifice Drain Time &mdash; Equation Derivation</h2>
<p>&larr; <a href="Orifice-Drain-Time.php">Back to Orifice Drain Time Calculator</a></p>

<h3>Assumptions</h3>
<ul>
  <li>The pond is modeled as a conic section: the square root of the surface area varies linearly with head H.</li>
  <li>H is measured upward from the orifice centroid elevation.</li>
  <li>A&#x2080; is the pond surface area at H&nbsp;=&nbsp;0 (orifice elevation); A&#x2081; is the surface area at H&nbsp;=&nbsp;H&#x2081; (starting water surface).</li>
  <li>Orifice flow follows the standard orifice equation with discharge coefficient C&#x2064;&#x2099;.</li>
</ul>

<h3>Derivation</h3>

<div style="max-width:48em">
  <math display="block" id="eq1" xmlns="http://www.w3.org/1998/Math/MathML">
    <mrow>
      <mtext>(1)&#x2003;</mtext>
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
        <mfrac>
          <mi>H</mi>
          <msub><mi>H</mi><mn>1</mn></msub>
        </mfrac>
      </mrow>
    </mrow>
  </math>

  <math display="block" id="eq2" xmlns="http://www.w3.org/1998/Math/MathML">
    <mrow>
      <mtext>(2)&#x2003;</mtext>
      <mi>A</mi><mo>(</mo><mi>H</mi><mo>)</mo>
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
            <mfrac>
              <mi>H</mi>
              <msub><mi>H</mi><mn>1</mn></msub>
            </mfrac>
          </mrow>
          <mo>]</mo>
        </mrow>
        <mn>2</mn>
      </msup>
    </mrow>
  </math>

  <math display="block" id="eq3" xmlns="http://www.w3.org/1998/Math/MathML">
    <mrow>
      <mtext>(3)&#x2003;</mtext>
      <mi>dV</mi>
      <mo>=</mo>
      <mi>A</mi><mo>(</mo><mi>H</mi><mo>)</mo>
      <mo>&#x2062;</mo>
      <mi>dH</mi>
    </mrow>
  </math>

  <math display="block" id="eq4" xmlns="http://www.w3.org/1998/Math/MathML">
    <mrow>
      <mtext>(4)&#x2003;</mtext>
      <mi>Q</mi>
      <mo>=</mo>
      <msub><mi>C</mi><mi>d</mi></msub>
      <mo>&#x2062;</mo>
      <msub><mi>A</mi><mi>or</mi></msub>
      <mo>&#x2062;</mo>
      <msqrt>
        <mrow>
          <mn>2</mn><mo>&#x2062;</mo><mi>g</mi><mo>&#x2062;</mo><mi>H</mi>
        </mrow>
      </msqrt>
    </mrow>
  </math>

  <math display="block" id="eq5" xmlns="http://www.w3.org/1998/Math/MathML">
    <mrow>
      <mtext>(5)&#x2003;</mtext>
      <mi>dt</mi>
      <mo>=</mo>
      <mfrac>
        <mi>dV</mi>
        <mi>Q</mi>
      </mfrac>
    </mrow>
  </math>

  <math display="block" id="eq6" xmlns="http://www.w3.org/1998/Math/MathML">
    <mrow>
      <mtext>(6)&#x2003;</mtext>
      <mi>dt</mi>
      <mo>=</mo>
      <mfrac>
        <mrow><mi>A</mi><mo>(</mo><mi>H</mi><mo>)</mo><mo>&#x2062;</mo><mi>dH</mi></mrow>
        <mi>Q</mi>
      </mfrac>
    </mrow>
  </math>

  <math display="block" id="eq7" xmlns="http://www.w3.org/1998/Math/MathML">
    <mrow>
      <mtext>(7)&#x2003;</mtext>
      <mi>dt</mi>
      <mo>=</mo>
      <mfrac>
        <mrow><mi>A</mi><mo>(</mo><mi>H</mi><mo>)</mo><mo>&#x2062;</mo><mi>dH</mi></mrow>
        <mrow>
          <msub><mi>C</mi><mi>d</mi></msub>
          <mo>&#x2062;</mo>
          <msub><mi>A</mi><mi>or</mi></msub>
          <mo>&#x2062;</mo>
          <msqrt>
            <mrow><mn>2</mn><mo>&#x2062;</mo><mi>g</mi><mo>&#x2062;</mo><mi>H</mi></mrow>
          </msqrt>
        </mrow>
      </mfrac>
    </mrow>
  </math>

  <math display="block" id="eq8" xmlns="http://www.w3.org/1998/Math/MathML">
    <mrow>
      <mtext>(8)&#x2003;</mtext>
      <mi>dt</mi>
      <mo>=</mo>
      <mfrac>
        <mrow><mi>A</mi><mo>(</mo><mi>H</mi><mo>)</mo><mo>&#x2062;</mo><mi>dH</mi></mrow>
        <mrow>
          <msub><mi>C</mi><mi>d</mi></msub>
          <mo>&#x2062;</mo>
          <msub><mi>A</mi><mi>or</mi></msub>
          <mo>&#x2062;</mo>
          <msqrt><mrow><mn>2</mn><mo>&#x2062;</mo><mi>g</mi></mrow></msqrt>
          <mo>&#x2062;</mo>
          <msqrt><mi>H</mi></msqrt>
        </mrow>
      </mfrac>
    </mrow>
  </math>

  <math display="block" id="eq9" xmlns="http://www.w3.org/1998/Math/MathML">
    <mrow>
      <mtext>(9)&#x2003;</mtext>
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

  <math display="block" id="eq10" xmlns="http://www.w3.org/1998/Math/MathML">
    <mrow>
      <mtext>(10)&#x2003;</mtext>
      <mi>t</mi>
      <mo>=</mo>
      <mstyle displaystyle="true">
        <msubsup>
          <mo>&#x222B;</mo>
          <mn>0</mn>
          <msub><mi>H</mi><mn>1</mn></msub>
        </msubsup>
      </mstyle>
      <mfrac>
        <mrow><mi>A</mi><mo>(</mo><mi>H</mi><mo>)</mo><mo>&#x2062;</mo><mi>dH</mi></mrow>
        <mrow>
          <msub><mi>C</mi><mi>d</mi></msub>
          <mo>&#x2062;</mo>
          <msub><mi>A</mi><mi>or</mi></msub>
          <mo>&#x2062;</mo>
          <msqrt><mrow><mn>2</mn><mo>&#x2062;</mo><mi>g</mi></mrow></msqrt>
          <mo>&#x2062;</mo>
          <msqrt><mi>H</mi></msqrt>
        </mrow>
      </mfrac>
    </mrow>
  </math>

  <math display="block" id="eq11" xmlns="http://www.w3.org/1998/Math/MathML">
    <mrow>
      <mtext>(11)&#x2003;</mtext>
      <mi>t</mi>
      <mo>=</mo>
      <mfrac>
        <mn>1</mn>
        <mrow>
          <msub><mi>C</mi><mi>d</mi></msub>
          <mo>&#x2062;</mo>
          <msub><mi>A</mi><mi>or</mi></msub>
          <mo>&#x2062;</mo>
          <msqrt><mrow><mn>2</mn><mo>&#x2062;</mo><mi>g</mi></mrow></msqrt>
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
</div>

<?php echoFeedback(); ?>
<?php
echoFooter("EngCalcs");
