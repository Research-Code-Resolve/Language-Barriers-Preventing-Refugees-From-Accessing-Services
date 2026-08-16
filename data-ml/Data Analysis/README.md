# Data Analysis

This folder contains the refugee and service-provider survey analysis work for the RCR data project.

## Contents

- `Refugee_Survey_Analysis_Notebook.ipynb`
  - Exploratory analysis of refugee survey responses.
  - Loads raw KoboToolbox exports, cleans and maps multilingual fields, validates data quality, and exports summary tables.

- `Service_Provider_Survey_Analysis_Notebook.ipynb`
  - Exploratory analysis of service provider survey responses.
  - Works with provider survey exports and produces provider-side insights.

- `data/`
  - Raw survey Excel exports and label files.
  - Analysis output folders for both refugee and provider summaries.

## Data Directory Structure

- `data/Refugee_Survey_Language_Barriers_in_Refugee_Services_English__Kiswahili__Français_-_all_versions_-_False_-_2026-08-01-23-06-34.xlsx`
  - Raw KoboToolbox XML export for refugee survey responses.

- `data/Refugee_Survey_Language_Barriers_in_Refugee_Services_English__Kiswahili__Français_-_all_versions_-_labels_-_2026-08-01-23-06-26.xlsx`
  - Labels export for the refugee survey, including multilingual option text.

- `data/Service_Provider_Survey_Language_Barriers_in_Refugee_Services_-_all_versions_-_False_-_2026-08-01-23-07-14.xlsx`
  - Raw KoboToolbox XML export for service provider survey responses.

- `data/Service_Provider_Survey_Language_Barriers_in_Refugee_Services_-_all_versions_-_labels_-_2026-08-01-23-07-11.xlsx`
  - Labels export for the service provider survey.

- `data/refugee_analysis_outputs/`
  - CSV summary files generated from the refugee survey notebook.

- `data/service_provider_analysis_outputs/`
  - CSV summary files generated from the service provider survey notebook.

## Getting Started

1. Open this folder in VS Code.
2. Activate the Python environment if one is configured (`.venv` is present).
3. Open one of the notebooks:
   - `Refugee_Survey_Analysis_Notebook.ipynb`
   - `Service_Provider_Survey_Analysis_Notebook.ipynb`
4. Run the notebook cells sequentially.

## Notes

- The refugee dataset is small and exploratory; results are descriptive and should be reported as counts with caution.
- The notebooks expect the raw Excel exports to remain in the `data/` folder with their current filenames.
- Output CSV files are written to the respective analysis output subfolders.

## Python Requirements

- `pandas`
- `numpy`
- `matplotlib`
- `ipython`

If a virtual environment is available, use it before running the notebooks.
