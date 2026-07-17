#!/bin/bash

set -x
set -e

open "$HOME/Library/Application Support/com.pilgrimagesoftware.dtrpg"
zed -n "$HOME/Library/Application Support/com.pilgrimagesoftware.dtrpg"
open "$HOME/Library/Caches/com.pilgrimagesoftware.dtrpg"
zed -n "$HOME/Library/Caches/com.pilgrimagesoftware.dtrpg"
open "$HOME/Library/Preferences/com.pilgrimagesoftware.dtrpg"
zed -n "$HOME/Library/Preferences/com.pilgrimagesoftware.dtrpg"
open "$HOME/Downloads/dtrpg"
zed -n "$HOME/Downloads/dtrpg"
