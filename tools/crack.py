#!/usr/bin/env python3
"""Find which of the 4096 possible HyperSecure keys you were given.

Usage: python3 tools/crack.py <key>
       python3 tools/crack.py --list      # print every 256-bit hex key
"""
import base64
import hashlib
import sys

SALT = "HyperSecure/QHMLED/v3"
SLOTS = 4096


def block(slot, n):
    return hashlib.sha256(f"{SALT}:{slot}:{n}".encode()).digest()


def grouped(data):
    s = base64.b32encode(data).decode().rstrip("=")
    return "-".join(s[i:i + 5] for i in range(0, len(s), 5))


def all_keys():
    for slot in range(SLOTS):
        b0, b1 = block(slot, 0), block(slot, 1)
        for bits, data in ((128, b0[:16]), (256, b0), (512, b0 + b1)):
            for fmt, enc in (("hex", bytes.hex),
                             ("base64", lambda d: base64.b64encode(d).decode()),
                             ("grouped", grouped)):
                yield slot, bits, fmt, enc(data)


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    if sys.argv[1] == "--list":
        for slot in range(SLOTS):
            print(f"{slot:04d}  {block(slot, 0).hex()}")
        return
    target = sys.argv[1].strip()
    for slot, bits, fmt, key in all_keys():
        if key in (target, target.lower(), target.upper()):
            print(f"CRACKED: key #{slot} of {SLOTS} ({bits}-bit, {fmt})")
            return
    print("Not a HyperSecure key.")
    sys.exit(1)


if __name__ == "__main__":
    main()
