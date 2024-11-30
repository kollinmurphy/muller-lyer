import pandas as pd
import matplotlib.pyplot as plt
import os
from scipy.stats import ttest_ind
import numpy as np

plt.rcParams.update({
    'savefig.dpi': 300,
    # 'savefig.transparent': True,
    'savefig.bbox': 'tight',
    'savefig.pad_inches': 0.0
})

if os.path.exists('output'):
    for file in os.listdir('output'):
        file_path = os.path.join('output', file)
        if os.path.isfile(file_path):
            os.remove(file_path)
        elif os.path.isdir(file_path):
            for sub_file in os.listdir(file_path):
                os.remove(os.path.join(file_path, sub_file))
            os.rmdir(file_path)
    os.rmdir('output')
os.makedirs('output', exist_ok=True)

user_data = pd.read_csv('input/user-data.csv')
trial_data = pd.read_csv('input/trial-data.csv')

# calculates the estimated value of rightLength - leftLength.
# the perceived delta for each trial is estimated using the heuristics:
# - if the response is 'left-definitely-longer', use -3 mm
# - if the response is 'left-slightly-longer', use -1 mm
# - if the response is 'same-length', use 0 mm
# - if the response is 'right-slightly-longer', use +1 mm
# - if the response is 'right-definitely-longer', use +3 mm
def estimate_perceived_delta(row):
    if row['response'] == 'left-definitely-longer':
        return -3
    elif row['response'] == 'left-slightly-longer':
        return -1
    elif row['response'] == 'same-length':
        return 0
    elif row['response'] == 'right-slightly-longer':
        return 1
    elif row['response'] == 'right-definitely-longer':
        return 3
    else:
        raise ValueError(f'Invalid response: {row["response"]}')
    
def calculate_perceptual_bias(row):
    return row['perceived_delta'] - row['length_delta']

colors = ['blue', 'brown', 'green', 'hazel']
color_map = {
    'blue': 'blue',
    'brown': 'brown',
    'green': 'green',
    'hazel': 'orange'
}

merged_data = pd.merge(user_data, trial_data, on='userId')
merged_data['length_delta'] = merged_data['rightLength'] - merged_data['leftLength']
merged_data['perceived_delta'] = merged_data.apply(estimate_perceived_delta, axis=1)
merged_data['perceptual_bias'] = merged_data.apply(calculate_perceptual_bias, axis=1)
merged_data.to_csv('output/merged-data.csv', index=False)

# calculate the average perceptual bias for each user
average_perceptual_bias = merged_data.groupby('userId')['perceptual_bias'].mean().reset_index()
average_perceptual_bias['name'] = average_perceptual_bias['userId'].apply(lambda x: user_data[user_data['userId'] == x]['userName'].values[0])
average_perceptual_bias.sort_values('perceptual_bias').to_csv('output/average-perceptual_bias.csv', index=False)

# separate the data into groups by variant
variant_groups = merged_data.groupby('variant')

plt.clf()
for name, group in variant_groups:
    group['perceptual_bias'].plot(kind='kde', label=name, bw_method=0.6)
plt.xlabel('Perceptual Bias (mm)')
plt.ylabel('Density')
plt.legend()
plt.grid(True)
plt.xlim(-6, 6)
plt.savefig('output/perceptual-bias-by-variant-graph.png')

# perform a t-test to determine if the perceptual bias is significantly different between the variants
baseline_group = variant_groups.get_group('baseline')
without_baseline = variant_groups.groups.keys() - ['baseline']
ttest_results = {}

for variant in without_baseline:
    variant_group = variant_groups.get_group(variant)
    t_stat, p_value = ttest_ind(baseline_group['perceptual_bias'], variant_group['perceptual_bias'])
    for variant2 in variant_groups.groups.keys():
        if variant2 != variant:
            variant_a = variant if variant < variant2 else variant2
            variant_b = variant2 if variant < variant2 else variant
            if f'{variant_a}-{variant_b}' not in ttest_results:
                variant2_group = variant_groups.get_group(variant2)
                t_stat, p_value = ttest_ind(variant_group['perceptual_bias'], variant2_group['perceptual_bias'])
                # Format p-value to 5 significant figures
                ttest_results[f'{variant_a}-{variant_b}'] = (t_stat, f'{p_value:.5g}')
    
