FROM dpage/pgadmin4:latest

WORKDIR /pgadmin4

COPY healthcheck.py .

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=5 \
    CMD python /pgadmin4/healthcheck.py
