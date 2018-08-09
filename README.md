# data-providers-examples

An example of Data Provider for FranceConnect.

## Install

Run the following commands:

```bash
git clone git@github.com:france-connect/data-providers-examples.git
cd data-providers-examples
npm install
```

You can then start the server with:

```bash
npm start
```

Note that when calling the application this will initiate call to the fcp.integ01.dev-franceconnect.fr remote server.
You can use a local mocked franceconnect server instead by running:

```bash
LOCAL_LOOP=true npm start
```

## Run the tests

Run the tests with:
```bash
npm test
```
