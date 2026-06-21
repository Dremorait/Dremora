import urllib.request, json, urllib.error
req = urllib.request.Request(
    'https://dremora.onrender.com/api/contact', 
    data=json.dumps({'name':'test','email':'test@test.com','message':'test'}).encode('utf-8'), 
    headers={'Content-Type': 'application/json'}
)
try:
    res = urllib.request.urlopen(req)
    print(res.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print(e.read().decode('utf-8'))
