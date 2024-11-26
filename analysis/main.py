import pandas as pd
import matplotlib.pyplot as plt
import os
from scipy.stats import ttest_ind

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

cap_guesses = False

# calculates the estimated value of leftLength - rightLength.
# the perceived delta for each trial is estimated using the heuristics:
# - if the response is 'left-definitely-longer', use 3 mm
# - if the response is 'left-slightly-longer', use 1 mm
# - if the response is 'same-length', use 0 mm
# - if the response is 'right-slightly-longer', use -1 mm
# - if the response is 'right-definitely-longer', use -3 mm
def estimate_perceived_delta(row):
    if row['response'] == 'left-definitely-longer':
        if row['leftLength'] > row['rightLength'] and cap_guesses:
            return row['length_delta']
        else:
            return 3
    elif row['response'] == 'left-slightly-longer':
        if row['leftLength'] > row['rightLength'] and cap_guesses:
            return row['length_delta']
        else:
            return 1
    elif row['response'] == 'same-length':
        return 0
    elif row['response'] == 'right-slightly-longer':
        if row['rightLength'] > row['leftLength'] and cap_guesses:
            return row['length_delta']
        else:
            return -1
    elif row['response'] == 'right-definitely-longer':
        if row['rightLength'] > row['leftLength'] and cap_guesses:
            return row['length_delta']
        else:
            return -3
    else:
        raise ValueError(f'Invalid response: {row["response"]}')
    
def calculate_perceptual_bias(row):
    return row['perceived_delta'] - row['length_delta']

def calculate_normalized_perceptual_bias(row):
    return row['perceptual_bias'] / ((row['leftLength'] + row['rightLength']) / 2)

# perform the data analysis

merged_data = pd.merge(user_data, trial_data, on='userId')
merged_data['length_delta'] = merged_data['leftLength'] - merged_data['rightLength']
merged_data['perceived_delta'] = merged_data.apply(estimate_perceived_delta, axis=1)
merged_data['perceptual_bias'] = merged_data.apply(calculate_perceptual_bias, axis=1)
merged_data['normalized_perceptual_bias'] = merged_data.apply(calculate_normalized_perceptual_bias, axis=1)
merged_data.to_csv('output/merged-data.csv', index=False)


# calculate the average normalized Perceptual Bias for each user
average_normalized_perceptual_bias = merged_data.groupby('userId')['normalized_perceptual_bias'].mean().reset_index()
average_normalized_perceptual_bias['name'] = average_normalized_perceptual_bias['userId'].apply(lambda x: user_data[user_data['userId'] == x]['userName'].values[0])
average_normalized_perceptual_bias = average_normalized_perceptual_bias.sort_values('normalized_perceptual_bias')
average_normalized_perceptual_bias.to_csv('output/average-normalized_perceptual_bias.csv', index=False)


# create the plots


# separate the data into groups by variant
variant_groups = merged_data.groupby('variant')

# create a box plot of normalized Perceptual Bias for each variant
plt.clf()
position = 0
for name, group in variant_groups:
    plt.boxplot(group['normalized_perceptual_bias'], positions=[position], showfliers=False, showmeans=True)
    position += 1
plt.xticks(range(len(variant_groups)), variant_groups.groups.keys())
plt.xlabel('Variant')
plt.ylabel('Normalized Perceptual Bias')
plt.title('Normalized Perceptual Bias by Variant')
plt.grid(axis='y')
plt.savefig('output/normalized-perceptual-bias-by-variant-box.png')

plt.clf()
for name, group in variant_groups:
    group['normalized_perceptual_bias'].plot(kind='kde', label=name, bw_method=0.6)
plt.xlabel('Normalized Perceptual Bias')
plt.ylabel('Density')
plt.title('Distribution of Normalized Perceptual Bias by Variant')
plt.legend()
plt.grid(True)
plt.savefig('output/normalized-perceptual-bias-by-variant-graph.png')

# perform a t-test to determine if the normalized Perceptual Bias is significantly different between the variants
baseline_group = variant_groups.get_group('baseline')
without_baseline = variant_groups.groups.keys() - ['baseline']
ttest_results = {}

for variant in without_baseline:
    variant_group = variant_groups.get_group(variant)
    t_stat, p_value = ttest_ind(baseline_group['normalized_perceptual_bias'], variant_group['normalized_perceptual_bias'])
    for variant2 in variant_groups.groups.keys():
        if variant2 != variant:
            variant_a = variant if variant < variant2 else variant2
            variant_b = variant2 if variant < variant2 else variant
            if f'{variant_a}-{variant_b}' not in ttest_results:
                variant2_group = variant_groups.get_group(variant2)
                t_stat, p_value = ttest_ind(variant_group['normalized_perceptual_bias'], variant2_group['normalized_perceptual_bias'])
                # Format p-value to 5 significant figures
                ttest_results[f'{variant_a}-{variant_b}'] = (t_stat, f'{p_value:.5g}')
    
ttest_results_df = pd.DataFrame(ttest_results).T
ttest_results_df.columns = ['t_stat', 'p_value']
ttest_results_df.index.name = 'variants'
ttest_results_df.to_csv('output/ttest-results.csv')

for name, group in variant_groups:
    configuration_groups = group.groupby('configuration')

    plt.clf()
    position = 0
    for configuration, configuration_group in configuration_groups:
        plt.boxplot(configuration_group['normalized_perceptual_bias'], positions=[position], showfliers=False, showmeans=True)
        position += 1
    plt.xticks(range(len(configuration_groups)), configuration_groups.groups.keys())
    plt.xlabel('Configuration')
    plt.ylabel('Normalized Perceptual Bias')
    plt.title(f'Normalized Perceptual Bias by Configuration for {name}')
    plt.grid(axis='y')
    plt.savefig(f'output/normalized-perceptual-bias-by-configuration-{name}-box.png')

    plt.clf()
    for configuration, configuration_group in configuration_groups:
        configuration_group['normalized_perceptual_bias'].plot(kind='kde', label=configuration, bw_method=0.6)
    plt.xlabel('Normalized Perceptual Bias')
    plt.ylabel('Density')
    plt.title(f'Distribution of Normalized Perceptual Bias by Configuration for {name}')
    plt.legend()
    plt.grid(True)
    plt.savefig(f'output/normalized-perceptual-bias-by-configuration-{name}-graph.png')

# perform a t-test to determine if the normalized Perceptual Bias is significantly different between the configurations
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
                    t_stat, p_value = ttest_ind(configuration_group['normalized_perceptual_bias'], configuration2_group['normalized_perceptual_bias'])
                    # Format p-value to 5 significant figures
                    ttest_results[f'{configuration_a}-{configuration_b}'] = (t_stat, f'{p_value:.5g}')
    
    ttest_results_df = pd.DataFrame(ttest_results).T
    ttest_results_df.columns = ['t_stat', 'p_value']
    ttest_results_df.index.name = 'configurations'
    ttest_results_df.to_csv(f'output/ttest-results-{name}.csv')
