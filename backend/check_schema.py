from dotenv import load_dotenv
import os
import pymysql

# Load environment from parent directory
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(parent_dir, '.env'))

HOST = os.getenv('DB_HOST')
PORT = int(os.getenv('DB_PORT'))
USER = os.getenv('DB_USER')
PASSWORD = os.getenv('DB_PASSWORD')
DB_NAME = os.getenv('DB_NAME')

print(f"Connecting to {HOST}:{PORT} as {USER}...")

conn = pymysql.connect(host=HOST, port=PORT, user=USER, password=PASSWORD, database=DB_NAME)
cursor = conn.cursor()

print("\n=== CLUBS TABLE STRUCTURE ===")
cursor.execute('DESCRIBE clubs')
for row in cursor.fetchall():
    print(row)

print("\n=== EVENTS TABLE STRUCTURE ===")
cursor.execute('DESCRIBE events')
for row in cursor.fetchall():
    print(row)

print("\n=== EXISTING TABLES ===")
cursor.execute('SHOW TABLES')
for row in cursor.fetchall():
    print(row[0])

cursor.close()
conn.close()
