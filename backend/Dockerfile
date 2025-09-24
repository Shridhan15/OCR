# Use official Python image
FROM python:3.13-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Install system dependencies (including tesseract)
RUN apt-get update && \
    apt-get install -y tesseract-ocr libtesseract-dev && \
    rm -rf /var/lib/apt/lists/*

# Set workdir
WORKDIR /app

# Copy requirements first (for caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Expose the port Flask runs on
EXPOSE 5000

# Run the app using Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
