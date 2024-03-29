# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.7.0]

### Added

- validators for field of new param name

## [0.6.0]

### Added

- autoheight in textarea in ActionForm
- plugin state API
- ability to edit custom actions
- ability to use `await` operator in custom actions
- hiding of panel title from component settings
- displaying of subscription name
- hiding of system subscriptions from list

### Changed

- the design of the panel
- was downgrade versions of vuelidate libs
- textarea size for correct content editing

### Removed

- unnecessary component BtnBack
- "^" in package.json for some packages

## [0.5.0]

### Removed

- `EventSystem` plugin instance registration
- getting and output plugins name

### Fixed

- versions 'vue' and 'vue-template-compiler', added '@vue/composition-api'

## [0.4.0]

### Added

- checking subscription and action forms
- LogSystem

### Changed

- chosen visible values of BaseSelect
- closing forms

### Fixed

- getting plugin name

## [0.3.0]

### Changed

- changed svg icons to font icons

## [0.2.0]

### Added

- version of core systems for adapters
- selection argument of event

### Changed

- build process in order to make directory name with current version of plugin
- ui and ux of the panel

### Removed

- insertion of css-variables

## [0.1.0]

### Added

- main functional
