## 1. Startup sequencing

- [ ] 1.1 Load local catalog data (if present) before any auth restore or network call
- [ ] 1.2 Restore auth info from the keychain and authenticate with the API
- [ ] 1.3 Route to the login flow when no keychain auth info is found
- [ ] 1.4 Branch startup into signed-in and signed-out paths based on auth restore result

## 2. Shared refresh-scheduling policy

- [ ] 2.1 Implement a shared last-check-timestamp lookup keyed per resource (catalog, avatar)
- [ ] 2.2 Implement the staleness comparison against a per-resource threshold
- [ ] 2.3 Trigger a refresh when the timestamp is missing or the threshold has elapsed
- [ ] 2.4 Persist the updated timestamp only after the refresh check completes, never on abort

## 3. Catalog refresh integration

- [ ] 3.1 Wire catalog load/refresh trigger through the shared refresh-scheduling policy
- [ ] 3.2 Verify catalog refresh does not block first paint of cached data

## 4. Gravatar avatar refresh integration

- [ ] 4.1 Load the locally cached avatar image on startup
- [ ] 4.2 Wire avatar refresh trigger through the shared refresh-scheduling policy

## 5. Signed-out browsing behavior

- [ ] 5.1 Show a placeholder avatar image when signed out
- [ ] 5.2 Keep catalog and collections visible and browsable when signed out
- [ ] 5.3 Disable drag-and-drop actions on catalog/collections when signed out
- [ ] 5.4 Disable add/remove actions on collections when signed out

## 6. Verification

- [ ] 6.1 Add tests covering missing-timestamp, fresh, and stale refresh-check scenarios
- [ ] 6.2 Add tests covering aborted/failed refresh checks leaving the timestamp unchanged
- [ ] 6.3 Manually verify signed-out browsing (placeholder avatar, disabled mutation actions)