ttest_results_df = pd.DataFrame(ttest_results).T
ttest_results_df.columns = ['t_stat', 'p_value']
ttest_results_df.index.name = 'variants'
ttest_results_df.to_csv('output/ttest-results.csv')

for name, group in variant_groups:
    configuration_groups = group.groupby('configuration')

    plt.clf()
    for configuration, configuration_group in configuration_groups:
        configuration_group['perceptual_bias'].plot(kind='kde', label=configuration, bw_method=0.6)
    plt.xlabel('Perceptual Bias (mm)')
    plt.ylabel('Density')
    plt.legend()
    plt.grid(True)
    plt.xlim(-6, 6)
    plt.savefig(f'output/perceptual-bias-by-configuration-{name}-graph.png')

# perform a t-test to determine if the perceptual bias is significantly different between the configurations
for name, group in variant_groups:
    configuration_groups = group.groupby('configuration')
    ttest_results = {}

    for configuration in configuration_groups.groups.keys():
        configuration_group = configuration_groups.get_group(configuration)
        for configuration2 in configuration_groups.groups.keys():
            if configuration2 != configuration:
                configuration_a = configuration if configuration < configuration2 else configuration2
                configuration_b = configuration2 if configuration < configuration2 else configuration
                if f'{configuration_a}-{configuration_b}' not in ttest_results:
                    configuration2_group = configuration_groups.get_group(configuration2)
                    t_stat, p_value = ttest_ind(configuration_group['perceptual_bias'], configuration2_group['perceptual_bias'])
                    # Format p-value to 5 significant figures
                    ttest_results[f'{configuration_a}-{configuration_b}'] = (t_stat, f'{p_value:.5g}')
    
    ttest_results_df = pd.DataFrame(ttest_results).T
    ttest_results_df.columns = ['t_stat', 'p_value']
    ttest_results_df.index.name = 'configurations'
    ttest_results_df.to_csv(f'output/ttest-results-{name}.csv')

# create a distribution of the average response time for each variant
plt.clf()
for name, group in variant_groups:
    q1 = group['responseTimeMs'].quantile(0.25)
    q3 = group['responseTimeMs'].quantile(0.75)
    iqr = q3 - q1
    lower_bound = q1 - 1.5 * iqr
    upper_bound = q3 + 1.5 * iqr
    group = group[(group['responseTimeMs'] > lower_bound) & (group['responseTimeMs'] < upper_bound)]
    group['responseTimeMs'].plot(kind='kde', label=name, bw_method=0.3)
plt.xlabel('Response Time (ms)')
plt.ylabel('Density')
plt.yticks([])
plt.xlim(0, 8000)
plt.legend()
plt.grid(True)
plt.savefig('output/response-time-distribution.png')

# perform a t-test to determine if the response time is significantly different between the variants
ttest_results = {}

for variant in without_baseline:
    variant_group = variant_groups.get_group(variant)
    t_stat, p_value = ttest_ind(baseline_group['responseTimeMs'], variant_group['responseTimeMs'])
    for variant2 in variant_groups.groups.keys():
        if variant2 != variant:
            variant_a = variant if variant < variant2 else variant2
            variant_b = variant2 if variant < variant2 else variant
            if f'{variant_a}-{variant_b}' not in ttest_results:
                variant2_group = variant_groups.get_group(variant2)
                t_stat, p_value = ttest_ind(variant_group['responseTimeMs'], variant2_group['responseTimeMs'])
                # Format p-value to 5 significant figures
                ttest_results[f'{variant_a}-{variant_b}'] = (t_stat, f'{p_value:.5g}')

ttest_results_df = pd.DataFrame(ttest_results).T
ttest_results_df.columns = ['t_stat', 'p_value']
ttest_results_df.index.name = 'variants'
ttest_results_df.to_csv('output/ttest-results-response-time.csv')

# create a distribution of the average response time for each configuration
plt.clf()
for configuration, group in merged_data.groupby('configuration'):
    q1 = group['responseTimeMs'].quantile(0.25)
    q3 = group['responseTimeMs'].quantile(0.75)
    iqr = q3 - q1
    lower_bound = q1 - 1.5 * iqr
    upper_bound = q3 + 1.5 * iqr
    group = group[(group['responseTimeMs'] > lower_bound) & (group['responseTimeMs'] < upper_bound)]
    group['responseTimeMs'].plot(kind='kde', label=configuration, bw_method=0.3)

