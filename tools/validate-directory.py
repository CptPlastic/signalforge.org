#!/usr/bin/env python3
import json
import ipaddress
import sys
from pathlib import Path
from urllib.parse import urlparse

VALID_STATUSES = {"unlisted", "listed", "verified", "suspended"}
VALID_TRUST_LEVELS = {"community", "listed", "verified", "trusted", "official", "suspended"}
REQUIRED_ENTRY_FIELDS = {
    "hubId",
    "name",
    "publicUrl",
    "region",
    "publicKey",
    "directoryStatus",
    "trustLevel",
    "trustIssuerHubId",
    "trustCertificate",
    "trustExpiresAt",
    "trustVerifiedAt",
    "lastSeenAt",
}


def fail(message: str) -> None:
    print(f"directory validation failed: {message}", file=sys.stderr)
    sys.exit(1)


def require_int(value, field: str) -> None:
    if not isinstance(value, int) or isinstance(value, bool):
        fail(f"{field} must be an integer")


def validate_public_url(value: str, hub_id: str) -> None:
    parsed = urlparse(value)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        fail(f"{hub_id} publicUrl must be http or https")
    if parsed.username or parsed.password:
        fail(f"{hub_id} publicUrl must not include credentials")
    host = parsed.hostname or ""
    if host.lower() == "localhost":
        fail(f"{hub_id} publicUrl must not use localhost")
    try:
        ip = ipaddress.ip_address(host)
    except ValueError:
        return
    if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_multicast or ip.is_unspecified:
        fail(f"{hub_id} publicUrl must not use a private or local IP")


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    feed_path = root / "directory" / "hubs.json"
    feed = json.loads(feed_path.read_text(encoding="utf-8"))

    require_int(feed.get("version"), "version")
    require_int(feed.get("updatedAt"), "updatedAt")
    if not isinstance(feed.get("issuer"), str) or not feed["issuer"].strip():
        fail("issuer must be a non-empty string")
    if set(feed.get("statuses", [])) != VALID_STATUSES:
        fail("statuses must match the supported directory statuses")
    if set(feed.get("trustLevels", [])) != VALID_TRUST_LEVELS:
        fail("trustLevels must match the supported trust levels")
    if not isinstance(feed.get("hubs"), list):
        fail("hubs must be an array")

    seen_hub_ids = set()
    for index, entry in enumerate(feed["hubs"]):
        if not isinstance(entry, dict):
            fail(f"hubs[{index}] must be an object")
        missing = REQUIRED_ENTRY_FIELDS - set(entry)
        if missing:
            fail(f"hubs[{index}] missing fields: {', '.join(sorted(missing))}")
        hub_id = str(entry["hubId"]).strip()
        if not hub_id.startswith("hub_"):
            fail(f"hubs[{index}] hubId must start with hub_")
        if hub_id in seen_hub_ids:
            fail(f"duplicate hubId: {hub_id}")
        seen_hub_ids.add(hub_id)
        if entry["directoryStatus"] not in VALID_STATUSES:
            fail(f"{hub_id} has invalid directoryStatus")
        if entry["trustLevel"] not in VALID_TRUST_LEVELS:
            fail(f"{hub_id} has invalid trustLevel")
        public_key = str(entry["publicKey"]).strip()
        if public_key and not public_key.startswith("ed25519:"):
            fail(f"{hub_id} publicKey must be empty or ed25519-prefixed")
        validate_public_url(str(entry["publicUrl"]).strip(), hub_id)
        for field in ("trustExpiresAt", "trustVerifiedAt", "lastSeenAt"):
            require_int(entry.get(field), f"{hub_id}.{field}")

    print(f"directory feed ok: {len(feed['hubs'])} hub(s)")


if __name__ == "__main__":
    main()