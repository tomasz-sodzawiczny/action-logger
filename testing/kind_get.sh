source .env

curl  http://localhost:8080/api/kinds/2 \
  -H "Authorization: Bearer ${AUTH_TOKEN}"