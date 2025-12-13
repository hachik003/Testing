# PBL4Testing

1. Setting up virtual environment
   
After cloning the repo, create a virtual environment (python -m venv .venv -> source .venv/bin/activate) at the root directory of your project files.
Then, run the command "pip install -r requirements.txt".


2. Configure files manually
   
Manually create a file name .env at the root directory of your project files and paste the following and receive the empty contents personally: 

DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
SECRET_KEY=

Within frontend-nextjs, create a file name .env.local and input the following: 

NEXT_PUBLIC_API_URL=http://127.0.0.1:5000/api


3. Running the website locally

Within the virtual environment, set the current directory to backend and run the following line: 

flask --app app run

In a different terminal, set the current directory to frontend-nextjs and run the following line. This file should not be ran inside a virtual environment:

npm run dev 

If the React files do not run, run the following line first and try again: 

npm install
