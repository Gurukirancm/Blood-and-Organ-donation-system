import urllib.request, json, os

def get(url):
    with urllib.request.urlopen(url, timeout=5) as r:
        return json.load(r)

if __name__ == '__main__':
    base = 'http://127.0.0.1:8000'
    try:
        print('health ->', get(base + '/api/health'))
    except Exception as e:
        print('health error:', e)
    try:
        print('donors ->', get(base + '/api/donors/'))
    except Exception as e:
        print('donors error:', e)
