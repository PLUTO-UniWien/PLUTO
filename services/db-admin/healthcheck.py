import http.client

def check_health():
    conn = http.client.HTTPConnection("localhost", 80, timeout=10)
    try:
        conn.request("GET", "/")
        response = conn.getresponse()
        return response.status == 200 or response.status == 302
    except Exception as e:
        print(f"Failed to connect: {e}")
        return False
    finally:
        conn.close()

if __name__ == "__main__":
    if check_health():
        print("Healthcheck passed")
        exit(0)
    else:
        print("Healthcheck failed")
        exit(1)