plt.xlabel('Response Time (ms)')
plt.ylabel('Density')
plt.yticks([])
plt.xlim(0, 7000)
plt.legend()
plt.grid(True)
plt.savefig('output/response-time-distribution-by-configuration.png')

# perform a t-test to determine if the response time is significantly different between the configurations
configuration_groups = merged_data.groupby('configuration')
ttest_results = {}

for configuration in configuration_groups.groups.keys():
    configuration_group = configuration_groups.get_group(configuration)
    for configuration2 in configuration_groups.groups.keys():
        if configuration2 != configuration:
            configuration_a = configuration if configuration < configuration2 else configuration2
            configuration_b = configuration2 if configuration < configuration2 else configuration
            if f'{configuration_a}-{configuration_b}' not in ttest_results:
                configuration2_group = configuration_groups.get_group(configuration2)
                t_stat, p_value = ttest_ind(configuration_group['responseTimeMs'], configuration2_group['responseTimeMs'])
                # Format p-value to 5 significant figures
                ttest_results[f'{configuration_a}-{configuration_b}'] = (t_stat, f'{p_value:.5g}')

ttest_results_df = pd.DataFrame(ttest_results).T
ttest_results_df.columns = ['t_stat', 'p_value']
ttest_results_df.index.name = 'configurations'
ttest_results_df.to_csv('output/ttest-results-response-time-configuration.csv')

# create a distribution of the average perceptual bias by user and eye color
plt.clf()
for color in colors:
    color_group = merged_data[merged_data['eyeColor'] == color]
    color_group['perceptual_bias'].plot(kind='kde', label=color, bw_method=0.6, color=color_map[color])
plt.xlabel('Perceptual Bias (mm)')
plt.ylabel('Density')
plt.legend()
plt.grid(True)
plt.xlim(-6, 6)
plt.savefig('output/perceptual-bias-by-eye-color.png')

# perform a t-test to determine if the perceptual bias is significantly different between the eye colors
eye_color_groups = merged_data.groupby('eyeColor')
ttest_results = {}
for color in colors:
    color_group = eye_color_groups.get_group(color)
    for color2 in colors:
        if color2 != color:
            color_a = color if color < color2 else color2
            color_b = color2 if color < color2 else color
            if f'{color_a}-{color_b}' not in ttest_results:
                color2_group = eye_color_groups.get_group(color2)
                t_stat, p_value = ttest_ind(color_group['perceptual_bias'], color2_group['perceptual_bias'])
                # Format p-value to 5 significant figures
                ttest_results[f'{color_a}-{color_b}'] = (t_stat, f'{p_value:.5g}')
ttest_results_df = pd.DataFrame(ttest_results).T
ttest_results_df.columns = ['t_stat', 'p_value']
ttest_results_df.index.name = 'eye_colors'
ttest_results_df.to_csv('output/ttest-results-eye-color.csv')

# create a markdown table of the t-test results
ttest_results_df['Eye Color A'] = ttest_results_df.index.str.split('-').str[0]
ttest_results_df['Eye Color B'] = ttest_results_df.index.str.split('-').str[1]
ttest_results_df[['Eye Color A', 'Eye Color B', 'p_value']].sort_values('p_value').to_markdown('output/ttest-results-eye-color.md', index=False)

# determine mean, median, and standard deviation of perceptual bias for each configuration for each variant
summary_data = merged_data.groupby(['variant', 'configuration'])['perceptual_bias'].agg(['mean', 'median', 'std']).reset_index()
summary_data.to_csv('output/summary-data.csv', index=False)
summary_data.to_markdown('output/summary-data.md', index=False)

# create a distribution of the perceptual bias for vertical, offset, and Brentano configurations, combining circle, square, and arrowhead variants
plt.clf()
groups = {}
for configuration in ['vertical', 'offset', 'brentano']:
    configuration_group = merged_data[merged_data['configuration'] == configuration]
    configuration_group = configuration_group[configuration_group['variant'].isin(['circle', 'square', 'arrowhead'])]
    groups[configuration] = configuration_group
    configuration_group['perceptual_bias'].plot(kind='kde', label=configuration, bw_method=0.6)
