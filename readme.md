# ckt-breaker [![Build Status](https://travis-ci.org/niksrc/ckt-breaker.svg?branch=master)](https://travis-ci.org/niksrc/ckt-breaker) [![Coverage Status](https://coveralls.io/repos/github/niksrc/ckt-breaker/badge.svg?branch=master)](https://coveralls.io/github/niksrc/ckt-breaker?branch=master)

> Tiny circuit breaker implementation in js


## Install

```
$ npm install --save ckt-breaker
```


## Usage

```js
const cktBreaker = require('ckt-breaker');

cktBreaker('unicorns');
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
