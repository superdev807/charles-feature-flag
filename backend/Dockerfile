FROM python:3
# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
WORKDIR /service
EXPOSE 8000
COPY managed/requirements.txt ./service/managed/requirements.txt
COPY local/requirements.txt ./service/local/requirements.txt
RUN pip install --no-cache-dir -r ./service/managed/requirements.txt
RUN pip install --no-cache-dir -r ./service/local/requirements.txt
COPY . ./service/
