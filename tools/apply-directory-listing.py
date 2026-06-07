#!/usr/bin/env python3
"""Apply a directory feed entry to directory/hubs.json (idempotent).

Used by the directory-listing-approve GitHub Action after an issue is labeled
directory-approved. Extracts the feed entry JSON block from the issue body, or
accepts a feed entry file directly.

Usage:
  python tools/apply-directory-listing.py --issue-body issue.md
  python tools/apply-directory-listing.py --entry feed-entry.json
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FEED_PATH = ROOT / "directory" / "hubs.json"
FEED_MARKER = "### Paste into `directory/hubs.json`"

REQUIRED_FEED_FIELDS = {
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
    print(f"apply-directory-listing failed: {message}", file=sys.stderr)
    sys.exit(1)


def extract_json_block_after_marker(text: str) -> dict:
    idx = text.find(FEED_MARKER)
    if idx < 0:
        fail(f"issue body missing section: {FEED_MARKER}")
    tail = text[idx:]
    match = re.search(r"```json\s*(\{.*?\})\s*```", tail, re.DOTALL)
    if not match:
        fail("could not find feed entry ```json block after paste section")
    try:
        return json.loads(match.group(1))
    except json.JSONDecodeError as exc:
        fail(f"invalid feed entry JSON: {exc}")


def listing_request_to_feed_entry(request: dict) -> dict:
    if request.get("type") != "signalforge-directory-listing-request":
        fail("listing request block has unexpected shape")
    return {
        "hubId": str(request["hubId"]).strip(),
        "name": str(request["name"]).strip(),
        "publicUrl": str(request["publicUrl"]).strip().rstrip("/"),
        "region": str(request["region"]).strip(),
        "publicKey": str(request["publicKey"]).strip(),
        "directoryStatus": "listed",
        "trustLevel": "listed",
        "trustIssuerHubId": "signalforge-directory",
        "trustCertificate": "",
        "trustExpiresAt": 0,
        "trustVerifiedAt": 0,
        "lastSeenAt": 0,
    }


def load_listing_request_fallback(text: str) -> dict:
    """Old issues: convert listing request if feed block is missing."""
    match = re.search(
        r"### Listing request JSON.*?```json\s*(\{.*?\})\s*```",
        text,
        re.DOTALL,
    )
    if not match:
        fail("no feed entry block and no listing request block found")
    return listing_request_to_feed_entry(json.loads(match.group(1)))


def normalize_entry(entry: dict) -> dict:
    if entry.get("type") == "signalforge-directory-listing-request":
        fail("refusing to apply listing request JSON — use feed entry shape")
    if "contact" in entry:
        fail("feed entry must not include contact email")
    missing = REQUIRED_FEED_FIELDS - set(entry)
    if missing:
        fail(f"feed entry missing fields: {', '.join(sorted(missing))}")
    hub_id = str(entry["hubId"]).strip()
    if not hub_id.startswith("hub_"):
        fail("hubId must start with hub_")
    normalized = {key: entry[key] for key in REQUIRED_FEED_FIELDS}
    normalized["publicUrl"] = str(normalized["publicUrl"]).strip().rstrip("/")
    for field in ("trustExpiresAt", "trustVerifiedAt", "lastSeenAt"):
        value = normalized[field]
        if not isinstance(value, int) or isinstance(value, bool):
            fail(f"{field} must be an integer")
    return normalized


def apply_entry(entry: dict) -> tuple[str, bool]:
    feed = json.loads(FEED_PATH.read_text(encoding="utf-8"))
    hubs = feed.get("hubs")
    if not isinstance(hubs, list):
        fail("hubs.json hubs must be an array")

    hub_id = entry["hubId"]
    replaced = False
    for index, existing in enumerate(hubs):
        if isinstance(existing, dict) and existing.get("hubId") == hub_id:
            hubs[index] = entry
            replaced = True
            break
    if not replaced:
        hubs.append(entry)

    feed["updatedAt"] = int(time.time())
    FEED_PATH.write_text(json.dumps(feed, indent=2) + "\n", encoding="utf-8")
    action = "updated" if replaced else "added"
    return action, replaced


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--issue-body", type=Path, help="GitHub issue body markdown file")
    parser.add_argument("--entry", type=Path, help="Feed entry JSON file")
    parser.add_argument("--meta", type=Path, help="Write hubId and name JSON for CI")
    args = parser.parse_args()

    if args.entry:
        entry = json.loads(args.entry.read_text(encoding="utf-8"))
    elif args.issue_body:
        text = args.issue_body.read_text(encoding="utf-8")
        if FEED_MARKER in text:
            entry = extract_json_block_after_marker(text)
        else:
            entry = load_listing_request_fallback(text)
    else:
        fail("pass --issue-body or --entry")

    normalized = normalize_entry(entry)
    action, _ = apply_entry(normalized)
    print(f"{action} hub {normalized['hubId']} ({normalized['name']}) in directory/hubs.json")
    print(f"updatedAt={json.loads(FEED_PATH.read_text(encoding='utf-8'))['updatedAt']}")
    if args.meta:
        args.meta.write_text(
            json.dumps({"hubId": normalized["hubId"], "name": normalized["name"]}) + "\n",
            encoding="utf-8",
        )


if __name__ == "__main__":
    main()
