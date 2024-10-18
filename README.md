# AIRAY

A simple Flask-based web app that can detect if an image is AI-generated or if a text is written by AI. Uses OpenAI’s CLIP model for image analysis and a RoBERTa-based model for text analysis.

![demo](./frontend/images/demo.gif)

## Running the App

### Option 1: Run with Docker

1. Requirements:

Download and install Docker from the [Docker website](https://www.docker.com/products/docker-desktop).

2.	Clone the repository:

```bash
git clone https://github.com/rbourgeat/airay.git
cd airay
```

3.	Build and run the containers:

```bash
docker compose up --build
```

4.	The app will be available at [localhost:5042](http://localhost:5042).

### Option 2: Run Natively

1. Requirements:

Download and install Python from the [Python website](https://www.python.org/downloads/).

Download and install Node.js from the [Node.js website](https://nodejs.org/).

2.	Install backend dependencies and start the server:

```bash
git clone https://github.com/rbourgeat/airay.git
cd airay
cd backend
python3 -m pip install -r requirements.txt
python3 main.py
```

3.	Install frontend dependencies and start the server:

```bash
cd ..
cd frontend
npm install
npm run dev
```

4.	The app will be available at [localhost:5042](http://localhost:5042).

## Contributing

If you have suggestions for improving this project or find a bug, feel free to open an issue. Your feedback and contributions are greatly appreciated !
