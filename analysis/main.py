import pandas as pd
import matplotlib.pyplot as plt
from scipy.stats import linregress, ttest_ind
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
os.makedirs('output/success-rate', exist_ok=True)
os.makedirs('output/intermediate', exist_ok=True)

# read in the contents of input/user-data.csv and input/trial-data.csv
user_data = pd.read_csv('input/user-data.csv')
trial_data = pd.read_csv('input/trial-data.csv')

# merge the two dataframes on the 'userId' column
merged_data = pd.merge(user_data, trial_data, on='userId')

# add column 'trial_success' to merged_data that is True if 'leftLength' > 'rightLength' and response is 'left-definitely-longer' or 'left-slightly-longer', or if 'rightLength' > 'leftLength' and response is 'right-definitely-longer' or 'right-slightly-longer', or 'leftLength' == 'rightLength' and response is 'same-length'
merged_data['trial_success'] = ((merged_data['leftLength'] > merged_data['rightLength']) & (merged_data['response'].isin(['left-definitely-longer', 'left-slightly-longer']))) | ((merged_data['rightLength'] > merged_data['leftLength']) & (merged_data['response'].isin(['right-definitely-longer', 'right-slightly-longer']))) | ((merged_data['leftLength'] == merged_data['rightLength']) & (merged_data['response'] == 'same-length'))
merged_data.to_csv('output/merged-data.csv', index=False)

# calculate the percentage of successful trials for each user
success_rate = merged_data.groupby('userId')['trial_success'].mean().reset_index()
success_rate.to_csv('output/success-rate/success-rate.csv', index=False)

# calculate the delta between the left and right lengths for each trial
merged_data['length_delta'] = merged_data['leftLength'] - merged_data['rightLength']
merged_data.to_csv('output/intermediate/length-delta.csv', index=False)

# estimate the perceived delta for each trial by using the heuristics:
# - if the response is 'left-definitely-longer', use 3 mm
# - if the response is 'left-slightly-longer', use 1 mm
# - if the response is 'same-length', use 0 mm
# - if the response is 'right-slightly-longer', use -1 mm
# - if the response is 'right-definitely-longer', use -3 mm
def estimate_perceived_delta(row):
    if row['response'] == 'left-definitely-longer':
        return 3
    elif row['response'] == 'left-slightly-longer':
        return 1
    elif row['response'] == 'same-length':
        return 0
    elif row['response'] == 'right-slightly-longer':
        return -1
    elif row['response'] == 'right-definitely-longer':
        return -3
    else:
        raise ValueError(f'Invalid response: {row["response"]}')
    
merged_data['perceived_delta'] = merged_data.apply(estimate_perceived_delta, axis=1)
merged_data.to_csv('output/intermediate/perceived-delta.csv', index=False)

# calculate the error for each trial by subtracting the perceived delta from the actual delta
merged_data['error'] = merged_data['length_delta'] - merged_data['perceived_delta']
merged_data.to_csv('output/intermediate/error.csv', index=False)

# plot the distribution of errors
plt.hist(merged_data['error'], bins=10)
plt.xlabel('Error (mm)')
plt.ylabel('Frequency')
plt.title('Distribution of Errors')
plt.savefig('output/error-distribution.png')

# calculate the average error for each user
average_error = merged_data.groupby('userId')['error'].mean().reset_index()
average_error['name'] = average_error['userId'].apply(lambda x: user_data[user_data['userId'] == x]['userName'].values[0])
average_error.to_csv('output/average-error.csv', index=False)

# plot the distribution of average errors
plt.clf()
plt.hist(average_error['error'], bins=10)
plt.xlabel('Average Error (mm)')
plt.ylabel('Frequency')
plt.title('Distribution of Average Errors')
plt.savefig('output/average-error-distribution.png')

# separate the data into groups by variant
variant_groups = merged_data.groupby('variant')

# create a box plot of errors for each variant. show error values to 2 decimal places
plt.clf()
position = 0
for name, group in variant_groups:
    plt.boxplot(group['error'], positions=[position], showfliers=False, showmeans=True)
    position += 1
