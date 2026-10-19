# Contributing to Home Project Ledger

Thanks for your interest in improving Home Project Ledger! Bug reports, translations, documentation fixes and code are all welcome.

## Reporting bugs and requesting features

- Search [existing issues](https://github.com/FredrikElliot/home-project-ledger/issues) first.
- For bugs, use the **Bug report** template and include your Home Assistant version, the integration version and relevant logs.
- To get debug logs, add this to `configuration.yaml` and restart:

  ```yaml
  logger:
    default: warning
    logs:
      custom_components.home_project_ledger: debug
  ```

## Proposing changes

1. **Open an issue first** for anything larger than a small fix, so we can agree on the approach before you spend time on it.
2. Fork the repository and create a branch from `main`.
3. Make your changes. Architecture, data models, services and how to add features are described in [DEVELOPER.md](https://github.com/FredrikElliot/home-project-ledger/blob/main/DEVELOPER.md).
4. Test your changes in a real Home Assistant instance (see "Testing" below).
5. Add a line to the top of [CHANGELOG.md](https://github.com/FredrikElliot/home-project-ledger/blob/main/CHANGELOG.md) describing the change.
6. Open a pull request against `main` and describe what changed and why.

## Pull request checklist

- [ ] The **CI**, **HACS Validation** and **Hassfest Validation** checks pass
- [ ] New or changed text is translated in both English and Swedish: setup and service text in `strings.json`, `translations/en.json` and `translations/sv.json`; panel text in the `TRANSLATIONS` object in `frontend/panel.js`
- [ ] New services are documented in `services.yaml`
- [ ] Existing stored data still loads (no breaking changes to `.storage` without a migration)
- [ ] CHANGELOG.md is updated

## Testing

There is no automated test suite yet, so please verify manually:

1. Create a project and add receipts with different category splits
2. Check that the sensors update
3. Click through the panel views you touched, in both light and dark theme
4. If you changed text, check both English and Swedish

## Code style

- Follow Home Assistant's [development guidelines](https://developers.home-assistant.io/docs/development_guidelines)
- Use type hints and docstrings
- Keep functions focused and small
- Use async APIs; never block the event loop

## Translations

Text lives in two places:

- **Setup and services**: `custom_components/home_project_ledger/translations/<language>.json` (with `strings.json` as the English source)
- **The sidebar panel**: the `TRANSLATIONS` object at the top of `custom_components/home_project_ledger/frontend/panel.js`

To add a language, add a translations file and a matching block in `TRANSLATIONS`, then make sure the panel picks the new language code (it currently chooses between `en` and `sv`). The sidebar title is set in `__init__.py`. If that's more than you want to take on, open an issue with your translations and we'll wire them up.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](https://github.com/FredrikElliot/home-project-ledger/blob/main/LICENSE).