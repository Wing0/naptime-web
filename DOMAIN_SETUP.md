# Domain & Hosting Setup Guide

## 1. GitHub Configuration
The code has been pushed to your repository. Now, enable GitHub Pages:

1.  Go to **[Settings > Pages](https://github.com/Wing0/naptime-web/settings/pages)**.
2.  Under **Build and deployment**:
    *   **Source**: Select `Deploy from a branch`.
    *   **Branch**: Select `main` and `/ (root)`.
    *   Click **Save**.
3.  Under **Custom domain**:
    *   You should see `naptime.info` already filled in (because I added the `CNAME` file).
    *   If not, type `naptime.info` and click **Save**.
    *   Check **Enforce HTTPS** (this might take a few minutes to become available).

## 2. DNS Configuration (Registrar)
You need to point your domain `naptime.info` to GitHub's servers. Log in to your domain registrar (e.g., Namecheap, GoDaddy, Google Domains) and add the following records:

### A Records (for root domain `naptime.info`)
Create **4** separate A records pointing to GitHub's IP addresses:
*   `185.199.108.153`
*   `185.199.109.153`
*   `185.199.110.153`
*   `185.199.111.153`

### CNAME Record (for `www.naptime.info`)
*   **Type**: `CNAME`
*   **Host/Name**: `www`
*   **Value/Target**: `wing0.github.io` (Do **not** use the repository name here, just your username + github.io).

## 3. Verification
*   Wait anywhere from 5 minutes to 24 hours for DNS propagation.
*   Visit [https://naptime.info](https://naptime.info).
