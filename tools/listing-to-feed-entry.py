#!/usr/bin/env python3
"""Convert a listing request JSON into a validate-directory.py-ready hubs.json entry.

Listing requests (type/contact/software/version) are for review only.
The public feed uses a different shape — no contact email.

Usage:
  python tools/listing-to-feed-entry.py < listing-request.json
  python tools/listing-to-feed-entry.py path/to/listing-request.json
"""
from __future__ import annotations

import json
import sys
from pathlib import Path


def build_feed_entry(request: dict) -> dict:
    if request.get("type") != "signalforge-directory-listing-request":
        raise SystemExit("input must be type signalforge-directory-listing-request")
    hub_id = str(request.get("hubId", "")).strip()
    if not hub_id.startswith("hub_"):
        raise SystemExit("hubId must start with hub_")
    return {
        "hubId": hub_id,
        "name": str(request.get("name", "")).strip(),
        "publicUrl": str(request.get("publicUrl", "")).strip().rstrip("/"),
        "region": str(request.get("region", "")).strip(),
        "publicKey": str(request.get("publicKey", "")).strip(),
        "directoryStatus": "listed",
        "trustLevel": "listed",
        "trustIssuerHubId": "signalforge-directory",
        "trustCertificate": "",
        "trustExpiresAt": 0,
        "trustVerifiedAt": 0,
        "lastSeenAt": 0,
    }


def main() -> None:
    if len(sys.argv) > 1:
        raw = Path(sys.argv[1]).read_text(encoding="utf-8")
    else:
        raw = sys.stdin.read()
    request = json.loads(raw)
    entry = build_feed_entry(request)
    print(json.dumps(entry, indent=2))
    print(
        "\n# Paste into directory/hubs.json → hubs[]",
        "# Bump top-level updatedAt to current unix time.",
        "# Do not add contact — it is not part of the public feed schema.",
        sep="\n",
        file=sys.stderr,
    )


if __name__ == "__main__":
    main()