plt.xticks(range(len(variant_groups)), variant_groups.groups.keys())
plt.xlabel('Variant')
plt.ylabel('Perceived Illusion (mm)')
plt.title('Perceived Illusion by Variant')
plt.grid(axis='y')
plt.savefig('output/error-by-variant.png')

# not including baseline and obliques
filtered_merged_data = merged_data[~merged_data['variant'].isin(['baseline', 'obliques'])]
delta_groups = filtered_merged_data.groupby('length_delta')

# create a box plot of errors for each delta. show error values to 2 decimal places
plt.clf()
position = 0
for name, group in delta_groups:
    plt.boxplot(group['error'], positions=[position], showfliers=False, showmeans=True)
    position += 1
plt.xticks(range(len(delta_groups)), delta_groups.groups.keys())
plt.xlabel('Actual Delta (mm)')
plt.ylabel('Perceived Delta (mm)')
plt.title('Perceived Delta by Actual Delta')
plt.grid(axis='y')
plt.savefig('output/error-by-delta.png')




# # calculate the average response time for each user
# average_response_time = merged_data.groupby('userId')['responseTimeMs'].mean().reset_index()
# average_response_time.to_csv('output/average-response-time.csv', index=False)

# # perform a linear regression to determine the relationship between average response time and success rate
# slope, intercept, r_value, p_value, std_err = linregress(average_response_time['responseTimeMs'], success_rate['trial_success'])

# # write the results of the linear regression to a text file
# with open('output/avg-response-time-vs-success-rate-regression.txt', 'w') as f:
#     f.write(f'Slope: {slope}\n')
#     f.write(f'Intercept: {intercept}\n')
#     f.write(f'R-squared: {r_value**2}\n')
#     f.write(f'P-value: {p_value}\n')
#     f.write(f'Standard Error: {std_err}\n')

# # create a scatter plot of average response time vs. success rate
# plt.scatter(average_response_time['responseTimeMs'], success_rate['trial_success'])
# plt.plot(average_response_time['responseTimeMs'], slope * average_response_time['responseTimeMs'] + intercept, color='red')
# plt.xlabel('Average Response Time (ms)')
# plt.ylabel('Success Rate')
# plt.title('Average Response Time vs. Success Rate')
# plt.savefig('output/avg-response-time-vs-success-rate.png')

# # create a histogram of trial response time vs. success rate
# plt.clf()
# merged_data['responseTimeMs'].hist(by=merged_data['trial_success'], bins=20)
# plt.xlabel('Response Time (ms)')
# plt.ylabel('Frequency')
# plt.savefig('output/response-time-vs-success-rate.png')

# # perform a t-test to determine if there is a significant difference in response time between successful and unsuccessful trials
# successful_trials = merged_data[merged_data['trial_success']]
# unsuccessful_trials = merged_data[~merged_data['trial_success']]
# t_stat, p_value = ttest_ind(successful_trials['responseTimeMs'], unsuccessful_trials['responseTimeMs'], equal_var=False)

# # write the results of the t-test to a text file
# with open('output/response-time-vs-success-rate-results.txt', 'w') as f:
#     f.write(f'Successful trial sample size: {len(successful_trials)}\n')
#     f.write(f'Unsuccessful trial sample size: {len(unsuccessful_trials)}\n')
#     f.write(f'T-statistic: {t_stat}\n')
#     f.write(f'P-value: {p_value}\n')

# # filter users by gender
# male_users = merged_data[merged_data['gender'] == 'male']
# female_users = merged_data[merged_data['gender'] == 'female']

# # calculate the success rate for male and female users
# male_success_rate = male_users.groupby('userId')['trial_success'].mean()
# female_success_rate = female_users.groupby('userId')['trial_success'].mean()

# # perform a t-test to determine if there is a significant difference in success rate between male and female users
# t_stat, p_value = ttest_ind(male_success_rate, female_success_rate, equal_var=False)

# # write the results of the t-test to a text file
# with open('output/gender-success-rate-results.txt', 'w') as f:
#     f.write(f'Male sample size: {len(male_success_rate)}\n')
#     f.write(f'Female sample size: {len(female_success_rate)}\n')
#     f.write(f'T-statistic: {t_stat}\n')
#     f.write(f'P-value: {p_value}\n')
