import sys
import os

# Add backend to path
sys.path.append(os.getcwd())

from models.donor_schema import Donor
print("Loading Donor from models.donor_schema")
print("Fields:", Donor.__fields__.keys())

try:
    from models.donor import Donor as OldDonor
    print("WARNING: models.donor still exists and was imported!")
    print("Old Fields:", OldDonor.__fields__.keys())
except ImportError:
    print("Success: models.donor does not exist or import failed.")
