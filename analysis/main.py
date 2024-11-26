import pandas as pd
import matplotlib.pyplot as plt
import os

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
os.makedirs('output/illusion-by-delta', exist_ok=True)

user_data = pd.read_csv('input/user-data.csv')
trial_data = pd.read_csv('input/trial-data.csv')

cap_guesses = False

# estimate the perceived delta for each trial by using the heuristics:
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
    
def is_illusion_expected(row):
    return row['length_delta'] >= 0

# perform the data analysis

merged_data = pd.merge(user_data, trial_data, on='userId')
merged_data['length_delta'] = merged_data['leftLength'] - merged_data['rightLength']
merged_data['perceived_delta'] = merged_data.apply(estimate_perceived_delta, axis=1)
merged_data['perceived_illusion'] = merged_data['length_delta'] - merged_data['perceived_delta']
merged_data['trial_success'] = merged_data.apply(lambda x: x['perceived_illusion'] == 0, axis=1)
merged_data.to_csv('output/merged-data.csv', index=False)
expected_illusion_data = merged_data[merged_data.apply(is_illusion_expected, axis=1)]


# calculate the average perceived illusion for each user
average_perceived_illusion = merged_data.groupby('userId')['perceived_illusion'].mean().reset_index()
average_perceived_illusion['name'] = average_perceived_illusion['userId'].apply(lambda x: user_data[user_data['userId'] == x]['userName'].values[0])
average_perceived_illusion = average_perceived_illusion.sort_values('perceived_illusion')
average_perceived_illusion.to_csv('output/average-perceived_illusion.csv', index=False)


# create the plots


# separate the data into groups by variant
variant_groups = merged_data.groupby('variant')
expected_illusion_variant_groups = expected_illusion_data.groupby('variant')
no_expected_illusion_variant_groups = merged_data[~merged_data.apply(is_illusion_expected, axis=1)].groupby('variant')

# create a box plot of perceived illusion for each variant
plt.clf()
position = 0
for name, group in variant_groups:
    plt.boxplot(group['perceived_illusion'], positions=[position], showfliers=False, showmeans=True)
    position += 1
plt.xticks(range(len(variant_groups)), variant_groups.groups.keys())
plt.xlabel('Variant')
plt.ylabel('Perceived Illusion (mm)')
plt.title('Perceived Illusion by Variant')
plt.grid(axis='y')
plt.savefig('output/illusion-by-variant.png')

# create a distribution of perceived illusion values for each variant for trials with expected illusion
plt.clf()
for name, group in expected_illusion_variant_groups:
    group['perceived_illusion'].plot(kind='kde', label=name, bw_method=0.6)
plt.xlabel('Perceived Illusion (mm)')
plt.ylabel('Density')
plt.title('Perceived Illusion Distribution by Variant for Trials with Expected Illusion')
plt.legend()
plt.grid(True)
plt.xticks([x * 2 for x in range(-3, 4)])
plt.xlim(-6, 6)
plt.savefig('output/illusion-distribution-by-variant-with-expected-illusion.png')

# create a distribution of perceived illusion values for each variant for trials without expected illusion
plt.clf()
for name, group in no_expected_illusion_variant_groups:
    group['perceived_illusion'].plot(kind='kde', label=name, bw_method=0.6)
plt.xlabel('Perceived Illusion (mm)')
plt.ylabel('Density')
plt.title('Perceived Illusion Distribution by Variant for Trials without Expected Illusion')
plt.legend()
plt.grid(True)
plt.xticks([x * 2 for x in range(-3, 4)])
plt.xlim(-6, 6)
plt.savefig('output/illusion-distribution-by-variant-no-expected-illusion.png')

# create a distribution of perceived illusion values for each variant for all trials
plt.clf()
for name, group in variant_groups:
    group['perceived_illusion'].plot(kind='kde', label=name, bw_method=0.6)
plt.xlabel('Perceived Illusion (mm)')
plt.ylabel('Density')
plt.title('Perceived Illusion Distribution by Variant for All Trials')
plt.legend()
plt.grid(True)
plt.xticks([x * 2 for x in range(-3, 4)])
plt.xlim(-6, 6)
plt.savefig('output/illusion-distribution-by-variant-all.png')

# create a box plot of perceived illusion for each delta
plt.clf()
position = 0
delta_groups_excluding_baseline = merged_data[~merged_data['variant'].isin(['baseline'])].groupby('length_delta')
for name, group in delta_groups_excluding_baseline:
    plt.boxplot(group['perceived_illusion'], positions=[position], showfliers=False, showmeans=True)
    position += 1
plt.xticks(range(len(delta_groups_excluding_baseline)), delta_groups_excluding_baseline.groups.keys())
plt.xlabel('Actual Delta (mm)')
plt.ylabel('Perceived Illusion (mm)')
plt.title('Perceived Illusion by Actual Delta (excluding baseline)')
plt.grid(axis='y')
plt.ylim(-6, 6)
plt.yticks(range(-5, 6))
plt.savefig('output/illusion-by-delta/overall.png')

# create a box plot of perceived illusion for each delta for each variant
for name, group in variant_groups:
    plt.clf()
    variant_delta_groups = group.groupby('length_delta')
    position = 0
    for delta, delta_group in variant_delta_groups:
        plt.boxplot(delta_group['perceived_illusion'], positions=[position], showfliers=False, showmeans=True)
        position += 1
    plt.xticks(range(len(variant_delta_groups)), variant_delta_groups.groups.keys())
    plt.xlabel('Actual Delta (mm)')
    plt.ylabel('Perceived Illusion (mm)')
    plt.title(f'Perceived Illusion by Actual Delta for {name}')
    plt.grid(axis='y')
    plt.ylim(-6, 6)
    plt.yticks(range(-5, 6))
    plt.savefig(f'output/illusion-by-delta/{name}.png')

