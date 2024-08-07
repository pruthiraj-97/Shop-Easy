FROM ubuntu

RUN apt-get update
RUN apt-get install -y python3
RUN apt-get install -y python3-pip
RUN apt-get install -y curl
RUN pip3 install --upgrade pip

RUN npm install
COPY . .
EXPOSE 4000
ENTRYPOINT [ "node","index.js" ]