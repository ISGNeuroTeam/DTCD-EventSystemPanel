# DTCD-EventSystemPanel

Panel for EventSystem settings

## Getting Started

## How to use

### Field object properties

### Prerequisites

- [node.js](https://nodejs.org/en/) LTS version 14.x.x
- [DTCD](https://github.com/ISGNeuroTeam/DTCD) v0.5.0
- `make` utility

### Building

```
make build
```

## Running the tests

```
make test
```

## Create build package

```
make pack
```

## Clear dependencies

```
make clean
```

## Deployment

Use `make pack` to get a deployable tarball. Move it to plugins directory and unarchive it with the following commands:

```
tar -zxf DTCD-EventSystemPanel-*.tar.gz ./DTCD-DTCD-EventSystemPanel
```

## Built With

- [DTCD-SDK](https://github.com/ISGNeuroTeam/DTCD-SDK) v0.1.2
- [Rollup.js](https://rollupjs.org/guide/en/) - JavaScript project builder

## Contributing

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/ISGNeuroTeam/DTCD-EventSystemPanel/tags).

Also you can see the [CHANGELOG](CHANGELOG.md) file.

## Authors

- Konstantin Rozov (konstantin@isgneuro.com)

## License

This project is licensed under the OT.PLATFORM license agreement - see the [LICENSE](LICENSE.md) file for details

## Acknowledgments
