# #!/bin/sh

# # Wait for MySQL to be ready
# while ! mysqladmin ping -h"db" --silent; do
#     sleep 1
# done

# # Initialize tables
# node -e 'require("./services/database/ReadingAlphaDB").createTables()'

# # Start your Next.js app
# npm run start



#!/bin/sh

echo "Starting entrypoint script."

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
while ! mysqladmin ping -h"db" --silent; do
    sleep 1
done

# Initialize/Update tables
echo "Initializing/Updating tables..."
node -e 'require("./services/database/ReadingAlphaDB").createTables()'

# Start your Next.js app
echo "Starting Next.js app..."
npm run start
