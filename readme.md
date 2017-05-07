# ckt-breaker [![Build Status](https://travis-ci.org/niksrc/ckt-breaker.svg?branch=master)](https://travis-ci.org/niksrc/ckt-breaker) [![Coverage Status](https://coveralls.io/repos/github/niksrc/ckt-breaker/badge.svg?branch=master)](https://coveralls.io/github/niksrc/ckt-breaker?branch=master)

> Tiny circuit breaker implementation in js


## Install

```
$ npm install --save ckt-breaker
```


## Usage

```js
const cktBreaker = require('ckt-breaker');

cktBreaker(fn, {
	retry: 10000, // time in ms after which to retry hitting fn
	timeout: 1000, // time in ms to timeout if fn takes longer than that
	maxError: 10, // Max no of errors
	maxTime: 1000, // time in ms in which maxError occurs
	fallback: () => Promise.reject(new Error('Service Currently unavailable')),
});
//=> 'unicorns & rainbows'
```


## API

### cktBreaker(input, [options])

#### input

Type: `string`

Lorem ipsum.

#### options

##### foo

Type: `boolean`<br>
Default: `false`

Lorem ipsum.


## License

MIT © [Nikhil Srivastava](http://niksrc.github.io)
