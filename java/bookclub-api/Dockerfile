# ---- build stage ----
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app

COPY . .

# Build do jar
RUN chmod +x ./gradlew \
  && ./gradlew clean bootJar -x test

# ---- runtime stage ----
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the jar to the production image
COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]