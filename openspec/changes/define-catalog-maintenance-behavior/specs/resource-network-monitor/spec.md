## ADDED Requirements

### Requirement: Network monitor distinguishes general and endpoint-specific connectivity
The app SHALL provide a lightweight network monitor that distinguishes general network
inaccessibility from unavailability of a specific remote endpoint, and makes both states
available to the rest of the application. This monitor SHALL be shared across catalog
metadata/cache, downloaded content, cover image cache, and avatar image cache requests.

#### Scenario: General network is unavailable
- **WHEN** the device has no network connectivity at all
- **THEN** the network monitor reports general network unavailability

#### Scenario: General network is available but a specific endpoint is unreachable
- **WHEN** the device has network connectivity but a specific remote endpoint cannot be
  reached
- **THEN** the network monitor reports that endpoint as unreachable while still reporting
  general network connectivity as available

### Requirement: Endpoint-specific processes query the monitor before requesting
A process that requires access to a specific remote endpoint SHALL query the network
monitor for that endpoint's reachability before making a request to it, and SHALL stop
rather than make the request if the monitor reports the endpoint unreachable.

#### Scenario: Endpoint is reachable
- **WHEN** a process queries the network monitor about a specific endpoint before making a
  request and the monitor reports that endpoint as reachable
- **THEN** the process proceeds with the request

#### Scenario: Endpoint is unreachable
- **WHEN** a process queries the network monitor about a specific endpoint before making a
  request and the monitor reports that endpoint as unreachable
- **THEN** the process does not make the request

### Requirement: General-connectivity processes query the monitor before requesting
A process that requires general network access SHALL query the network monitor for general
connectivity state before proceeding, and SHALL stop rather than proceed if the monitor
reports general network unavailability.

#### Scenario: General network is available
- **WHEN** a process queries the network monitor for general connectivity and the monitor
  reports the network as available
- **THEN** the process proceeds

#### Scenario: General network is unavailable
- **WHEN** a process queries the network monitor for general connectivity and the monitor
  reports the network as unavailable
- **THEN** the process stops rather than proceeding

### Requirement: Network monitor may push connectivity-change notifications
The network monitor MAY notify interested processes of network-state changes as they occur,
in addition to answering direct queries.

#### Scenario: Network state changes while a process is registered for notifications
- **WHEN** general or endpoint-specific connectivity state changes and a process has
  registered to receive network monitor notifications
- **THEN** the network monitor notifies that process of the state change
