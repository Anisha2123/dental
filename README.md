# dental4ai
Application Server Code with Angular Code for Dental4Ai Project

Deployment Steps 

1. run pm2 stop all to stop the server
2. Take a backup of /app-docker/dental4ai 
3. Copy the contents to /app-docker/dental4ai by first copying it to /home/ec2-user/temp and then moving them to /app-docker/dental4ai 
4. Copy the uploads folder from recent backup to /app-docker/dental4ai 
5. Copy the .env file from /app-docker/dental4ai(Backup) to /app-docker/dental4ai 
6. Run npm install when required
7. Run ng build to create a build inside www folder of backend
8. Restart the server using pm2 start all
