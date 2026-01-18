from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.donor_routes import donor_router
from routes.hospital_routes import hospital_router
from routes.request_routes import request_router
from routes.auth_routes import auth_router
from routes.admin_routes import admin_router
from routes.notification_routes import notification_router
from routes.analysis_routes import analysis_router
import database
from utils.logger import setup_logging
import logging
from core.config import settings
from core.error_handlers import AppError, app_exception_handler, generic_exception_handler

app = FastAPI(title=settings.PROJECT_NAME)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(donor_router, prefix="/api/donors", tags=["donor"])
app.include_router(hospital_router, prefix="/api/hospitals", tags=["hospital"])
app.include_router(request_router, prefix="/api/requests", tags=["request"])
app.include_router(admin_router, prefix="/api/admin", tags=["admin"])
app.include_router(notification_router, prefix="/api/notifications", tags=["notifications"])
app.include_router(analysis_router, prefix="/api/analysis", tags=["analysis"])

# Exception Handlers
app.add_exception_handler(AppError, app_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

@app.on_event("startup")
def startup_event():
    # initialize logging and DB indexes
    setup_logging()
    logging.getLogger(__name__).info("Starting application, initializing DB indexes...")
    database.init_db()

@app.get("/")
def root():
    return {"status": "Backend is running successfully", "service": settings.PROJECT_NAME}

@app.get("/api/health")
def health():
    return {"status": "ok"}
