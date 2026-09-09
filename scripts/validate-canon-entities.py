#!/usr/bin/env python3
"""
validate-canon-entities.py — Verify canon-entities.ts matches the frozen canon.

Checks that the entity values in sigarena/lib/canon-entities.ts exact-match
the sigeconomy deployment profile and the frozen master-canon-v1.0.0 source.

Usage:
    python3 scripts/validate-canon-entities.py

Exits 0 if all values match, 1 if any mismatch is found.
"""

import re
import sys
import os
from pathlib import Path

# ─── Paths ──────────────────────────────────────────────────────────────────

SIGARENA_ROOT = Path(__file__).resolve().parent.parent
CANON_ENTITIES_TS = SIGARENA_ROOT / "lib" / "canon-entities.ts"

MOSES_INTEGRATION_ROOT = Path(os.environ.get(
    "MOSES_INTEGRATION_PATH",
    str(Path.home() / "Developer" / "_control" / "moses-integration"),
))
SIGECONOMY_PROFILE = MOSES_INTEGRATION_ROOT / "integrations" / "profiles" / "sigeconomy.yaml"

SEARCH_AUTHORITY_ROOT = Path(os.environ.get(
    "SEARCH_AUTHORITY_PATH",
    str(Path.home() / "Developer" / "_control" / "search-authority"),
))

# ─── Expected values from frozen canon (master-canon-v1.0.0) ────────────────
# These are the canonical entity values that canon-entities.ts must match.
# Sourced from: git show master-canon-v1.0.0:canon/shared/entities.yaml

EXPECTED_ENTITIES = {
    "ello_cello_llc": {
        "name": "Ello Cello LLC",
        "description": (
            "Organization associated with the owner's published works and products, "
            "including SigRank and MO\u00A7ES\u2122."
        ),
        "authorityApprovalRef": "APPROVAL-2026-08-14-001 (ID-ELLO-001)",
    },
    "sigrank": {
        "name": "SigRank",
        "description": (
            "An AI operator benchmark measuring token cascade efficiency. SigRank "
            "evaluates AI operators, not AI models. Built on the Conservation Law "
            "of Commitment. Produces the SigRank Index. Live at signalaf.com with "
            "a CLI tool."
        ),
        "authorityApprovalRef": "APPROVAL-2026-08-14-002 (ID-SR-001)",
    },
    "deric_j_mchenry": {
        "name": "Deric J. McHenry",
        "description": (
            "Author of Commitment Theory, the Conservation Law of Commitment, and "
            "the SigRank operator evaluation system. ORCID 0009-0002-9904-5390."
        ),
        "authorityApprovalRef": "APPROVAL-2026-08-14-001 (ID-DERIC-001)",
    },
    "moses": {
        "name": "MO\u00A7ES\u2122",
        "description": (
            "Sovereign signal governance system. MO\u00A7ES\u2122 is the enforcement "
            "architecture for Commitment Theory and operationalizes the Conservation "
            "Law of Commitment. Governs Signomy and CIVITAE. Patent 63/877,177 "
            "covers the enforcement architecture. Patent 19/426,028 covers the "
            "CIVITAS utility surface."
        ),
        "authorityApprovalRef": "APPROVAL-2026-08-14-001 (ID-MOSES-001)",
    },
}

# ─── Helpers ─────────────────────────────────────────────────────────────────

def read_ts_file(path):
    """Read canon-entities.ts and extract entity values."""
    content = path.read_text(encoding="utf-8")
    return content


def extract_field(content, var_name, field_name):
    """Extract a field value from a TypeScript const object."""
    # Find the const block
    pattern = rf'export const {var_name}\s*=\s*\{{(.*?)\}}\s*as\s*const'
    match = re.search(pattern, content, re.DOTALL)
    if not match:
        return None
    block = match.group(1)
    
    # Find the field — handle string concatenation
    field_pattern = rf'{field_name}:\s*(".*?"(?:\s*\+\s*".*?")*),'
    field_match = re.search(field_pattern, block, re.DOTALL)
    if not field_match:
        return None
    
    # Join concatenated strings
    raw = field_match.group(0)
    strings = re.findall(r'"((?:[^"\\]|\\.)*)"', raw)
    value = "".join(s for s in strings)
    
    # Unescape unicode escapes
    value = value.encode().decode("unicode_escape")
    return value


def check_file_exists(path, label):
    if not path.exists():
        print(f"  MISSING: {label} at {path}")
        return False
    print(f"  FOUND: {label} at {path}")
    return True


# ─── Main ────────────────────────────────────────────────────────────────────

def main():
    print("=" * 70)
    print("Canon Entities Validation")
    print("=" * 70)
    
    all_ok = True
    
    # Check files exist
    print("\n--- File checks ---")
    all_ok &= check_file_exists(CANON_ENTITIES_TS, "canon-entities.ts")
    all_ok &= check_file_exists(SIGECONOMY_PROFILE, "sigeconomy.yaml profile")
    
    if not all_ok:
        print("\nFAIL: Required files missing.")
        sys.exit(1)
    
    # Read and validate canon-entities.ts
    print("\n--- Entity validation (canon-entities.ts vs frozen canon) ---")
    ts_content = read_ts_file(CANON_ENTITIES_TS)
    
    ts_var_map = {
        "ello_cello_llc": "elloCelloLLC",
        "sigrank": "sigrank",
        "deric_j_mchenry": "dericMcHenry",
        "moses": "moses",
    }
    
    for entity_id, expected in EXPECTED_ENTITIES.items():
        ts_var = ts_var_map[entity_id]
        print(f"\n  {entity_id} (ts: {ts_var}):")
        
        name = extract_field(ts_content, ts_var, "name")
        desc = extract_field(ts_content, ts_var, "description")
        ref = extract_field(ts_content, ts_var, "authorityApprovalRef")
        
        name_ok = name == expected["name"]
        desc_ok = desc == expected["description"]
        ref_ok = ref == expected["authorityApprovalRef"]
        
        if name_ok:
            print(f"    name: MATCH ('{name}')")
        else:
            all_ok = False
            print(f"    name: MISMATCH")
            print(f"      expected: '{expected['name']}'")
            print(f"      got:      '{name}'")
        
        if desc_ok:
            print(f"    description: MATCH")
        else:
            all_ok = False
            print(f"    description: MISMATCH")
            print(f"      expected: '{expected['description'][:80]}...'")
            print(f"      got:      '{(desc or 'None')[:80]}...'")
        
        if ref_ok:
            print(f"    authorityApprovalRef: MATCH ('{ref}')")
        else:
            all_ok = False
            print(f"    authorityApprovalRef: MISMATCH")
            print(f"      expected: '{expected['authorityApprovalRef']}'")
            print(f"      got:      '{ref}'")
    
    # Check provenance header
    print("\n--- Provenance header check ---")
    if "sigeconomy.yaml" in ts_content:
        print("  Profile reference: FOUND")
    else:
        all_ok = False
        print("  Profile reference: MISSING (header should reference sigeconomy.yaml)")
    
    if "master-canon-v1.0.0" in ts_content:
        print("  Frozen ref: FOUND")
    else:
        all_ok = False
        print("  Frozen ref: MISSING (header should reference master-canon-v1.0.0)")
    
    # Result
    print("\n" + "=" * 70)
    if all_ok:
        print("RESULT: ALL ENTITIES MATCH FROZEN CANON")
        sys.exit(0)
    else:
        print("RESULT: MISMATCHES FOUND — see above")
        sys.exit(1)


if __name__ == "__main__":
    main()
