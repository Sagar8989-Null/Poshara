# OCR Installation Guide
## 1. Open directory 
First, create a virtual environment named `ENV`.

    cd Poshara/backend/OCR/model_name
    python -m venv ENV
    
## 2. actiavte the ENV
    .\ENV\Scripts\actiavte
## 3. install all dependencies using requirements.txt
Note:- requirements.txt should look like modelname_ENV_requirements.txt

    pip install -r modelname_ENV_requirements.txt
## 4. Run your File ( This is our BackEnd server File)
    py file_name.py
## 5. Now start your frontend server
Ensure that OCR Component is not commented out 

<img width="479" height="332" alt="image" src="https://github.com/user-attachments/assets/60718160-2deb-4664-b831-1741bea7f216" />

    cd Poshara/frontend
    npm i
    npm run dev 
# Map
Ensure that Map component is not commented out

<img width="490" height="318" alt="image" src="https://github.com/user-attachments/assets/b98961d6-65bd-4567-9920-9ac10135cdac" />

Run the server.js (this is our backend server)

    cd Poshara/frontend/GPS
    npm i 
    node server.js
    
Run the following command to actually view the Map component
(which is our frontend server)

    cd Poshara/frontend
    npm i
    npm run dev


<img width="523" height="420" alt="Screenshot 2025-10-26 130535" src="https://github.com/user-attachments/assets/ccec7ccf-1c9b-4e3b-9894-7aa771e04a96" />

  
