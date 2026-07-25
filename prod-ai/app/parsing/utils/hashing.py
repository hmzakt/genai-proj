from pathlib import Path
import hashlib


def sha256_file(file: Path) -> str:

    sha = hashlib.sha256()
    with open(file, "rb") as f:

        while chunk := f.read(8192):
            sha.update(chunk)

    return sha.hexdigest()