from typing import Dict, Any
from pymongo.collection import Collection

# Global dictionary to hold collection instances (real or mock)
_collections: Dict[str, Any] = {}

def get_collection(name: str) -> Collection:
    if name not in _collections:
        # Return a dummy if accessed before init, though repositories 
        # should ideally only call this after startup.
        raise RuntimeError(f"Database collections not initialized. Cannot fetch '{name}'")
    return _collections[name]

def set_collection(name: str, instance: Any):
    _collections[name] = instance
