# Repository Setup Guide

This guide is for repository maintainers to ensure the project is properly configured for HACS (Home Assistant Community Store) integration.

## Required GitHub Topics

For HACS validation to pass, the repository **must** have the following GitHub topics configured:

- `home-assistant`
- `hacs`
- `integration`

## How to Set Topics

### Option 1: Automatic Setup (Recommended)

1. Go to the **Actions** tab in the GitHub repository
2. Select the **Setup Repository Topics** workflow from the left sidebar
3. Click **Run workflow** and select the `main` branch
4. Click the green **Run workflow** button
5. Wait for the workflow to complete (it should take less than a minute)
6. Verify that the topics have been added by checking the repository's main page

> **Note:** The workflow requires appropriate permissions to modify repository settings. If it fails due to permissions, use Option 2.

### Option 2: Manual Setup

1. Navigate to the repository's main page on GitHub
2. Look for the **About** section in the right sidebar (below the repository description)
3. Click the **gear icon (⚙️)** next to "About"
4. In the "Topics" field, add the following topics (separated by spaces or commas):
   - `home-assistant`
   - `hacs`
   - `integration`
5. Click **Save changes**

## Verifying Topics

After setting the topics, you can verify they are configured correctly:

### Via GitHub Web Interface
- Check the repository's main page - topics should appear below the description

### Via GitHub CLI
```bash
gh api repos/FredrikElliot/home-project-ledger --jq '.topics'
```

### Via HACS Validation
- Go to the **Actions** tab
- Run the **Validate** workflow
- Check the "Check repository topics" job output
- Verify the "HACS validation" job passes

## Troubleshooting

### HACS Validation Still Fails

If HACS validation continues to fail after adding the topics:

1. **Verify topics are visible:** Check the repository main page to confirm topics are displayed
2. **Wait a few minutes:** GitHub's API may take a moment to propagate the changes
3. **Re-run the validation:** Manually trigger the Validate workflow from the Actions tab
4. **Check for other issues:** Review the HACS validation output for other potential problems

### Workflow Permission Errors

If the "Setup Repository Topics" workflow fails with permission errors:

- Use the manual setup method (Option 2) instead
- Ensure you have admin access to the repository
- Check that GitHub Actions has the required permissions in the repository settings

## Additional Resources

- [HACS Documentation](https://hacs.xyz/)
- [HACS Integration Publishing Guide](https://hacs.xyz/docs/publish/integration/)
- [GitHub Topics Documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics)
