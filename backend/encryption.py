import os
from cryptography.fernet import Fernet
import logging

logger = logging.getLogger(__name__)

FERNET_KEY = os.getenv("FERNET_KEY")

if not FERNET_KEY:
    # Generate a temporary key if none provided (for development ONLY)
    logger.warning("No FERNET_KEY found. Generating a temporary key for development.")
    FERNET_KEY = Fernet.generate_key().decode()

def encrypt_file(file_path: str):
    """Encrypts a file in place using Fernet."""
    try:
        f = Fernet(FERNET_KEY.encode())
        with open(file_path, "rb") as file:
            file_data = file.read()
        
        encrypted_data = f.encrypt(file_data)
        
        with open(file_path, "wb") as file:
            file.write(encrypted_data)
            
        logger.info(f"Successfully encrypted {file_path}")
        return True
    except Exception as e:
        logger.error(f"Encryption failed for {file_path}: {e}")
        return False
