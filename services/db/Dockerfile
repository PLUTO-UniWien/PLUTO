FROM postgres:15.3

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=5 \
    CMD pg_isready -U $POSTGRES_USER -d $POSTGRES_DB || exit 1
