FROM python:3.11-slim

# Install core dependencies needed for building the project
RUN apt-get update && \
    apt-get install -y build-essential openssl libssl-dev curl

WORKDIR /app

# Install Poetry
RUN python -m pip install --upgrade pip &&  \
    pip install poetry

COPY . .
RUN poetry config virtualenvs.create false && \
    poetry install


EXPOSE 8501
HEALTHCHECK CMD curl --fail http://localhost:8501/_stcore/health
ENTRYPOINT ["streamlit", "run", "survey_analysis/app/home.py", "--server.port=8501", "--server.address=0.0.0.0", "--server.headless=True", "--server.enableCORS=false"]
