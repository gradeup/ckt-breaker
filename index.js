const { EventEmitter } = require('events');
const { inherits } = require('util');

inherits(CircuitBreaker, EventEmitter);

function CircuitBreaker(command, opts = {}) {
	if (!command) {
		throw new Error('First argument of CircuitBreaker must be a function');
	}

	if (!(this instanceof CircuitBreaker)) {
		return new CircuitBreaker(command, opts);
	}

	EventEmitter.call(this);

	const {
		retry = 10000,
		timeout = 0,
		maxError = 10,
		maxTime = 1000,
		fallback = () => Promise.reject(new Error('Service Currently unavailable')),
	} = opts;

	Object.assign(this, {
		timeout: {
			enabled: Boolean(timeout),
			value: timeout,
		},
		maxError,
		maxTime,
		retry,
		command,
		fallback,
	});

	this.state = { isOpen: false, isHalfOpen: false, errorCount: 0 };

	// Reset error count after `maxTime` ms
	setInterval(() => {
		this.state.errorCount = 0;
	}, maxTime);

	// Reset half open state every `retry` ms
	setInterval(() => {
		if (this.state.isOpen) {
			this.state.isHalfOpen = true;
		}
	}, this.retry);
}

function tryCommand(...args) {
	const task = this.timeout.enabled ?
		Promise.race([timeoutProcess(this.timeout.value), this.command(...args)]) :
		this.command(...args);

	return task
		.then(val => {
			if (this.state.isHalfOpen) {
				this.state.isHalfOpen = false;
				this.state.isOpen = false;
				this.emit('closed');
			}
			return val;
		}, err => {
			this.state.errorCount += 1;
			if (this.state.isHalfOpen) {
				this.state.isHalfOpen = false;
			}
			if (this.state.errorCount >= this.maxError) {
				this.state.isOpen = true;
				this.emit('open');
			}
			return Promise.reject(err);
		});
}

function timeoutProcess(time) {
	return new Promise(
		(resolve, reject) =>
		setTimeout(() => reject(new Error('Service Timed Out')), time)
	);
}

function fire(...args) {
	if (this.state.isOpen && !this.state.isHalfOpen) {
		return this.fallback(...args);
	}

	return this.tryCommand(...args);
}

Object.assign(CircuitBreaker.prototype, { fire, timeoutProcess, tryCommand });
module.exports = CircuitBreaker;
