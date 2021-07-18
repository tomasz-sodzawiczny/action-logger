source .env

curl  http://localhost:8080/api/hooks \
  -H "Authorization: Bearer ${AUTH_TOKEN}"