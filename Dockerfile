FROM python:3.9
WORKDIR /Projekt-Pis
ADD . /Projekt-Pis 
RUN pip install flask
#ADD index.html index.html
ADD server.py .
EXPOSE 8000
ENTRYPOINT ["python3", "server.py"]
