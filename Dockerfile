#Stage 1: Compile and Build angular codebase

#use official node image as the base image
FROM  node:alpine as build

# Set the working directory
WORKDIR C:/survey-online/SurveyDataUI/ArounU/src/app
# Add the source code to app
COPY ./ C:/survey-online/SurveyDataUI/AroundU/src/app
# Install all the dependencies
RUN npm Install
#Generate the build of the application
RUN npm run build
#output


#Stage 2:Setve app with nginx server
#Use Official nginx image as the base image
FROM nginx:latest
#Copy the build output to replace the default nginx contents
COPY --from=build /local/app/dist/around-u  /share/nginx/html
#Expose Port 80
EXPOSE 80