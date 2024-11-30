<style>
  table {
    border-collapse: collapse;
  }
  table, th, td, tbody, thead, tr {
    border: none;
  }
  h1 {
    padding-top: 0;
    margin-top: 0;
  }
  p {
    font-size: 9pt;
  }
  img {
    max-width: 100%;
  }
  .center {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .cell {
    width: 50vw;
  }
  .grid-two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1em;
  }
  .caption {
    font-style: italic;
    font-size: 7pt;
    line-height: 1.2 !important;
  }
  .pt-1 {
    padding-top: 1em;
  }
  .pt-2 {
    padding-top: 2em;
  }
  .pb-1 {
    padding-bottom: 1em;
  }
  .pb-2 {
    padding-bottom: 2em;
  }
  .graph {
    width: 60%;
    margin-left: auto;
    margin-right: auto;
  }
</style>

# Perceptual differences in Müller-Lyer illusion variations

**Kollin Murphy**

## Background

The Müller-Lyer illusion was first described by Franz Carl Müller-Lyer in 1889 [[1]](#ref-contributions-of-muller-lyer). The visual illusion consists of two lines of equal length, one with arrowheads pointing inwards and the other with arrowheads pointing outwards. The line with the arrowheads pointing outwards appears longer than the line with the arrowheads pointing inwards. Research into the illusion suggests that the perceptual difference between the two lines is due to the brain's probabilistic interpretation of the visual information [[2]](#ref-explained-by-stats), which indicates that the brain utilizes patterns and statistics from the real world to make sense of what is perceived.

The Müller-Lyer illusion has been studied extensively in psychology and neuroscience, but the perceptual differences between variations of the illusion have not been well documented. This study aims to investigate the perceptual differences between variations on the classic Müller-Lyer figure.

<div class="center">
  <img src="./img/muller-lyer-classic.svg" height="64px" />
  <span class="caption pt-1">
    Figure 1. Classic demonstration of the Müller-Lyer illusion. While the two lines are of equal length, the line with the arrowheads pointing outwards appears to be longer than the line with the arrowheads pointing inwards.
  </span>
</div>

One common variation of the Müller-Lyer illusion was first described by Franz Brentano in 1892. It was proposed along with an explanation of the illusion based on "an overestimation of small [angles] and an underestimation of large angles" [[3]](#ref-brentano). The Brentano variation consists of a single line that is divided by oblique lines—a horizontally stacked version of the classic figure. This study will investigate the perceptual differences between the classic Müller-Lyer figure and the Brentano variation, as well as the classic figure with a horizontal offset.

The aim of quantifying the perceptual differences between these variations is to determine the extent to which the illusion is influenced by the distracting elements in the figure. Howe and Purves (2005) remark that although variations of the Müller-Lyer illusion have been studied, they have not been quantitatively compared [[4]](#ref-howe). This study will address this gap in the literature by quantifying the perceptual differences between variations of the Müller-Lyer illusion.

## Methods

Using the classic Müller-Lyer figure as a base, multiple variations were created by changing the position of the lines and by replacing the arrowheads with alternative shapes. Participants were presented with a figure with lines of randomized lengths (between 18 and 21 mm, with a 1 mm step) for a period of 500 milliseconds, then they were asked to select one of the following:

- the left/top line is definitely longer,
- the left/top line is slightly longer,
- the lines are the same length,
- the right/bottom line is slightly longer,
- or the right/bottom line is definitely longer.

A web-based survey was created to present the figures to participants and collect their responses. The survey was completed by 32 participants. Demographic information, such as age and eye color, was also collected to investigate potential correlations between demographic factors and perceptual differences.

Figures 2-4 show the variations of the Müller-Lyer illusion used in the survey, where all figures are of equal length. The variations in each figure are denoted as follows:

- top-left: arrowhead variation,
- top-right: circle variation,
- bottom-left: obliques variation,
- bottom-right: square variation.

<table>
  <tr>
    <td>
      <div class="center cell">
        <img src="./grouped-samples/vertical.png" height="120px" />
        <span class="caption pt-1">
          Figure 2. Sample figures used in the survey in a vertical configuration.
        </span>
      </div>
    </td>
    <td>
      <div class="center cell">
        <img src="./grouped-samples/brentano.png" height="120px" />
        <span class="caption pt-1">
          Figure 3. Sample figures used in the survey in the Brentano configuration.
        </span>
      </div>
    </td>
  </tr>
  <tr>
    <td>
      <div class="center cell">
        <img src="./grouped-samples/offset.png" height="120px" />
        <span class="caption pt-1">
          Figure 4. Sample figures used in the survey in an offset configuration.
        </span>
      </div>
    </td>
    <td>
      <div class="center cell">
        <img src="./grouped-samples/baseline.png" height="120px" />
        <span class="caption pt-1">
          Figure 5. Sample baseline figures used in the survey in both vertical and offset configurations.
        </span>
      </div>
    </td>
  </tr>
</table>

A baseline figure was also included in the survey to determine the accuracy of the responses. The baseline figure consisted of two lines with no arrowheads or other distracting elements. The baseline figure was presented in both vertical and offset configurations, as shown in Figure 5. The baseline figure was not presented in the Brentano configuration, as without any additional elements it would not be possible to segment the line into two parts.

For each participant, five trials for each configuration-variation pair were conducted, for a total of 70 trials per participant. The ordering of the trials was not randomized to prevent confusion between the different variations. Before each type of figure was presented, a sample figure was shown to the participant to ensure they understood the task and the figure variations.

For each response, the participant's selection was recorded as well as the time taken to make the selection. The time taken to make the selection was used to determine if participants spent more time on certain configurations or variations.

In analyzing the data, the perceived delta between the two lines was estimated for each response according to the following heuristic:

- left/top definitely longer: -3 mm,
- left/top slightly longer: -1 mm,
- same length: 0 mm,
- right/bottom slightly longer: +1 mm,
- right/bottom definitely longer: +3 mm.

The perceptual bias was then calculated by subtracting the actual delta between the two lines from the estimated perceived delta.

## Results

The baseline figures were used to determine the accuracy of the responses for the vertical and offset configurations. These showed a high level of accuracy, with the mean perceptual bias close to zero for both configurations, indicating that participants were able to accurately judge the length of the lines in the baseline figures. The error was negligible for the vertical configuration and slightly higher for the offset configuration. The distribution of perceptual bias by variant is shown in Figure 6.

<div class="center graph">
  <img src="../analysis/output/perceptual-bias-by-variant-graph.png" />
  <span class="caption pt-1 pb-2">
    Figure 6. The distribution of perceptual bias by figure variant. The peak of the distribution was centered at zero for the baseline and oblique figures, indicating no illusion was seen, while others showed a slight positive bias, indicative of the Müller-Lyer illusion.
  </span>
</div>

<table>
  <tr>
    <td>
      <div class="cell">
        <img src="../analysis/output/perceptual-bias-by-configuration-arrowhead-graph.png" />
        <div class="caption pt-1">
          Figure 7. The distribution of perceptual bias by figure configuration for the arrowhead figures. Significant differences were found between the vertical and offset configurations (p = 0.018) and the vertical and Brentano configurations (p = 0.0001).
        </div>
      </div>
    </td>
    <td>
      <div class="cell">
        <img src="../analysis/output/perceptual-bias-by-configuration-circle-graph.png" />
        <div class="caption pt-1">
          Figure 8. The distribution of perceptual bias by figure configuration for the circle figures. A significant difference was found between the vertical and offset configurations (p = 0.04).
        </div>
      </div>
    </td>
  </tr>
</table>

Comparing the perceptual bias between the different configurations within each variant, several significant differences were found. The arrowhead figures showed a significant difference between the vertical and offset configurations (p = 0.018) and the vertical and Brentano configurations (p = 0.0001). The circle figures showed a significant difference between the vertical and offset configurations (p = 0.04). No significant differences were found for the square, oblique, or baseline figures.

An exploratory analysis was conducted to investigate potential correlations between demographic factors and perceptual bias. The analysis found a significant difference in perceptual bias by eye color, with blue eyes showing a higher perceptual bias than hazel (p = 0.00011) and green eyes (p = 0.00016). The distribution of perceptual bias by eye color is shown in Figure 9. A slight effect was found for gender, with female participants showing an increased perceptual bias compared to male participants (p = 0.000006).

<table>
  <tr>
    <td>
      <div class="cell">
        <img src="../analysis/output/perceptual-bias-by-eye-color.png" />
        <div class="caption pt-1">
          Figure 9. The distribution of perceptual bias by eye color. Statistical significance was found between blue and hazel (p = 0.00011) and blue and green (p = 0.00016). The other comparisons were not statistically significant (p > 0.05).
        </div>
      </div>
    </td>
    <td>
      <div class="cell">
        <img src="../analysis/output/perceptual-bias-by-gender.png" />
        <div class="caption pt-1">
          Figure 10. The distribution of perceptual bias by gender. A significant difference was found between male and female participants (p = 0.000006).
        </div>
      </div>
    </td>
  </tr>
</table>

## Discussion

The responses to the baseline figures showed a high level of accuracy, with participants able to accurately judge the length of the lines in the figure for both vertically stacked and offset configurations. The slight decrease in error for the vertical configuration compared to the offset configuration may be due to the alignment of the lines in the vertical configuration, which makes it easier to determine any differences in length.

Interestingly, the standard Müller-Lyer arrowhead figures produced the strongest illusion effects when presented in the vertical configuration, highlighting a striking reversal from the baseline figures, where the vertical configuration yielded the highest accuracy. This difference suggests that the perceptual alignment advantage observed in the baseline figures may be disrupted when the illusion-inducing arrowheads are present. The arrowheads in the vertical configuration likely amplify the illusion by drawing attention to the ends of the lines, emphasizing the perceived expansion or contraction of the line lengths.

When the standard arrowhead line endings were replaced with circles or squares, minor differences in the perceptual of the illusion were observed, particularly with the circle variation. Overall, the effect of altering the line endings and configuration of the lines was minimal, with the illusion still present across all variations with nearly equal strength, with the notable exception of the oblique figures. The oblique figures differed from the other variations in that the illusion was not significantly present, with the perceptual bias centered around zero, similar to the baseline figure, albeit with a larger spread. This suggests that most responses to the oblique figures were primarily random guesses rather than correct evaluations of the relative line length. It is likely that the lack of the center line segments made it more difficult to comprehend the figure within the brief exposure time to the stimulus. Perhaps with a longer exposure time or a larger delta between the line lengths, the illusion would have been more pronounced for the oblique figures.

Across all figure variations, there was no statistically significant difference between the perceptual biases of the Brentano and offset configurations. This suggests that the illusion is similarly effective in both configurations, despite the differences in the presentation of the lines. The similarity may be due to the lack of vertical alignment cues in both configurations.

The results of the eye color analysis are consistent with previous research that has found a correlation between iris pigmentation and visual-geometric illusions. Coren and Porac (1978) [[5]](#ref-iris) found that participants with lighter iris pigmentation were more susceptible to visual illusions containing intersecting line elements, such as the Müller-Lyer illusion, while the same effect was not found in illusions with non-intersecting line elements, such as the Ebbinghaus illusion. The higher perceptual bias in participants with lighter blue eyes may be due to the increased blur or degradation of the retinal image caused by the lack of pigmentation in the iris. This could result in a decreased ability to accurately judge the length of the lines in the figure as compared to participants with a darker iris color, such as hazel or green.

## Conclusion

In conclusion, the findings of this study demonstrate the many nuanced ways in which the perception of the Müller-Lyer illusion is influenced by variations in presentation, including positioning of the lines, the shape of the line endings, the presence or absence of the center line segments, and individual demographic factors. While the introduction of circle or square line endings caused only minor changes in the perception of the illusion, the oblique figure variations stood out as a notable exception. The lack of center line segments in these figures likely made it more challenging for participants to process the stimuli during the brief 500 millisecond exposure time, resulting in responses that appeared random. Additionally, the lack of significant differences between the Brentano and offset configurations suggests that the illusion remains robust across these variations despite the differences in presentation.

The eye color analysis provides further insight, revealing that participants with lighter iris pigmentation exhibited a greater susceptibility to the illusion. This finding aligns with prior research and suggests that reduced pigmentation may impair the clarity of the retinal image, impacting the ability to accurately perceive line lengths. Together, these results emphasize the complex interplay of geometric, contextual, and individual factors in shaping the perception of the Müller-Lyer illusion, offering plenty of avenues for future research to further explore these complex dynamics.

## References

1. <span id="ref-contributions-of-muller-lyer"></span> Day, R. H., & Knuth, H. (1981). The Contributions of F C Müller-Lyer. Perception, 10(2), 126-146. https://doi.org/10.1068/p100126
2. <span id="ref-explained-by-stats"></span> Howe, Catherine Q., and Dale Purves. “The Müller-Lyer Illusion Explained by the Statistics of Image-Source Relationships.” Proceedings of the National Academy of Sciences of the United States of America, vol. 102, no. 4, 2005, pp. 1234–39. JSTOR, http://www.jstor.org/stable/3374407. Accessed 29 Nov. 2024.
3. <span id="ref-brentano"></span> “PERIODICALS.” The Monist, vol. 3, no. 4, 1893, pp. 651–58. JSTOR, http://www.jstor.org/stable/27897111. Accessed 29 Nov. 2024.
4. <span id="ref-howe"></span>Howe, Catherine Q., and Dale Purves. “The Müller-Lyer Illusion Explained by the Statistics of Image-Source Relationships.” Proceedings of the National Academy of Sciences of the United States of America, vol. 102, no. 4, 2005, pp. 1234–39. JSTOR, http://www.jstor.org/stable/3374407. Accessed 29 Nov. 2024.
5. <span id="ref-iris"></span> Coren, S., & Porac, C. (1978). Iris Pigmentation and Visual-Geometric Illusions. Perception, 7(4), 473-477. https://doi.org/10.1068/p070473
