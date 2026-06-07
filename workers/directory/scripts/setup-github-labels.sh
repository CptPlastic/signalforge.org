#!/usr/bin/env bash
# Creates directory listing labels on CptPlastic/signalforge.org
set -euo pipefail

REPO="${GITHUB_REPO:-CptPlastic/signalforge.org}"

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI is required. Install: https://cli.github.com/"
  exit 1
fi

create_label() {
  local name="$1"
  local color="$2"
  local description="$3"
  if gh label list --repo "$REPO" --limit 200 | awk '{print $1}' | grep -qx "$name"; then
    echo "label exists: $name"
  else
    gh label create "$name" --repo "$REPO" --color "$color" --description "$description"
    echo "created: $name"
  fi
}

create_label "directory-request" "FBCA04" "Hub directory listing submitted via register form"
create_label "directory-approved" "0E8A16" "Listing approved; hub added to directory/hubs.json"
create_label "directory-rejected" "D93F0B" "Directory listing declined"

echo "Done. Labels ready on $REPO"
