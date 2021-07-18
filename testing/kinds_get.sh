source .env

curl  http://localhost:8080/api/kinds \
  -H "Authorization: Bearer ${AUTH_TOKEN}"