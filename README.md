# signalforge.org

VOICE IN THE STORM

SignalForge is the public community surface for hub operators, releases, docs, and SignalHub federation.

See [SOURCE.md](SOURCE.md) for the public hub source policy and build paths. The public hub source lives at <https://github.com/CptPlastic/signalforge-node>.

## SignalForge Directory

The static directory feed lives at <https://signalforge.org/directory/hubs.json>. Hub operators can point `HUB_DIRECTORY_URL` at this feed and use the admin console's directory refresh action to update local directory and trust status.

Directory status answers whether a hub is present and verified by the directory. Trust level answers how much SignalForge vouches for the hub.

- `community`: default local trust; not reviewed by the directory.
- `listed`: known public hub with basic details checked.
- `verified`: operator control and public URL have been checked.
- `trusted`: known stable operator with useful community signal sources.
- `official`: projectseven or SignalForge-operated infrastructure.
- `suspended`: listed before, but currently not recommended for trust or discovery.
