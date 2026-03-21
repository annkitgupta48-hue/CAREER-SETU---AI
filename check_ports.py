import socket

def check_port(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

if __name__ == "__main__":
    with open("port_check.txt", "w") as f:
        f.write(f"Port 3000 (Frontend): {'OPEN' if check_port(3000) else 'CLOSED'}\n")
        f.write(f"Port 8000 (Backend): {'OPEN' if check_port(8000) else 'CLOSED'}\n")
