import hashlib
import json
from datetime import datetime
from typing import List, Dict, Any

class LocalLedger:
    def __init__(self):
        self.chain: List[Dict[str, Any]] = []
        self._initialize_chain()

    def _initialize_chain(self):
        if not self.chain:
            genesis_block = self._create_block(
                data={"message": "Genesis Block"},
                previous_hash="0" * 64
            )
            self.chain.append(genesis_block)

    def _create_block(self, data: Dict[str, Any], previous_hash: str) -> Dict[str, Any]:
        block = {
            "timestamp": datetime.now().isoformat(),
            "data": data,
            "previous_hash": previous_hash,
            "nonce": 0
        }
        block["hash"] = self._calculate_hash(block)
        return block

    def _calculate_hash(self, block: Dict[str, Any]) -> str:
        block_string = json.dumps({k: v for k, v in block.items() if k != "hash"}, sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()

    def append_entry(self, data: Dict[str, Any]) -> Dict[str, Any]:
        previous_block = self.chain[-1]
        new_block = self._create_block(data, previous_block["hash"])
        self.chain.append(new_block)
        return new_block

    def verify_integrity(self) -> bool:
        for i in range(1, len(self.chain)):
            current = self.chain[i]
            previous = self.chain[i-1]
            if current["previous_hash"] != previous["hash"]:
                return False
            if current["hash"] != self._calculate_hash(current):
                return False
        return True
