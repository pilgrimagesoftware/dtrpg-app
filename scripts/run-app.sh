#!/bin/bash

set -x
set -e

RUST_LOG=debug RUST_BACKTRACE=1 cargo run -p dtrpg-core
