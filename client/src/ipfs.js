// utilities for interacting with Pinata
// **WARNING**: storing keys in frontend is insecure; this example uses the
// JWT you provided for demonstration only.

const PINATA_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmOGUwYjc2Yi0zZDRhLTRjZjQtOGQ5ZC1iYWI2MjJlYzk1NWMiLCJlbWFpbCI6IjIzMTIwMzRAbmVjLmVkdS5pbiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJhOGE5M2E4MWVhZjI0ZjJlN2YxMSIsInNjb3BlZEtleVNlY3JldCI6IjMwMzY0NjcxNDU5NGZiMDA1MmYyZWJlZmVmNTVhMWIzYjUwMmNlNjkwZmExZmNjNGI4NTQ1MjYzOGRjNDcwOTUiLCJleHAiOjE4MDQ2MDQ0MzB9.JRxx4-6BsAPaDrvJ0hQz2-ATHEtR9ZuK4HHgOi0n4KI';

const BASE = 'https://api.pinata.cloud';

export async function pinJSON(json) {
  const resp = await fetch(`${BASE}/pinning/pinJSONToIPFS`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(json),
  });
  if (!resp.ok) throw new Error('pinJSON failed ' + resp.statusText);
  return resp.json();
}

export async function pinFile(file) {
  const form = new FormData();
  form.append('file', file);
  const resp = await fetch(`${BASE}/pinning/pinFileToIPFS`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
      // 'pinata_api_key': '...', // not needed when using JWT
    },
    body: form,
  });
  if (!resp.ok) throw new Error('pinFile failed ' + resp.statusText);
  return resp.json();
}
