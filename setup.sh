# Setup file to upload data to MongoDB 
mongo qkart --eval "db.dropDatabase()" 
mongoimport -d qkart -c users --file data/export_qkart_users.json
mongoimport -d qkart -c products --file data/export_qkart_products.json