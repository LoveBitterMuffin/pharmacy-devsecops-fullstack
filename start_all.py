import subprocess
import sys
import time
import os
import signal

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(root_dir, "backend")
    frontend_dir = os.path.join(root_dir, "frontend")

    print("=" * 60)
    print("   Pharmacy Management System (DevSecOps Full-Stack)")
    print("   Author: Dmitry Volkov (@LoveBitterMuffin)")
    print("=" * 60)
    print("\n[1/2] Запуск Backend API (FastAPI + SQLite + Uvicorn)...")

    venv_python = os.path.join(backend_dir, ".venv", "Scripts", "python.exe")
    python_cmd = venv_python if os.path.exists(venv_python) else sys.executable

    backend_proc = subprocess.Popen(
        [python_cmd, "run.py"],
        cwd=backend_dir,
        shell=False
    )

    print("[2/2] Запуск Frontend (Vite + React)...")
    npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
    frontend_proc = subprocess.Popen(
        [npm_cmd, "run", "dev"],
        cwd=frontend_dir,
        shell=False
    )

    time.sleep(2)
    print("\n" + "-" * 60)
    print("✅ СЕРВЕРЫ УСПЕШНО ЗАПУЩЕНЫ:")
    print("   🌐 Frontend (React UI): http://localhost:5173")
    print("   📡 Backend REST API:    http://127.0.0.1:8000")
    print("   📖 Swagger UI (Docs):   http://127.0.0.1:8000/docs")
    print("   📑 ReDoc:               http://127.0.0.1:8000/redoc")
    print("-" * 60)
    print("Для завершения работы нажмите Ctrl+C в этом окне.\n")

    try:
        while True:
            time.sleep(1)
            if backend_proc.poll() is not None:
                print("❌ Процесс бэкенда завершился неожиданно.")
                break
            if frontend_proc.poll() is not None:
                print("❌ Процесс фронтенда завершился неожиданно.")
                break
    except KeyboardInterrupt:
        print("\nОстановка серверов...")
    finally:
        for p in (backend_proc, frontend_proc):
            if p and p.poll() is None:
                p.terminate()
                try:
                    p.wait(timeout=3)
                except subprocess.TimeoutExpired:
                    p.kill()
        print("Все серверы остановлены.")

if __name__ == "__main__":
    main()