plt.xlabel('Perceptual Bias (mm)')
plt.ylabel('Density')
plt.legend()
plt.grid(True)
plt.xlim(-6, 6)
plt.savefig('output/perceptual-bias-by-configuration.png')

# perform a t-test to determine if the perceptual bias is significantly different between the configurations
configuration_groups = merged_data.groupby('configuration')
ttest_results = {}

for configuration in ['vertical', 'offset', 'brentano']:
    configuration_group = groups[configuration]
    for configuration2 in ['vertical', 'offset', 'brentano']:
        if configuration2 != configuration:
            configuration_a = configuration if configuration < configuration2 else configuration2
            configuration_b = configuration2 if configuration < configuration2 else configuration
            if f'{configuration_a}-{configuration_b}' not in ttest_results:
                configuration2_group = groups[configuration2]
                t_stat, p_value = ttest_ind(configuration_group['perceptual_bias'], configuration2_group['perceptual_bias'])
                ttest_results[f'{configuration_a}-{configuration_b}'] = (t_stat, f'{p_value:.5g}')

ttest_results_df = pd.DataFrame(ttest_results).T
ttest_results_df.columns = ['t_stat', 'p_value']
ttest_results_df.index.name = 'configurations'
ttest_results_df.to_csv('output/ttest-results-configuration.csv')

# create a scatter plot of age and perceptual bias
plt.clf()
plt.scatter(merged_data['age'], merged_data['perceptual_bias'], alpha=0.5)
plt.xlabel('Age (years)')
plt.ylabel('Perceptual Bias (mm)')
plt.grid(True)
plt.savefig('output/age-vs-perceptual-bias.png')

# perform a correlation test to determine if age and perceptual bias are correlated
correlation = merged_data[['age', 'perceptual_bias']].corr()
correlation.to_csv('output/age-correlation.csv')

# create a scatter plot of response time and perceptual bias
plt.clf()
q1 = merged_data['responseTimeMs'].quantile(0.25)
q3 = merged_data['responseTimeMs'].quantile(0.75)
iqr = q3 - q1
lower_bound = q1 - 1.5 * iqr
upper_bound = q3 + 1.5 * iqr
response_data = merged_data[(merged_data['responseTimeMs'] > lower_bound) & (merged_data['responseTimeMs'] < upper_bound)]

# perform a correlation test to determine if response time and perceptual bias are correlated
correlation = response_data[['responseTimeMs', 'perceptual_bias']].corr()
correlation.to_csv('output/response-time-correlation.csv')

plt.scatter(response_data['responseTimeMs'], response_data['perceptual_bias'], alpha=0.5)
# draw a line of best fit
m, b = np.polyfit(response_data['responseTimeMs'], response_data['perceptual_bias'], 1)
plt.plot(response_data['responseTimeMs'], m * response_data['responseTimeMs'] + b, color='red')
plt.xlabel('Response Time (ms)')
plt.ylabel('Perceptual Bias (mm)')
plt.grid(True)
plt.savefig('output/response-time-vs-perceptual-bias.png')

# create a distribution of perceptual bias and gender
male_group = merged_data[merged_data['gender'] == 'male']
female_group = merged_data[merged_data['gender'] == 'female']

plt.clf()
male_group['perceptual_bias'].plot(kind='kde', label='Male', bw_method=0.6)
female_group['perceptual_bias'].plot(kind='kde', label='Female', bw_method=0.6)
plt.xlabel('Perceptual Bias (mm)')
plt.ylabel('Density')
plt.legend()
plt.grid(True)
plt.xlim(-6, 6)
plt.savefig('output/perceptual-bias-by-gender.png')

# perform t-test of perceptual bias and gender
t_stat, p_value = ttest_ind(male_group['perceptual_bias'], female_group['perceptual_bias'])
ttest_results = {
    't_stat': t_stat,
    'p_value': p_value
}
# write t-test results to file
with open('output/ttest-results-gender.txt', 'w') as f:
    f.write(f'T-statistic: {t_stat}\n')
    f.write(f'P-value: {p_value}\n')

