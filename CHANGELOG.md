# Changelog

## 0.2.3

- This is a bogus release only to test if package publishing still works

## 0.2.2

- Fix broken `AuthPersonalCredentials` import

## 0.2.1

- Document and export `AuthRequiredError` class.

## 0.2.0

- Add a `Client#getHosts` method for obtaining a list of hosts matching specified `mode` and `public` criteria
- Create `Host`, `GetHostsQueryParams`, `GetHostsPayload` interfaces
- Rename `AuthSuccessBody` interface to `AuthPayload`
- Change `Client#authPersonal` method, so that it takes a single `AuthPersonalCredentials` object argument, instead of three separate `email`, `password` and `tfa` strings

## 0.1.3

- Fix accidentally publishing a codeless package via Github Actions workflow

## 0.1.2

- Install and configure Typedoc for automatic online documentation generation

## 0.1.1

- Rename `connect` method to `authPersonal`

## 0.1.0

- Initial `Client` class implementation. It only consists of `peerID`, `sessionID` and `status` fields, as well as a `connect` method.
