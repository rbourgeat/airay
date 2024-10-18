# AIRAY

A simple Flask-based web app that can detect if an image is AI-generated or if a text is written by AI. Uses OpenAI’s CLIP model for image analysis and a RoBERTa-based model for text analysis.

![demo](./frontend/images/demo.gif)

## Running the App

### Option 1: Run with Docker

1.	Clone the repository:

```bash
git clone https://github.com/rbourgeat/airay.git
cd airay
```

2.	Build and run the containers:

```bash
docker compose up --build
```

3.	The app will be available at [localhost:5042](http://localhost:5042).

### Option 2: Run Natively

1.	Install backend dependencies and start the server:

```bash
git clone https://github.com/rbourgeat/airay.git
cd airay/backend
python3 -m pip install -r requirements.txt
python3 main.py
```

2.	Install frontend dependencies and start the server:

```bash
npm i
npm run dev
```

3.	The app will be available at [localhost:5042](http://localhost:5042).

## Contributing

If you have suggestions for improving this project or find a bug, feel free to open an issue. Your feedback and contributions are greatly appreciated !
