from typing import Dict, Any
import time

class LocalCache:
    def __init__(self):
        self.cache: Dict[str, Dict[str, Any]] = {}

    def set(self, key: str, value: Any, ttl: int = 300):  # ttl = seconds
        self.cache[key] = {
            "value": value,
            "expiry": time.time() + ttl
        }

    def get(self, key: str):
        entry = self.cache.get(key)
        if entry:
            if time.time() < entry["expiry"]:
                return entry["value"]
            else:
                self.cache.pop(key, None)  # expired
        return None

    def invalidate(self, key: str):
        self.cache.pop(key, None)
