source .env

curl  http://localhost:8080/api/actions \
  -H "Authorization: Bearer ${AUTH_TOKEN}"