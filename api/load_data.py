import json
import os
from pymongo import MongoClient, UpdateOne
from concurrent.futures import ThreadPoolExecutor, as_completed

# MongoDB connection settings
MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = "zomatoData"
COLLECTION_NAME = "restaurants"

# Base directory
BASE_DIR = r"C:\Users\Aksha\Downloads\Typeface\api"

# List of JSON files to process
JSON_FILES = [
    os.path.join(BASE_DIR, "archive", f"file{i}.json") for i in range(1, 6)
]

def connect_to_mongodb():
    """Establish a connection to MongoDB."""
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    collection = db[COLLECTION_NAME]
    return client, collection

def load_json_file(file_path):
    """Load and parse a JSON file."""
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)

def extract_restaurants(data):
    """Extract restaurant objects from the JSON data."""
    if isinstance(data, list):
        for item in data:
            if 'restaurants' in item:
                for restaurant_data in item['restaurants']:
                    if 'restaurant' in restaurant_data:
                        yield restaurant_data['restaurant']
    elif isinstance(data, dict):
        if 'restaurants' in data:
            for restaurant_data in data['restaurants']:
                if 'restaurant' in restaurant_data:
                    yield restaurant_data['restaurant']

def insert_unique_data(collection, data):
    """Insert unique restaurant data into MongoDB collection."""
    restaurants = list(extract_restaurants(data))
    if restaurants:
        operations = []
        for restaurant in restaurants:
            if 'R' in restaurant and 'res_id' in restaurant['R']:
                res_id = restaurant['R']['res_id']
                operations.append(
                    UpdateOne(
                        {'R.res_id': res_id},
                        {'$set': restaurant},
                        upsert=True
                    )
                )
        if operations:
            result = collection.bulk_write(operations)
            print(f"Inserted {result.upserted_count} new restaurants, "
                  f"updated {result.modified_count} existing restaurants")
    else:
        print("No restaurant data found in the file.")

def process_file(file_path, collection):
    """Process a single JSON file and insert its data into MongoDB."""
    try:
        data = load_json_file(file_path)
        insert_unique_data(collection, data)
        print(f"Successfully processed {file_path}")
    except Exception as e:
        print(f"Error processing {file_path}: {str(e)}")

def main():
    client, collection = connect_to_mongodb()
    
    try:
        # Create an index on R.res_id for faster upserts
        collection.create_index('R.res_id', unique=True)
        
        with ThreadPoolExecutor() as executor:
            futures = [executor.submit(process_file, file, collection) for file in JSON_FILES]
            
            for future in as_completed(futures):
                future.result()  # This will raise an exception if the task failed
        
        print("All files have been processed and unique restaurant data has been imported to MongoDB.")
    
    except Exception as e:
        print(f"An error occurred: {str(e)}")
    
    finally:
        client.close()

if __name__ == "__main__":
    main()