source .env

curl  http://localhost:8080/api/hooks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${AUTH_TOKEN}" \
  --data "{\"kind_id\": 2}"