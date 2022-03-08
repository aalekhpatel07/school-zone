#### Python Version
Python 3.9

#### Usage

```sh
./venv/bin/python -m gunicorn main:app --workers 2 -k uvicorn.workers.UvicornWorker --error-logfile ./error_log.txt
```
