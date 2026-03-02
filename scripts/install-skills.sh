#!/bin/bash

# Install Agent Skills from webdev-agent-skills repository
# Usage: ./scripts/install-skills.sh "skill1,skill2" [target-dir]
# Example: ./scripts/install-skills.sh "css-tokens,frontend-security"
#          ./scripts/install-skills.sh "css-tokens" ".ai/skills"

set -e

SKILLS="${1}"
INSTALL_DIR="${2:-.claude/skills}"
REPO_URL="https://github.com/schalkneethling/webdev-agent-skills/archive/refs/heads/main.zip"
TMP_FILE="/tmp/webdev-skills-$$.zip"

# Validate input
if [ -z "$SKILLS" ]; then
  echo "Usage: $0 \"skill1,skill2\" [target-dir]"
  echo "Example: $0 \"css-tokens,frontend-security\""
  echo ""
  echo "Available skills:"
  echo "  - component-scaffolding"
  echo "  - component-usage-analysis"
  echo "  - css-coder"
  echo "  - css-tokens"
  echo "  - frontend-security"
  echo "  - frontend-testing"
  echo "  - semantic-html"
  exit 1
fi

echo "📥 Downloading skills from GitHub..."
curl -sL "$REPO_URL" -o "$TMP_FILE"

echo "📦 Installing to $INSTALL_DIR..."
for skill in $(echo "$SKILLS" | tr ',' ' '); do
  skill=$(echo "$skill" | xargs)  # trim whitespace
  mkdir -p "$INSTALL_DIR/$skill"
  unzip -q -j "$TMP_FILE" "webdev-agent-skills-main/$skill/*" -d "$INSTALL_DIR/$skill/"
  echo "✓ Installed: $skill"
done

rm "$TMP_FILE"
echo "✨ Done!"
