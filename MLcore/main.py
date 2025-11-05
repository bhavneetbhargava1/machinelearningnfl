import nfl_data_py as nfl
import pandas as pd
import os

pbp = nfl.import_pbp_data([2018, 2019, 2020, 2021, 2022, 2023, 2024])

file_directory = 'dataset/nfl-scores-and-betting-data'

betting_df = pd.DataFrame()
for file in os.listdir(file_directory):
    if file.endswith('.csv'):
        week_data = pd.read_csv(os.path.join(file_directory, file))
        betting_df = pd.concat([betting_df, week_data], ignore_index=True)

print('PBP DataFrame columns:', pbp.columns.tolist())
print('Betting DataFrame columns:', betting_df.columns.tolist())