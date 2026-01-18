import logging
from logging.handlers import RotatingFileHandler
from pathlib import Path


def setup_logging(log_level: str = "INFO"):
    log_dir = Path(__file__).resolve().parent
    handler = RotatingFileHandler(log_dir / "app.log", maxBytes=5_000_000, backupCount=2)
    formatter = logging.Formatter(
        "%(asctime)s - %(levelname)s - %(name)s - %(message)s"
    )
    handler.setFormatter(formatter)

    root = logging.getLogger()
    if not root.handlers:
        root.setLevel(getattr(logging, log_level.upper(), logging.INFO))
        root.addHandler(handler)

    # also ensure console output during development
    console = logging.StreamHandler()
    console.setFormatter(formatter)
    root.addHandler(console)
