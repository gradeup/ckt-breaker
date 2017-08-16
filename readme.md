# ckt-breaker [![Build Status](https://travis-ci.org/gradeup/ckt-breaker.svg?branch=master)](https://travis-ci.org/gradeup/ckt-breaker) [![Coverage Status](https://coveralls.io/repos/github/gradeup/ckt-breaker/badge.svg?branch=master)](https://coveralls.io/github/gradeup/ckt-breaker?branch=master)

> Tiny circuit breaker implementation. Wrapped service must return Promise.

## Requirements
-  node v6+
-  npm 3+
## Install

```
$ npm install --save ckt-breaker
```


## Usage

```js
const cktBreaker = require('ckt-breaker');
// Function that hits some service 
const fn = () => Promise.reject('I got nothing');

const ckt = cktBreaker(fn, {
	retry: 10000, // time in ms after which to retry hitting fn
	timeout: 1000, // time in ms to timeout if fn takes longer than that
	maxError: 10, // Max no of errors
	maxTime: 1000, // time in ms in which maxError occurs
	fallback: () => Promise.reject(new Error('Service Currently unavailable')),
});

ckt.fire('hello world').catch(err => console.log(err)) // Safe doesn't overload the remote service
```

If you are using this for one off scripts (eg. console apps), use `process.exit(0)` to exit the app.

## API

### cktBreaker(fn, {options})

#### fn

Type: `function`

A promise returning function 

#### options

##### retry

Type: `integer`<br>
Default: `10000`

Time in ms after which to retry hitting fn

##### timeout

Type: `integer`<br>
Default: `0`

Time in ms to timeout fn if fn takes longer than that.
By default this is disabled (0). 

##### maxError

Type: `integer`<br>
Default: `10`

No of errors in `maxTime` time to occur before breaking the circuit

##### maxTime

Type: `integer`<br>
Default: `1000`

Time Frame to consider maxError no of error to break the circuit

##### fallback

Type: `function`<br>
Default: ```() => Promise.reject(new Error('Service Currently unavailable')```

Fallback function to call when circuit is broken

### Methods

#### fire

``` 
const ckt = cktBreaker(fn); 
ckt.fire([1,2,3]) // Any args taken by fn;
```
Function that runs wrapped fn and passes over arguments given to it

### Events

#### open

Fired when circuit is opened

#### closed

Fired when circuit is closed

## License

MIT © [Nikhil Srivastava](http://niksrc.github.io)
