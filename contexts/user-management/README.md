# User management (bounded context)

Separate from **core-admin**: identity, sign-in, and **account** concerns (profile, preferences, team membership when modeled here).

## Subcontexts

| Folder | Scope |
|--------|--------|
| **`auth/`** | Session, credentials, sign-in/out, password reset, tokens — protocol and security boundaries. |
| **`user/`** | Profile, settings, preferences, non–core-admin account model. |

Presentation today: `ui/user-management/views/` (login, forgot/reset password). Domain modules can appear under each subcontext as you add real backends.
