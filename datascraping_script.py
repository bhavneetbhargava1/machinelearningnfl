import pandas as pd
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import re
import os
import time


def scrape_nfl_stats(team_code='sea', year=2025):
    """
    Scrape NFL team statistics from Pro Football Reference

    Args:
        team_code (str): Team abbreviation (e.g., 'sea' for Seahawks)
        year (int): Season year

    Returns:
        dict: Dictionary of DataFrames, keyed by table name
    """

    url = f'https://www.pro-football-reference.com/teams/{team_code}/{year}.htm'

    print(f"Scraping {team_code.upper()} statistics for {year} season...")
    print(f"URL: {url}\n")

    # Setup Chrome options
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.add_argument(
        'user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

    # Initialize driver
    print("Initializing Chrome driver...")

    driver_path = ChromeDriverManager().install()
    service = Service(driver_path, service_connection_timeout=30)
    driver = webdriver.Chrome(service=service, options=chrome_options)

    all_tables = {}

    single_folder_name = f"{team_code}{year}"
    OUTPUT_DIR = os.path.join('scraped_nfl_data', single_folder_name)

    try:
        # Create the directory structure
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        print(f"Output folder created/verified: {OUTPUT_DIR}")

        # Load the page
        print("Loading page...")
        driver.get(url)

        # Wait for content to load
        print("Waiting for tables to load...")
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "table"))
        )

        time.sleep(3)

        # Get page source
        html = driver.page_source

        # Remove HTML comments
        print("Processing HTML and extracting tables...")
        html = re.sub(r'<!--(.*?)-->', r'\1', html, flags=re.DOTALL)

        # Parse with BeautifulSoup
        soup = BeautifulSoup(html, 'html.parser')
        tables = soup.find_all('table')

        print(f"\nFound {len(tables)} tables")
        print("=" * 70)

        # List of caption names of desired tables
        WANTED_CAPTION_PATTERNS = [
            'schedule & game results',
            'team stats and rankings',
            'team conversions',
            'passing',
            'rushing & receiving',
            'kick & punt returns',
            'kicking',
            'punting',
            'defense & fumbles',
            'scoring summary'
        ]

        # Process each table
        for i, table in enumerate(tables):
            # Get table metadata
            caption = table.find('caption')
            table_id = table.get('id', f'table_{i}')
            caption_text = caption.text.strip() if caption else table_id

            print(f"\n[{i + 1}/{len(tables)}] Processing: {caption_text}")

            isWanted = False

            caption_text_lower = caption_text.lower()

            for pattern in WANTED_CAPTION_PATTERNS:
                # Checks if pattern is a substring of the table's captions
                if pattern in caption_text_lower:
                    isWanted = True
                    break

            if not isWanted:
                continue # Skips all tables that are not the desired tables


            # Extract headers - get ALL unique headers
            headers_list = []
            thead = table.find('thead')

            if thead:
                # Collect headers from all rows in thead
                all_th = thead.find_all('th')
                for th in all_th:
                    header_text = th.text.strip()
                    data_stat = th.get('data-stat', '')

                    # Use data-stat if available, otherwise use text
                    if data_stat and data_stat not in headers_list:
                        headers_list.append(data_stat)
                    elif header_text and header_text not in headers_list and data_stat == '':
                        headers_list.append(header_text)

            # Extract data rows - SKIP rows that are sub-headers
            rows = []
            tbody = table.find('tbody')

            if tbody:
                for tr in tbody.find_all('tr'):
                    # Skip rows that are headers (class='thead' or has <th> with colspan)
                    if 'thead' in tr.get('class', []):
                        continue

                    # Check if this row is a separator/header row
                    th_elements = tr.find_all('th')
                    if th_elements:
                        # Check if it has colspan (usually means it's a section header)
                        has_colspan = any(th.get('colspan') for th in th_elements)
                        if has_colspan:
                            continue

                    # Get all cells
                    cells = tr.find_all(['td', 'th'])

                    if cells:
                        row = [cell.text.strip() for cell in cells]

                        # Only add rows that have actual data (not just empty or header text)
                        if len(row) > 1 and any(cell for cell in row):
                            rows.append(row)

            # Create DataFrame
            if rows:
                # Handle column count mismatch
                if headers_list:
                    max_cols = max(len(row) for row in rows)

                    # Ensure headers match data columns
                    if len(headers_list) < max_cols:
                        headers_list.extend([f'col_{j}' for j in range(len(headers_list), max_cols)])
                    elif len(headers_list) > max_cols:
                        headers_list = headers_list[:max_cols]

                    # Ensure all rows have same number of columns
                    normalized_rows = []
                    for row in rows:
                        if len(row) < max_cols:
                            row.extend([''] * (max_cols - len(row)))
                        elif len(row) > max_cols:
                            row = row[:max_cols]
                        normalized_rows.append(row)

                    df = pd.DataFrame(normalized_rows, columns=headers_list)
                else:
                    df = pd.DataFrame(rows)

                # Remove duplicate rows (sometimes caused by repeated headers)
                df = df.drop_duplicates()

                # Remove rows where the first column matches a header (leftover header rows)
                if not df.empty and len(df.columns) > 0:
                    first_col = df.columns[0]
                    df = df[df[first_col] != first_col]

                # Create clean filename
                filename_base = caption_text.lower()
                cleaned_filename_part = filename_base.replace(' ', '_').replace('&', 'and').replace('/', '_')
                cleaned_filename_part = cleaned_filename_part.replace('table', '').replace('__', '_').strip('_')
                filename = f'{team_code}_{year}_{cleaned_filename_part}.csv'
                full_path = os.path.join(OUTPUT_DIR, filename)

                # Save to CSV
                df.to_csv(full_path, index=False)

                # Store in dictionary
                all_tables[caption_text] = df

                print(f"  ✓ Saved: {full_path}")
                print(f"  ✓ Shape: {df.shape} (rows × columns)")
                print(f"  ✓ First few columns: {list(df.columns[:5])}")
            else:
                print(f"  ✗ No data rows found")

        print("\n" + "=" * 70)
        print(f"✓ Successfully scraped and saved {len(all_tables)} tables")
        print(f"✓ Total data rows extracted: {sum(len(df) for df in all_tables.values())}")

        return all_tables

    except OSError as e:
        # Handles errors during folder creation
        print(f"✗ Error creating directory {OUTPUT_DIR}: {e}")
        driver.quit()  # Crucial: Close the browser on failure
        return None

    except Exception as e:
        print(f"\n✗ Error occurred: {e}")
        import traceback
        traceback.print_exc()
        return None

    finally:
        driver.quit()
        print("\n✓ Browser closed")


if __name__ == '__main__':
    # Scrape team data 2025 season
    team_data = scrape_nfl_stats('sfo', 2025)

    # Optional: Print summary of each table
    if team_data:
        print("\n" + "=" * 70)
        print("SUMMARY OF SCRAPED TABLES:")
        print("=" * 70)
        for table_name, df in team_data.items():
            print(f"\n{table_name}:")
            print(f"  Shape: {df.shape}")
            print(f"  Columns: {list(df.columns)}")
            print(f"  Sample data:")
            print(df.head(3).to_string(index=False))