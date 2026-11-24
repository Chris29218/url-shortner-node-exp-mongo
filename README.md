A Fully Secured URL Shortner App which supports multi-device login.
app url - hosting inactive due to some price related issues.

## Environment setup

Copy `.env.example` to `.env` and set a strong, random `JWT_SECRET`.

Generate a suitable secret with Node.js:

```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

Your `.env` file should contain:

```text
JWT_SECRET=your-generated-secret
PORT=8000
```

Never commit `.env` or share the JWT secret.
