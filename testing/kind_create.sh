source .env

curl  http://localhost:8080/api/kinds \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${AUTH_TOKEN}" \
  --data "{\"name\": \"test\"}"