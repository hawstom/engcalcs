# EngCalcs — Migration to Windows / WSL2

## Step 1 — Push current work (run on the source machine)

```bash
git push origin master
```

The branch is currently 6 commits ahead of `origin/master` on GitHub
(`git@github.com:hawstom/engcalcs.git`). Push before leaving the source machine.

---

## Step 2 — Install WSL2 on Windows

Open PowerShell as Administrator:

```powershell
wsl --install
```

This installs WSL2 with Ubuntu. Reboot when prompted, then launch **Ubuntu** from the
Start menu and complete the initial user setup (username + password).

---

## Step 3 — Install Apache and PHP inside WSL2

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y apache2 php8.3 libapache2-mod-php8.3 php8.3-mbstring php8.3-xml php8.3-json
sudo a2enmod rewrite
sudo systemctl enable apache2
sudo systemctl start apache2
```

Verify PHP version:

```bash
php --version   # should show 8.3.x
```

---

## Step 4 — Set up SSH key for GitHub

Generate a key (skip if you already have one you'll copy over):

```bash
ssh-keygen -t ed25519 -C "tom.haws@gmail.com"
cat ~/.ssh/id_ed25519.pub
```

Add that public key to your GitHub account:
**GitHub → Settings → SSH and GPG keys → New SSH key**

Test the connection:

```bash
ssh -T git@github.com
```

---

## Step 5 — Create the directory structure and clone

```bash
sudo mkdir -p /var/www/cnm/public_html/hawsedc
sudo chown -R $USER:$USER /var/www/cnm
git clone git@github.com:hawstom/engcalcs.git /var/www/cnm/public_html/hawsedc/engcalcs
```

---

## Step 6 — Restore the pre-commit PHP lint hook

The hook lives in `.git/hooks/` and is not tracked by git, so recreate it:

```bash
cat > /var/www/cnm/public_html/hawsedc/engcalcs/.git/hooks/pre-commit << 'EOF'
#!/bin/sh
# Lint all staged PHP files before committing.
errors=0
for file in $(git diff --cached --name-only --diff-filter=ACM | grep '\.php$'); do
    php -l "$file"
    if [ $? -ne 0 ]; then
        errors=$((errors + 1))
    fi
done
if [ $errors -gt 0 ]; then
    echo "PHP syntax errors found. Commit aborted."
    exit 1
fi
exit 0
EOF
chmod +x /var/www/cnm/public_html/hawsedc/engcalcs/.git/hooks/pre-commit
```

---

## Step 7 — Configure Apache virtual host

Create `/etc/apache2/sites-available/hawsedc.conf`:

```bash
sudo tee /etc/apache2/sites-available/hawsedc.conf > /dev/null << 'EOF'
<VirtualHost *:80>
    ServerName hawsedc.local
    DocumentRoot /var/www/cnm/public_html/hawsedc
    <Directory /var/www/cnm/public_html/hawsedc>
        AllowOverride All
        Require all granted
    </Directory>
    SetEnv APP_ENV development
    ErrorLog ${APACHE_LOG_DIR}/hawsedc-error.log
    CustomLog ${APACHE_LOG_DIR}/hawsedc-access.log combined
</VirtualHost>
EOF

sudo a2ensite hawsedc.conf
sudo systemctl reload apache2
```

---

## Step 8 — Add a hosts entry (Windows side)

Open Notepad **as Administrator**, edit `C:\Windows\System32\drivers\etc\hosts`, and add:

```
127.0.0.1   hawsedc.local
```

---

## Step 9 — Verify

1. In WSL2: `sudo systemctl status apache2` — should be active/running.
2. In a Windows browser: `http://hawsedc.local/engcalcs/` — calculator index should load.
3. The HTML source should include validator links (DEBUG_MODE is on via `APP_ENV=development`).

---

## Claude Code setup

```bash
# Install Node.js (required by Claude Code)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs

# Install Claude Code
npm install -g @anthropic-ai/claude-code
```

---

## Step 10 — Migrate Claude Code memory and permissions (run on the source machine first)

Claude Code keeps two pieces of state that are not in the git repo:

**A) Project memory** — roadmap status, user profile, past decisions. Without it the agent
starts cold and won't know the project history.

On the source machine, create a tarball:

```bash
tar czf ~/engcalcs-claude-memory.tar.gz \
  -C ~/.claude/projects \
  -var-www-cnm-public-html-hawsedc-engcalcs/memory
```

Transfer it to the WSL2 machine (USB, network share, email to yourself, etc.), then
on the WSL2 machine:

```bash
mkdir -p ~/.claude/projects/-var-www-cnm-public-html-hawsedc-engcalcs/memory
tar xzf ~/engcalcs-claude-memory.tar.gz -C ~/.claude/projects
```

**B) Permission allowances** — the `.claude/settings.local.json` file in the repo directory
records which commands Claude Code can run without prompting. Without it you'll get a
permission prompt for nearly every tool call in the first few sessions.

On the source machine:

```bash
tar czf ~/engcalcs-claude-settings.tar.gz \
  -C /var/www/cnm/public_html/hawsedc/engcalcs \
  .claude/settings.local.json
```

On the WSL2 machine (after cloning the repo in Step 5):

```bash
tar xzf ~/engcalcs-claude-settings.tar.gz \
  -C /var/www/cnm/public_html/hawsedc/engcalcs
```

Then start Claude Code from the project directory:

```bash
cd /var/www/cnm/public_html/hawsedc/engcalcs
claude
```

---

## Notes

- **No database, no Composer** — the project is pure PHP + JS, no build step required.
- The `APP_ENV=development` set in the vhost enables debug/validator links. Remove or
  change to `production` if you ever serve this publicly from WSL2.
